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
  audio.setVolume(volume.value / 100)
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

<template>
  <div>
    <AppHeader>
      <div class="flex items-center gap-2">
        <div class="step-dot" :class="{ active: step === 0, done: step > 0 }" />
        <div class="step-dot" :class="{ active: step === 1 }" />
      </div>
    </AppHeader>

    <main class="min-h-dvh flex items-center">
      <div class="w-full max-w-lg mx-auto px-5 pt-8 pb-20">

        <!-- STEP 0: 볼륨 캘리브레이션 -->
        <div v-if="step === 0" class="animate-fade-up flex flex-col">
          <div class="text-center mb-10">
            <p class="text-xs text-muted tracking-widest uppercase mb-3">Step 1 of 2</p>
            <h1 class="text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-tight tracking-tight mb-3">볼륨을 맞춰주세요</h1>
            <p class="text-sm text-muted leading-relaxed">
              소리를 들으면서 <strong class="text-text">편안하게 잘 들리는</strong><br />
              볼륨으로 조절해 주세요.
            </p>
          </div>

          <div class="flex justify-center mb-8">
            <div class="sound-wave" :class="{ 'sound-wave--paused': !calibPlaying }">
              <div class="sound-wave__bar" v-for="i in 5" :key="i" />
            </div>
          </div>

          <div class="bg-surface border border-border rounded-2xl p-7 mb-4">
            <div class="flex justify-between items-center mb-4">
              <span class="text-sm text-muted">볼륨</span>
              <span class="text-sm text-primary font-semibold">{{ volume }}%</span>
            </div>
            <input type="range" class="volume-slider" v-model.number="volume" min="1" max="100" />
            <div class="flex justify-between mt-2">
              <span class="text-sm text-muted">🔈 작게</span>
              <span class="text-sm text-muted">🔊 크게</span>
            </div>
          </div>

          <p class="text-sm text-muted text-center mb-6">💡 스피커·이어폰 모두 가능 / 조용한 환경 권장</p>

          <div v-if="isIOS" class="bg-amber-400/8 border border-amber-400/30 rounded-xl px-4 py-3.5 mb-4">
            <p class="text-xs text-amber-400 leading-relaxed">
              📳 <strong>iPhone 사용자</strong> — 옆면 무음 스위치를 꺼주세요.<br />무음 모드에서는 소리가 나오지 않아요.
            </p>
          </div>

          <div class="flex flex-col gap-2.5">
            <button
              class="w-full py-3.5 px-7 rounded-full border border-border-hover text-text font-semibold transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary-glow"
              @click="toggleCalib"
            >
              {{ calibPlaying ? '⏹ 소리 끄기' : '🔊 소리 들어보기' }}
            </button>
            <button
              class="w-full py-[18px] px-10 rounded-full bg-primary text-bg text-lg font-semibold tracking-tight transition-all duration-300 hover:bg-primary-bright hover:shadow-[0_0_32px_0_var(--color-primary-glow-strong)] hover:-translate-y-px active:translate-y-0"
              @click="goToSweep"
            >
              🎵 테스트 시작하기
            </button>
          </div>
        </div>

        <!-- STEP 1: 스윕 테스트 -->
        <div v-if="step === 1" class="flex flex-col">
          <div class="text-center mb-8">
            <p class="text-xs text-muted tracking-widest uppercase mb-3">Step 2 of 2</p>
            <h1 class="text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-tight tracking-tight mb-3">소리가 들리나요?</h1>
            <p class="text-sm text-muted leading-relaxed">
              소리가 점점 높아져요.<br /><strong class="text-text">더 이상 들리지 않으면</strong> 버튼을 눌러주세요.
            </p>
          </div>

          <div class="freq-bar-wrap mb-2">
            <div
              v-for="(freq, index) in LIGHT_FREQS"
              :key="freq"
              class="freq-bar"
              :class="{ active: currentSweepIndex === index, passed: currentSweepIndex > index, failed: isFailed }"
              :style="{ height: `${[30, 38, 45, 52, 58, 63, 67, 70, 73, 75, 77, 79, 80][index]}px` }"
            />
          </div>
          <div class="flex justify-between mb-2 px-0.5">
            <span class="text-sm text-muted">8,000 Hz</span>
            <span class="text-sm text-muted">20,000 Hz</span>
          </div>

          <div class="text-center mb-6 min-h-[72px] flex flex-col items-center justify-center">
            <p class="text-sm text-muted mb-1">{{ statusLabel }}</p>
            <p class="text-[2.5rem] font-extrabold tracking-[-0.03em] text-primary leading-none">{{ currentFreqText }}</p>
          </div>

          <div class="w-full h-1 bg-elevated rounded-full overflow-hidden mb-12">
            <div
              class="h-full bg-primary rounded-full transition-[width] duration-400 shadow-[0_0_8px_var(--color-primary-glow-strong)]"
              :style="{ width: `${sweepProgress}%` }"
            />
          </div>

          <div class="flex flex-col items-center gap-5">
            <template v-if="!sweepStarted">
              <button
                class="w-full py-[18px] px-10 rounded-full bg-primary text-bg text-lg font-semibold tracking-tight transition-all duration-300 hover:bg-primary-bright hover:shadow-[0_0_32px_0_var(--color-primary-glow-strong)] hover:-translate-y-px active:translate-y-0 animate-pulse-gold"
                @click="runSweep"
              >
                🎵 시작하기
              </button>
              <button
                class="w-full py-3.5 px-7 rounded-full border border-border-hover text-text font-semibold transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary-glow"
                @click="toggleRefTone"
              >
                {{ refTonePlaying ? '⏹ 기준음 끄기' : '🔊 기준음 듣기 (8,000 Hz)' }}
              </button>
            </template>
            <div v-else class="flex flex-col items-center gap-5">
              <button class="btn-stop" @click="cantHear">
                <span class="text-3xl">🔇</span>
                <span>못 들어요</span>
              </button>
              <p class="text-sm text-muted text-center">볼륨은 건드리지 말고<br />소리가 사라지면 눌러주세요</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>
