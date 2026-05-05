// ----------------------------------------
// 타입 정의
// ----------------------------------------
interface AgeResult {
  age: number
  label: string
}

interface AnimalGrade {
  emoji: string
  name: string
  grade: string
  label: string
  desc: string
  image: string
  headline: string
  sub: string
  share: string
  tags: string[]
}

interface MusicianGradeResult {
  name: string
  grade: string
  label: string
  desc: string
}

interface ABXResult {
  slots: number[]
  playSlot: (index: number) => Promise<void>
  playAll: () => Promise<void>
}

// ----------------------------------------
// GoldEar 클래스
// ----------------------------------------
export class GoldEar {
  ctx: AudioContext | null = null
  oscillator: OscillatorNode | null = null
  gainNode: GainNode | null = null
  volume: number = 0.1
  isPlaying: boolean = false
  isMobile: boolean = false
  sweepAborted: boolean = false

  constructor() {
    if (typeof navigator !== 'undefined') {
      this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    }
  }

  async init(): Promise<boolean> {
    try {
      const CtxClass = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext
      if (!CtxClass) {
        console.error('Web Audio API를 지원하지 않는 브라우저입니다.')
        return false
      }

      if (!this.ctx) {
        this.ctx = new CtxClass()
      }

      if (this.ctx.state !== 'running') {
        await this.ctx.resume()
      }

      return true
    } catch (e) {
      console.error('AudioContext 초기화 실패:', e)
      return false
    }
  }

  setVolume(value: number): void {
    this.volume = Math.max(0, Math.min(1, value))
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.01)
    }
  }

  playTone(freq: number, duration: number = 0, fadeMs: number = 300): void {
    if (!this.ctx) return

    this.stop()

    const now = this.ctx.currentTime
    const fadeSec = fadeMs / 1000

    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.setValueAtTime(0, now)
    this.gainNode.gain.linearRampToValueAtTime(this.volume, now + fadeSec)

    this.oscillator = this.ctx.createOscillator()
    this.oscillator.type = 'triangle'
    this.oscillator.frequency.setValueAtTime(freq, now)

    this.oscillator.connect(this.gainNode)
    this.gainNode.connect(this.ctx.destination)

    this.oscillator.start(now)
    this.isPlaying = true

    if (duration > 0) {
      const stopAt = now + duration / 1000
      this.gainNode.gain.setTargetAtTime(0, stopAt - fadeSec, 0.01)
      this.oscillator.stop(stopAt + 0.1)
      this.oscillator.onended = () => { this.isPlaying = false }
    }
  }

  // freqs 타입을 readonly number[]로 변경하여 상수 입력 시의 에러 방지
  async sweep(
    freqs: readonly number[],
    stepMs: number = 2000,
    onStep: ((freq: number, index: number) => void) | null = null,
    onDone: (() => void) | null = null
  ): Promise<void> {
    if (!this.ctx) return

    this.stop()
    this.sweepAborted = false

    for (let i = 0; i < freqs.length; i++) {
      if (this.sweepAborted) break

      const freq = freqs[i]

      if (freq === undefined) continue

      if (onStep) onStep(freq, i)

      const playMs = stepMs * 0.8
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

  stopSweep(): void {
    this.sweepAborted = true
    this.stop()
  }

  beep(freq: number = 1000, durationMs: number = 300): void {
    this.playTone(freq, durationMs)
  }

  playABX(baseFreq: number, deltaHz: number, targetSlot: number, intervalMs: number = 500): ABXResult {
    // slots 배열을 명확하게 number[]로 추론하도록 설정
    const slots: number[] = [baseFreq, baseFreq, baseFreq]
    slots[targetSlot] = baseFreq + deltaHz

    return {
      slots,
      playSlot: async (index: number): Promise<void> => {
        const freq = slots[index]
        if (freq === undefined) return
        this.playTone(freq, intervalMs)
        await this._wait(intervalMs + 100)
      },
      playAll: async (): Promise<void> => {
        for (let i = 0; i < slots.length; i++) {
          if (this.sweepAborted) break
          this.playTone(slots[i]!, intervalMs)
          await this._wait(intervalMs + 150)
        }
      }
    }
  }

  stop(fadeMs: number = 30): void {
    if (!this.oscillator || !this.ctx) return

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
    } catch (_) {}

    this.isPlaying = false
  }

  async playCalibration(): Promise<void> {
    if (!this.ctx) return

    const notes = [
      { freq: 261.63, dur: 300 },
      { freq: 293.66, dur: 300 },
      { freq: 329.63, dur: 300 },
      { freq: 349.23, dur: 300 },
      { freq: 392.00, dur: 500 },
    ]

    for (const note of notes) {
      if (this.sweepAborted) break
      this.playTone(note.freq, note.dur, 30)
      await this._wait(note.dur + 60)
    }
  }

  stopCalibration(): void {
    this.stop()
  }

  _wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  destroy(): void {
    this.stop()
    if (this.ctx) {
      this.ctx.close()
      this.ctx = null
    }
  }
}

// ----------------------------------------
// 데이터 및 헬퍼 객체 (HearingAge / MusicianGrade)
// ----------------------------------------
export const HearingAge = {
  getAge(limitHz: number): AgeResult {
    if (limitHz >= 19000) return { age: 10, label: '10대 초반' }
    if (limitHz >= 17000) return { age: 16, label: '10대' }
    if (limitHz >= 15000) return { age: 22, label: '20대 초반' }
    if (limitHz >= 13000) return { age: 28, label: '20대 후반' }
    if (limitHz >= 11000) return { age: 35, label: '30대 중반' }
    if (limitHz >= 9000)  return { age: 45, label: '40대 중반' }
    return                       { age: 55, label: '50대 이상' }
  },

  getAnimalGrade(limitHz: number): AnimalGrade {
    if (limitHz >= 19000) return {
      emoji: '🐬',
      name: '돌고래',
      grade: 'master',
      label: '황금귀',
      desc: '바다의 천재, 소리로 세상을 읽는 타입',
      image: '/animals/dolphin.jpg',

      headline: '소리를 “보는” 인간',
      sub: '압축 음원 들으면 스트레스 받는 타입',
      share: '나 이거까지 들림. 너는?',
      tags: ['#황금귀', '#레퍼런스귀', '#장비욕발동']
    }

    if (limitHz >= 17000) return {
      emoji: '🦇',
      name: '박쥐',
      grade: 'diamond',
      label: 'DIAMOND',
      desc: '어둠 속의 항법사, 남들이 못 듣는 걸 듣는 타입',
      image: '/animals/bat.jpg',

      headline: '안 들리는 게 없음',
      sub: '남들은 모르는 노이즈까지 캐치함',
      share: '이거 들리면 정상 아님 (좋은 의미로)',
      tags: ['#숨은소리헌터', '#고역집착', '#예민MAX']
    }

    if (limitHz >= 15000) return {
      emoji: '🦅',
      name: '독수리',
      grade: 'platinum',
      label: 'PLATINUM',
      desc: '하늘의 사냥꾼, 디테일을 놓치지 않는 타입',
      image: '/animals/eagle.jpg',

      headline: '디테일 집착형 귀',
      sub: '“뭔가 이상한데?”를 정확히 맞추는 타입',
      share: '믹싱 이상하면 바로 느낌 옴',
      tags: ['#디테일중독', '#분석형', '#귀믿고간다']
    }

    if (limitHz >= 13000) return {
      emoji: '🦊',
      name: '여우',
      grade: 'gold',
      label: 'GOLD',
      desc: '숲속의 귀족, 영리하고 예민한 타입',
      image: '/animals/fox.jpg',

      headline: '눈치 100단 귀',
      sub: '좋고 나쁨은 확실히 구분함',
      share: '이 정도면 상위권은 맞지?',
      tags: ['#밸런스형', '#감각좋음', '#은근고수']
    }

    if (limitHz >= 11000) return {
      emoji: '🐱',
      name: '고양이',
      grade: 'silver',
      label: 'SILVER',
      desc: '집사를 지배하는 자, 듣고도 못 들은 척하는 타입',
      image: '/animals/cat.jpg',

      headline: '선택적 청취자',
      sub: '듣긴 들리는데 굳이 신경 안 씀',
      share: '들려도 안 듣는 게 편함',
      tags: ['#귀차니즘', '#감성우선', '#적당히좋음']
    }

    if (limitHz >= 9000) return {
      emoji: '🐄',
      name: '소',
      grade: 'bronze',
      label: 'BRONZE',
      desc: '초원의 터줏대감, 묵묵히 자기 길을 가는 타입',
      image: '/animals/cow.jpg',

      headline: '웬만하면 다 OK',
      sub: '음질? 크게 상관 없는 타입',
      share: '나쁘지만 않으면 됨',
      tags: ['#둔감아님편안함', '#막귀아님', '#스트레스없음']
    }

    return {
      emoji: '🐘',
      name: '코끼리',
      grade: 'bronze',
      label: 'BRONZE',
      desc: '대지의 지혜자, 낮은 곳의 진실을 아는 타입',
      image: '/animals/elephant.jpg',

      headline: '저음 마스터',
      sub: '베이스 나오면 게임 끝',
      share: '고음은 모르겠고 이건 좋다',
      tags: ['#베이스충', '#리듬형', '#몸으로듣는다']
    }
  },

  getPercentile(limitHz: number): number {
    if (limitHz >= 19000) return 1
    if (limitHz >= 17000) return 5
    if (limitHz >= 15000) return 15
    if (limitHz >= 13000) return 35
    if (limitHz >= 11000) return 60
    if (limitHz >= 9000)  return 80
    return 95
  }
}

export const MusicianGrade = {
  getGrade(jndHz: number): MusicianGradeResult {
    if (jndHz <= 1)  return { name: '돌고래',      grade: 'master',   label: '황금귀',  desc: '인간의 한계를 초월한 변별력' }
    if (jndHz <= 3)  return { name: '모차르트',    grade: 'diamond',  label: 'DIAMOND', desc: '절대음감에 가까운 변별력' }
    if (jndHz <= 6)  return { name: '퀸시 존스',   grade: 'platinum', label: 'PLATINUM',desc: '프로듀서 황제급 청음력' }
    if (jndHz <= 10) return { name: '글렌 굴드',   grade: 'gold',     label: 'GOLD',    desc: '디테일에 집착하는 완벽주의자' }
    if (jndHz <= 20) return { name: '베토벤',      grade: 'silver',   label: 'SILVER',  desc: '음악적 감각이 살아있어요' }
    return                  { name: '일반인 평균', grade: 'bronze',   label: 'BRONZE',  desc: '평균적인 변별력' }
  }
}

// ----------------------------------------
// 상수
// ----------------------------------------
export const LIGHT_FREQS = [
  8000, 9000, 10000, 11000, 12000,
  13000, 14000, 15000, 16000, 17000,
  18000, 19000, 20000
] as const // const assertion을 사용해도 sweep에서 readonly로 받으므로 에러가 나지 않습니다.

export const PRO_BASE_FREQ = 1000
