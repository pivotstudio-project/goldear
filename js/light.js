/**
 * GOLDEAR — 라이트 모드 로직 (2스텝)
 */

const audio = new GoldEar()

let lastHeardFreq = null
let sweepStarted  = false
let calibPlaying  = false

// ----------------------------------------
// 스텝 인디케이터
// ----------------------------------------
function showScreen(index) {
  document.querySelectorAll('.screen').forEach((el, i) => {
    el.classList.toggle('active', i === index)
  })
  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.remove('active', 'done')
    if (i < index) dot.classList.add('done')
    if (i === index) dot.classList.add('active')
  })
}

// ----------------------------------------
// 볼륨 슬라이더
// ----------------------------------------
const volumeSlider = document.getElementById('volumeSlider')
const volumeLabel  = document.getElementById('volumeLabel')

volumeSlider.addEventListener('input', () => {
  const val = volumeSlider.value
  volumeLabel.textContent = `${val}%`
  if (audio.ctx) audio.setVolume(val / 100)
})

// ----------------------------------------
// 소리 들어보기 토글
// ----------------------------------------
async function toggleCalib() {
  const btn  = document.getElementById('btnPlay')
  const wave = document.getElementById('calibWave')

  if (calibPlaying) {
    audio.stop()
    calibPlaying = false
    wave.classList.add('sound-wave--paused')
    btn.textContent = '🔊 소리 들어보기'
    return
  }

  // AudioContext는 탭 이벤트 핸들러 내에서 바로 생성해야 iOS 정책 통과
  const CtxClass = window.AudioContext || window.webkitAudioContext
  if (!audio.ctx) audio.ctx = new CtxClass()
  await audio.init()

  audio.setVolume(volumeSlider.value / 100)
  audio.playCalibration()
  calibPlaying = true
  wave.classList.remove('sound-wave--paused')
  btn.textContent = '⏹ 소리 끄기'
}

// ----------------------------------------
// 테스트 시작 — 스윕 화면으로 전환만
// ----------------------------------------
async function goToSweep() {
  // iOS 정책: 탭 이벤트 내에서 즉시 AudioContext 생성
  const CtxClass = window.AudioContext || window.webkitAudioContext
  if (!audio.ctx) audio.ctx = new CtxClass()
  await audio.init()

  audio.stop()
  calibPlaying = false

  buildFreqBars()
  showScreen(1)
}

// ----------------------------------------
// 기준음 토글 (8kHz)
// ----------------------------------------
let refTonePlaying = false

function toggleRefTone() {
  const btn = document.getElementById('btnRefTone')

  if (refTonePlaying) {
    audio.stop()
    refTonePlaying = false
    btn.textContent = '🔊 기준음 듣기 (8,000 Hz)'
    document.getElementById('freqDisplayLabel').textContent = '측정 대기 중'
    document.getElementById('currentFreqLabel').textContent = '—'
    return
  }

  audio.setVolume(parseInt(volumeSlider.value) / 100)
  audio.playTone(8000)
  refTonePlaying = true
  btn.textContent = '⏹ 기준음 끄기'
  document.getElementById('freqDisplayLabel').textContent = '기준음'
  document.getElementById('currentFreqLabel').textContent = '8,000'
}

// ----------------------------------------
// 시작하기 버튼 → 기준음 끄고 스윕 시작
// ----------------------------------------
async function runSweep() {
  // 기준음 재생 중이면 끄기
  if (refTonePlaying) {
    audio.stop()
    refTonePlaying = false
  }

  const btn = document.getElementById('btnSweepStart')
  const refBtn = document.getElementById('btnRefTone')
  btn.style.display = 'none'
  refBtn.style.display = 'none'
  document.getElementById('cantHearWrap').style.display = 'flex'

  sweepStarted  = true
  lastHeardFreq = null

  document.getElementById('freqDisplayLabel').textContent = '측정 중'
  document.getElementById('currentFreqLabel').textContent = '—'

  const sweepVol = Math.max(5, parseInt(volumeSlider.value) - 15) / 100
  audio.setVolume(sweepVol)

  await audio.sweep(
    LIGHT_FREQS,
    2500,
    (freq, index) => {
      lastHeardFreq = freq
      document.getElementById('currentFreqLabel').textContent =
        freq.toLocaleString('ko-KR')

      const progress = ((index + 1) / LIGHT_FREQS.length) * 100
      document.getElementById('sweepProgress').style.width = `${progress}%`

      LIGHT_FREQS.forEach((_, i) => {
        const bar = document.getElementById(`bar-${i}`)
        if (!bar) return
        bar.classList.remove('active', 'passed', 'failed')
        if (i < index) bar.classList.add('passed')
        if (i === index) bar.classList.add('active')
      })
    },
    () => {
      lastHeardFreq = LIGHT_FREQS[LIGHT_FREQS.length - 1]
      goToResult()
    }
  )
}

// ----------------------------------------
// 주파수 바 생성
// ----------------------------------------
function buildFreqBars() {
  const wrap = document.getElementById('freqBars')
  wrap.innerHTML = ''
  const heights = [30, 38, 45, 52, 58, 63, 67, 70, 73, 75, 77, 79, 80]
  LIGHT_FREQS.forEach((_, i) => {
    const bar = document.createElement('div')
    bar.className = 'freq-bar'
    bar.style.height = `${heights[i]}px`
    bar.id = `bar-${i}`
    wrap.appendChild(bar)
  })
}

// ----------------------------------------
// 못 들어요
// ----------------------------------------
function cantHear() {
  if (!sweepStarted) return
  audio.stopSweep()

  const currentFreq = lastHeardFreq
  LIGHT_FREQS.forEach((freq, i) => {
    const bar = document.getElementById(`bar-${i}`)
    if (!bar) return
    if (freq >= currentFreq) {
      bar.classList.remove('active', 'passed')
      bar.classList.add('failed')
    }
  })

  const limitIndex = Math.max(0, LIGHT_FREQS.indexOf(currentFreq) - 1)
  const limitFreq  = LIGHT_FREQS[limitIndex]

  setTimeout(() => goToResult(limitFreq), 400)
}

// ----------------------------------------
// 결과 페이지로
// ----------------------------------------
function goToResult(limitFreq = null) {
  const freq = limitFreq || lastHeardFreq || LIGHT_FREQS[0]
  sessionStorage.setItem('goldear_light_result', JSON.stringify({
    limitHz:   freq,
    volume:    parseInt(volumeSlider.value),
    timestamp: Date.now()
  }))
  window.location.href = 'light-result.html'
}
