<template>
  <div>
    <AppHeader>
      <NuxtLink to="/test/pro" class="btn btn--outline btn--sm">전문가 모드 도전</NuxtLink>
    </AppHeader>

    <main style="padding-top:80px; padding-bottom:80px;">
      <div class="container">

        <div v-if="!hasResult" style="text-align:center; padding:80px 0;">
          <p class="heading-2" style="margin-bottom:16px;">결과가 없어요</p>
          <p class="body" style="color:var(--text-muted); margin-bottom:32px;">테스트를 먼저 진행해주세요.</p>
          <NuxtLink to="/test/light" class="btn btn--primary">테스트 시작하기</NuxtLink>
        </div>

        <div v-else>
          <div class="share-card grade-reveal" style="margin-bottom:24px;">
            <p class="caption" style="letter-spacing:0.1em; text-transform:uppercase; margin-bottom:20px; opacity:0.6;">🦻 황금귀 챌린지 결과</p>
            <div style="font-size:5rem; margin-bottom:12px;">{{ grade.emoji }}</div>
            <div style="margin-bottom:12px; display:flex; justify-content:center;">
              <span class="grade-badge" :class="`grade-badge--${grade.grade}`">{{ grade.label }}</span>
            </div>
            <p class="heading-1" style="margin-bottom:4px;">{{ grade.name }} 귀</p>
            <p class="body" style="color:var(--text-muted);">{{ grade.desc }}</p>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px;" class="count-up">
            <div class="card" style="text-align:center;">
              <p class="caption" style="margin-bottom:8px;">청력 나이</p>
              <p class="heading-1 gold-text">{{ age.age }}</p>
              <p class="caption">세</p>
            </div>
            <div class="card" style="text-align:center;">
              <p class="caption" style="margin-bottom:8px;">상위</p>
              <p class="heading-1 gold-text">{{ percentile }}</p>
              <p class="caption">%</p>
            </div>
          </div>

          <div class="card" style="margin-bottom:24px; display:flex; align-items:center; justify-content:space-between;">
            <div>
              <p class="caption" style="margin-bottom:4px;">가청 한계 주파수</p>
              <p class="heading-2 gold-text">{{ (limitHz / 1000).toFixed(0) }} kHz</p>
            </div>
            <div style="text-align:right;">
              <p class="caption" style="margin-bottom:4px;">인간 평균</p>
              <p class="body" style="color:var(--text-muted);">약 14kHz</p>
            </div>
          </div>

          <div style="background:linear-gradient(135deg, rgba(240,192,64,0.08), rgba(185,242,255,0.05)); border:1px solid var(--border-hover); border-radius:var(--radius-lg); padding:24px; margin-bottom:24px;">
            <p class="heading-2" style="margin-bottom:8px;">🎧 진짜 실력이 궁금하다면?</p>
            <p class="body" style="color:var(--text-muted); margin-bottom:20px;">
              라이트 모드는 참고용이에요. 전문가 모드에서<br /><strong style="color:var(--text);">변별력 점수와 음악가 등급</strong>을 확인해보세요.
            </p>
            <NuxtLink to="/test/pro" class="btn btn--primary btn--full">🎵 전문가 모드 도전하기</NuxtLink>
          </div>

          <div style="margin-bottom:24px;">
            <p class="caption" style="text-align:center; margin-bottom:12px;">결과 공유하기</p>
            <div style="display:flex; gap:10px;">
              <button class="btn btn--outline btn--full" @click="shareKakao">💬 카카오톡</button>
              <button class="btn btn--outline btn--full" @click="copyLink">🔗 링크 복사</button>
            </div>
          </div>

          <div style="text-align:center;">
            <NuxtLink to="/test/light" class="btn btn--ghost btn--sm">↩ 다시 테스트하기</NuxtLink>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { HearingAge } from '~/utils/audio'

const hasResult = ref(false)
const limitHz = ref(0)
const grade = ref<any>({})
const age = ref<any>({})
const percentile = ref(0)

onMounted(() => {
  const raw = sessionStorage.getItem('goldear_light_result')
  if (raw) {
    hasResult.value = true
    const result = JSON.parse(raw)
    limitHz.value = result.limitHz
    grade.value = HearingAge.getAnimalGrade(limitHz.value)
    age.value = HearingAge.getAge(limitHz.value)
    percentile.value = HearingAge.getPercentile(limitHz.value)
  }
})

const copyLink = () => {
  const url = window.location.origin + '/test/light'
  navigator.clipboard.writeText(url).then(() => alert('링크가 복사됐어요! 친구에게 공유해보세요 🦻'))
}

const shareKakao = () => {
  const text = `나의 청력 나이는 ${age.value.age}세! ${grade.value.emoji} ${grade.value.name} 귀 등급 획득 (상위 ${percentile.value}%)\n황금귀 챌린지에서 내 귀 실력 확인해봐!\n${window.location.origin}`
  if (/Android|iPhone/i.test(navigator.userAgent)) {
    window.location.href = `kakaolink://send?text=${encodeURIComponent(text)}`
    setTimeout(() => {
      navigator.clipboard.writeText(text)
      alert('카카오톡을 열 수 없어요. 텍스트가 복사됐으니 직접 붙여넣기 해주세요!')
    }, 1500)
  } else {
    navigator.clipboard.writeText(text).then(() => alert('공유 텍스트가 복사됐어요! 카카오톡에 붙여넣기 해주세요 💬'))
  }
}
</script>

<style scoped>
@keyframes revealGrade {
  0% { transform: scale(0.7) rotate(-5deg); opacity: 0; }
  60% { transform: scale(1.08) rotate(1deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
.grade-reveal { animation: revealGrade 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 0.3s; }
@keyframes countUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.count-up { animation: countUp 0.5s var(--ease) both; animation-delay: 0.8s; }
.share-card { background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%); border: 1px solid var(--border-hover); border-radius: var(--radius-lg); padding: 32px 24px; text-align: center; position: relative; overflow: hidden; }
.share-card::before { content: ''; position: absolute; top: -40px; right: -40px; width: 160px; height: 160px; background: radial-gradient(circle, var(--gold-glow-strong), transparent 70%); pointer-events: none; }
</style>
