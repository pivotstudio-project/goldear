<template>
  <div>
    <AppHeader>
      <div class="step-indicator">
        <div class="step-dot" :class="{ active: step === 0, done: step > 0 }"></div>
        <div class="step-dot" :class="{ active: step === 1 }"></div>
      </div>
    </AppHeader>

    <main style="min-height:100dvh; display:flex; align-items:center;">
      <div class="container" style="padding-top:32px; padding-bottom:80px; width:100%;">

        <div v-if="step === 0" class="animate-fade-up" style="display: flex; flex-direction: column;">
          <div style="text-align:center; margin-bottom:40px;">
            <p class="caption" style="letter-spacing:0.1em; text-transform:uppercase; margin-bottom:12px;">Step 1 of 2</p>
            <h1 class="heading-1" style="margin-bottom:12px;">볼륨을 맞춰주세요</h1>
            <p class="body" style="color:var(--text-muted);">
              소리를 들으면서 <strong style="color:var(--text);">편안하게 잘 들리는</strong><br />
              볼륨으로 조절해 주세요.
            </p>
          </div>

          <div style="display:flex; justify-content:center; margin-bottom:32px;">
            <div class="sound-wave" :class="{ 'sound-wave--paused': !calibPlaying }">
              <div class="sound-wave__bar" v-for="i in 5" :key="i"></div>
            </div>
          </div>

          <div class="card" style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <span class="caption">볼륨</span>
              <span class="caption gold-text">{{ volume }}%</span>
            </div>
            <input type="range" class="volume-slider" v-model.number="volume" min="1" max="100" />
            <div style="display:flex; justify-content:space-between; margin-top:8px;">
              <span class="caption">🔈 작게</span>
              <span class="caption">🔊 크게</span>
            </div>
          </div>

          <p class="caption" style="text-align:center; margin-bottom:24px;">💡 스피커·이어폰 모두 가능 / 조용한 환경 권장</p>

          <div v-if="isIOS" style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.3); border-radius:var(--radius); padding:14px 16px; margin-bottom:16px;">
            <p class="caption" style="color:#F59E0B; line-height:1.6;">
              📳 <strong>iPhone 사용자</strong> — 옆면 무음 스위치를 꺼주세요.<br />무음 모드에서는 소리가 나오지 않아요.
            </p>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="btn btn--outline btn--full" @click="toggleCalib">
              {{ calibPlaying ? '⏹ 소리 끄기' : '🔊 소리 들어보기' }}
            </button>
            <button class="btn btn--primary btn--full btn--lg" @click="goToSweep">🎵 테스트 시작하기</button>
          </div>
        </div>

        <div v-if="step === 1" style="display: flex; flex-direction: column;">
          <div style="text-align:center; margin-bottom:32px;">
            <p class="caption" style="letter-spacing:0.1em; text-transform:uppercase; margin-bottom:12px;">Step 2 of 2</p>
            <h1 class="heading-1" style="margin-bottom:12px;">소리가 들리나요?</h1>
            <p class="body" style="color:var(--text-muted);">
              소리가 점점 높아져요.<br /><strong style="color:var(--text);">더 이상 들리지 않으면</strong> 버튼을 눌러주세요.
            </p>
          </div>

          <div class="freq-bar-wrap" style="margin-bottom:8px;">
            <div v-for="(freq, index) in LIGHT_FREQS" :key="freq" class="freq-bar"
                 :class="{ active: currentSweepIndex === index, passed: currentSweepIndex > index, failed: isFailed }"
                 :style="{ height: `${[30, 38, 45, 52, 58, 63, 67, 70, 73, 75, 77, 79, 80][index]}px` }"></div>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; padding:0 2px;">
            <span class="caption">8,000 Hz</span>
            <span class="caption">20,000 Hz</span>
          </div>

          <div style="text-align:center; margin-bottom:24px; min-height:72px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <p class="caption" style="margin-bottom:4px;">{{ statusLabel }}</p>
            <p style="font-size:2.5rem; font-weight:800; letter-spacing:-0.03em; color:var(--gold); line-height:1;">{{ currentFreqText }}</p>
          </div>

          <div class="progress-track" style="margin-bottom:48px;">
            <div class="progress-fill" :style="{ width: `${sweepProgress}%` }"></div>
          </div>

          <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
            <template v-if="!sweepStarted">
              <button class="btn btn--primary btn--full btn--lg animate-pulse-gold" @click="runSweep">🎵 시작하기</button>
              <button class="btn btn--outline btn--full" @click="toggleRefTone">
                {{ refTonePlaying ? '⏹ 기준음 끄기' : '🔊 기준음 듣기 (8,000 Hz)' }}
              </button>
            </template>
            <div v-else style="display:flex; flex-direction:column; align-items:center; gap:20px;">
              <button class="btn-stop" @click="cantHear">
                <span style="font-size:2rem;">🔇</span>
                <span>못 들어요</span>
              </button>
              <p class="caption" style="text-align:center;">볼륨은 건드리지 말고<br />소리가 사라지면 눌러주세요</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { GoldEar, LIGHT_FREQS } from '~/utils/audio'

const router = useRouter()
const audio = new GoldEar()

const step = ref(0)
const volume = ref(10)
const calibPlaying = ref(false)
const refTonePlaying = ref(false)
const sweepStarted = ref(false)
const isFailed = ref(false)

const currentSweepIndex = ref(-1)
const sweepProgress = ref(0)
const statusLabel = ref('측정 대기 중')
const currentFreqText = ref('—')

const isIOS = ref(false)
let lastHeardFreq: number | null = null

onMounted(() => {
  isIOS.value = /iPhone|iPad|iPod/i.test(navigator.userAgent)
})

watch(volume, (val) => {
  if (audio.ctx) audio.setVolume(val / 100)
})

const toggleCalib = async () => {
  if (calibPlaying.value) {
    calibPlaying.value = false
    audio.sweepAborted = true
    audio.stop()
    return
  }

  await audio.init()
  calibPlaying.value = true
  audio.sweepAborted = false
  audio.setVolume(volume.value / 100)

  const loop = async () => {
    while (calibPlaying.value) {
      await audio.playCalibration()
      await audio._wait(600)
    }
  }
  loop()
}

const goToSweep = async () => {
  await audio.init()
  audio.stop()
  calibPlaying.value = false
  step.value = 1
}

const toggleRefTone = () => {
  if (refTonePlaying.value) {
    audio.stop()
    refTonePlaying.value = false
    statusLabel.value = '측정 대기 중'
    currentFreqText.value = '—'
    return
  }
  audio.setVolume(volume.value / 100)
  audio.playTone(8000)
  refTonePlaying.value = true
  statusLabel.value = '기준음'
  currentFreqText.value = '8,000'
}

const runSweep = async () => {
  if (refTonePlaying.value) {
    audio.stop()
    refTonePlaying.value = false
  }

  sweepStarted.value = true
  statusLabel.value = '측정 중'
  currentFreqText.value = '—'
  isFailed.value = false

  const sweepVol = Math.max(5, volume.value - 15) / 100
  audio.setVolume(sweepVol)

  await audio.sweep(
    LIGHT_FREQS,
    2500,
    (freq, index) => {
      lastHeardFreq = freq
      currentSweepIndex.value = index
      currentFreqText.value = freq.toLocaleString('ko-KR')
      sweepProgress.value = ((index + 1) / LIGHT_FREQS.length) * 100
    },
    () => {
      lastHeardFreq = LIGHT_FREQS[LIGHT_FREQS.length - 1]
      goToResult()
    }
  )
}

const cantHear = () => {
  if (!sweepStarted.value) return
  audio.stopSweep()
  isFailed.value = true

  const limitIndex = Math.max(0, LIGHT_FREQS.findIndex(f => f === lastHeardFreq) - 1)
  const limitFreq = LIGHT_FREQS[limitIndex]
  setTimeout(() => goToResult(limitFreq), 400)
}

const goToResult = (limitFreq: number | null = null) => {
  const freq = limitFreq || lastHeardFreq || LIGHT_FREQS[0]
  sessionStorage.setItem('goldear_light_result', JSON.stringify({
    limitHz: freq,
    volume: volume.value,
    timestamp: Date.now()
  }))
  router.push('/test/light/result')
}
</script>

<style scoped>
.freq-bar-wrap { display: flex; align-items: flex-end; justify-content: center; gap: 5px; height: 80px; }
.freq-bar { width: 18px; border-radius: 4px 4px 0 0; background: var(--bg-elevated); border: 1px solid var(--border); transition: all 0.3s var(--ease); }
.freq-bar.active { background: var(--gold); border-color: var(--gold); box-shadow: 0 0 12px var(--gold-glow-strong); }
.freq-bar.passed { background: var(--gold-dim); border-color: var(--gold-dim); opacity: 0.5; }
.freq-bar.failed { background: var(--bg-elevated); opacity: 0.2; }
.volume-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 999px; background: var(--bg-elevated); outline: none; cursor: pointer; }
.volume-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: var(--gold); cursor: pointer; box-shadow: 0 0 8px var(--gold-glow-strong); transition: transform 0.2s; }
.btn-stop { width: 160px; height: 160px; border-radius: 50%; background: var(--bg-elevated); border: 2px solid var(--border-hover); color: var(--text); font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.2s var(--ease); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; font-family: var(--font-base); }
.btn-stop:hover { border-color: #ff6b6b; color: #ff6b6b; background: rgba(255,107,107,0.08); transform: scale(1.03); }
</style>
