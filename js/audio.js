/**
 * GOLDEAR — Web Audio API 공통 모듈
 *
 * 사용법:
 *   const audio = new GoldEar()
 *   await audio.init()           // 반드시 유저 인터랙션 후 호출
 *   audio.setVolume(0.5)
 *   audio.playTone(1000)         // 1000Hz 재생
 *   audio.stop()
 */

class GoldEar {
  constructor() {
    this.ctx         = null   // AudioContext
    this.oscillator  = null   // OscillatorNode
    this.gainNode    = null   // GainNode (볼륨)
    this.fadeNode    = null   // GainNode (페이드 인/아웃)
    this.volume      = 0.1    // 기본 볼륨 — 낮게 시작, 유저가 올리는 구조
    this.isPlaying   = false
    this.isMobile    = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  }

  // ----------------------------------------
  // 초기화 — 반드시 유저 클릭 이후 호출
  // iOS/Android 자동재생 정책 대응
  // ----------------------------------------
  async init() {
    if (this.ctx) return true

    try {
      const CtxClass = window.AudioContext || window.webkitAudioContext
      if (!CtxClass) {
        console.error('Web Audio API를 지원하지 않는 브라우저입니다.')
        return false
      }
      this.ctx = new CtxClass()

      // iOS에서 suspended 상태로 시작하는 경우 resume
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume()
      }

      return true
    } catch (e) {
      console.error('AudioContext 초기화 실패:', e)
      return false
    }
  }

  // ----------------------------------------
  // 볼륨 설정 (0 ~ 1)
  // ----------------------------------------
  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value))
    if (this.gainNode) {
      this.gainNode.gain.setTargetAtTime(
        this.volume,
        this.ctx.currentTime,
        0.01
      )
    }
  }

  // ----------------------------------------
  // 순수 사인파 재생
  // freq: Hz (ex. 1000)
  // duration: ms (0이면 수동 stop까지 지속)
  // fadeMs: 페이드 인/아웃 시간 (ms)
  // ----------------------------------------
  playTone(freq, duration = 0, fadeMs = 300) {
    if (!this.ctx) return

    this.stop() // 기존 재생 중단

    const now = this.ctx.currentTime
    const fadeSec = fadeMs / 1000

    // 게인 노드 (볼륨)
    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.setValueAtTime(0, now)
    this.gainNode.gain.linearRampToValueAtTime(this.volume, now + fadeSec)

    // 오실레이터
    this.oscillator = this.ctx.createOscillator()
    this.oscillator.type = 'triangle'
    this.oscillator.frequency.setValueAtTime(freq, now)

    // 연결: oscillator → gain → output
    this.oscillator.connect(this.gainNode)
    this.gainNode.connect(this.ctx.destination)

    this.oscillator.start(now)
    this.isPlaying = true

    // duration이 지정된 경우 자동 종료
    if (duration > 0) {
      const stopAt = now + duration / 1000
      this.gainNode.gain.setTargetAtTime(0, stopAt - fadeSec, 0.01)
      this.oscillator.stop(stopAt + 0.1)
      this.oscillator.onended = () => { this.isPlaying = false }
    }
  }

  // ----------------------------------------
  // 주파수 스윕 (라이트 모드용)
  // freqs: [8000, 10000, 12000, ...] Hz 배열
  // stepMs: 각 주파수 재생 시간 (ms)
  // onStep: (freq, index) => {} 콜백
  // onDone: () => {} 완료 콜백
  // ----------------------------------------
  async sweep(freqs, stepMs = 2000, onStep = null, onDone = null) {
    if (!this.ctx) return

    this.stop()
    this.sweepAborted = false

    for (let i = 0; i < freqs.length; i++) {
      if (this.sweepAborted) break

      const freq = freqs[i]
      if (onStep) onStep(freq, i)

      // 각 주파수 재생 (stepMs의 80%만 소리, 나머지 20%는 묵음)
      const playMs  = stepMs * 0.8
      const silentMs = stepMs * 0.2

      this.playTone(freq, playMs)
      await this._wait(playMs)

      if (!this.sweepAborted) {
        this.stop()
        await this._wait(silentMs)
      }
    }

    if (!this.sweepAborted && onDone) onDone()
  }

  // 스윕 중단 (유저가 "안 들려요" 버튼 누를 때)
  stopSweep() {
    this.sweepAborted = true
    this.stop()
  }

  // ----------------------------------------
  // 단일 비프음 (테스트 신호용)
  // ----------------------------------------
  beep(freq = 1000, durationMs = 300) {
    this.playTone(freq, durationMs)
  }

  // ----------------------------------------
  // 3-down-1-up 변별력 테스트용
  // baseFreq 기준으로 ±delta Hz 차이 신호 재생
  // ----------------------------------------
  playABX(baseFreq, deltaHz, targetSlot, intervalMs = 500) {
    // A: 기준음, B: 변형음 (기준 + delta)
    // targetSlot: 0 | 1 | 2 (세 개 중 어느 슬롯이 다른 소리인지)
    const slots = [baseFreq, baseFreq, baseFreq]
    slots[targetSlot] = baseFreq + deltaHz

    return {
      slots,
      playSlot: async (index) => {
        this.playTone(slots[index], intervalMs)
        await this._wait(intervalMs + 100)
      },
      playAll: async () => {
        for (let i = 0; i < 3; i++) {
          if (this.sweepAborted) break
          this.playTone(slots[i], intervalMs)
          await this._wait(intervalMs + 150)
        }
      }
    }
  }

  // ----------------------------------------
  // 재생 중단 (페이드 아웃)
  // ----------------------------------------
  stop(fadeMs = 30) {
    if (!this.oscillator) return

    try {
      const now = this.ctx.currentTime
      const fadeSec = fadeMs / 1000

      if (this.gainNode) {
        this.gainNode.gain.setTargetAtTime(0, now, fadeSec / 3)
      }

      const osc = this.oscillator
      setTimeout(() => {
        try { osc.stop() } catch (_) {}
        try { osc.disconnect() } catch (_) {}
      }, fadeMs + 20)

      this.oscillator = null
      this.gainNode = null
    } catch (e) {}

    this.isPlaying = false
  }

  // ----------------------------------------
  // 볼륨 캘리브레이션용 — 기준음 재생
  // 유저가 "편안하게 들린다" 확인하는 용도
  // ----------------------------------------
  playCalibration() {
    this.playTone(1000) // 1kHz 기준음
  }

  stopCalibration() {
    this.stop()
  }

  // ----------------------------------------
  // 내부 유틸
  // ----------------------------------------
  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // AudioContext 정리
  destroy() {
    this.stop()
    if (this.ctx) {
      this.ctx.close()
      this.ctx = null
    }
  }
}

// ----------------------------------------
// 주파수 → 청력 나이 변환 (라이트 모드)
// 출처: 일반적인 연령별 가청 주파수 기준
// ----------------------------------------
const HearingAge = {
  // 가청 한계 Hz → 추정 청력 나이
  getAge(limitHz) {
    if (limitHz >= 19000) return { age: 10, label: '10대 초반' }
    if (limitHz >= 17000) return { age: 16, label: '10대' }
    if (limitHz >= 15000) return { age: 22, label: '20대 초반' }
    if (limitHz >= 13000) return { age: 28, label: '20대 후반' }
    if (limitHz >= 11000) return { age: 35, label: '30대 중반' }
    if (limitHz >= 9000)  return { age: 45, label: '40대 중반' }
    return                       { age: 55, label: '50대 이상' }
  },

  // 가청 한계 Hz → 동물 등급 (라이트 모드)
  getAnimalGrade(limitHz) {
    if (limitHz >= 19000) return { emoji: '🐬', name: '돌고래',   grade: 'master',   label: '황금귀',   desc: '인간의 한계를 초월했어요' }
    if (limitHz >= 17000) return { emoji: '🦇', name: '박쥐',     grade: 'diamond',  label: 'DIAMOND',  desc: '초음파 근접. 상위 1%' }
    if (limitHz >= 15000) return { emoji: '🦅', name: '독수리',   grade: 'platinum', label: 'PLATINUM', desc: '예민하고 날카로운 귀' }
    if (limitHz >= 13000) return { emoji: '🦊', name: '여우',     grade: 'gold',     label: 'GOLD',     desc: '숲속의 청음가' }
    if (limitHz >= 11000) return { emoji: '🐱', name: '고양이',   grade: 'silver',   label: 'SILVER',   desc: '예민한 편이에요' }
    if (limitHz >= 9000)  return { emoji: '🐄', name: '소',       grade: 'bronze',   label: 'BRONZE',   desc: '평범한 포유류' }
    return                       { emoji: '🐘', name: '코끼리',   grade: 'bronze',   label: 'BRONZE',   desc: '저주파 전문가' }
  },

  // 상위 퍼센트 계산 (대략적 추정)
  getPercentile(limitHz) {
    if (limitHz >= 19000) return 1
    if (limitHz >= 17000) return 5
    if (limitHz >= 15000) return 15
    if (limitHz >= 13000) return 35
    if (limitHz >= 11000) return 60
    if (limitHz >= 9000)  return 80
    return 95
  }
}

// ----------------------------------------
// 전문가 모드 — 음악가 등급
// ----------------------------------------
const MusicianGrade = {
  // JND 점수 (Hz) → 등급
  // 낮을수록 좋음 (작은 차이도 구분)
  getGrade(jndHz) {
    if (jndHz <= 1)   return { name: '돌고래',      grade: 'master',   label: '황금귀',   desc: '인간의 한계를 초월한 변별력' }
    if (jndHz <= 3)   return { name: '모차르트',    grade: 'diamond',  label: 'DIAMOND',  desc: '절대음감에 가까운 변별력' }
    if (jndHz <= 6)   return { name: '퀸시 존스',   grade: 'platinum', label: 'PLATINUM', desc: '프로듀서 황제급 청음력' }
    if (jndHz <= 10)  return { name: '글렌 굴드',   grade: 'gold',     label: 'GOLD',     desc: '디테일에 집착하는 완벽주의자' }
    if (jndHz <= 20)  return { name: '베토벤',      grade: 'silver',   label: 'SILVER',   desc: '음악적 감각이 살아있어요' }
    return                   { name: '일반인 평균', grade: 'bronze',   label: 'BRONZE',   desc: '평균적인 변별력' }
  }
}

// ----------------------------------------
// 라이트 모드 주파수 배열
// ----------------------------------------
const LIGHT_FREQS = [
  8000, 9000, 10000, 11000, 12000,
  13000, 14000, 15000, 16000, 17000,
  18000, 19000, 20000
]

// 전문가 모드 — 3-down-1-up 기준 주파수
const PRO_BASE_FREQ = 1000 // Hz
