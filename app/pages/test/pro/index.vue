<template>
  <div>
    <AppHeader>
      <NuxtLink to="/test/light" class="btn btn--outline btn--sm">라이트 테스트 하기</NuxtLink>
    </AppHeader>

    <main style="min-height:100dvh;">
      <div class="container" style="padding-top:60px; padding-bottom:80px;">
        <div style="text-align:center; margin-bottom:56px;">
          <div class="floating" style="font-size:5rem; margin-bottom:24px;">🎧</div>
          <div style="display:inline-flex; align-items:center; gap:8px; background:var(--bg-elevated); border:1px solid var(--border-hover); border-radius:var(--radius-full); padding:6px 16px; margin-bottom:20px;">
            <span style="width:8px; height:8px; border-radius:50%; background:#F59E0B; display:inline-block;"></span>
            <span class="caption" style="color:var(--gold);">개발 중</span>
          </div>
          <h1 class="heading-1" style="margin-bottom:16px;">전문가 모드,<br /><span class="gold-text">곧 찾아와요</span></h1>
          <p class="body" style="color:var(--text-muted); max-width:400px; margin:0 auto;">
            이어폰을 끼고 도전하는 정밀 청각 테스트.<br />음악가 등급과 변별력 점수로 진짜 실력을 확인해보세요.
          </p>
        </div>

        <div class="card" style="margin-bottom:24px;">
          <p class="caption" style="letter-spacing:0.08em; text-transform:uppercase; margin-bottom:20px; color:var(--text-muted);">전문가 모드 예정 기능</p>
          <div class="grade-row">
            <span style="font-size:1.5rem;">🎯</span>
            <div>
              <p class="body" style="font-weight:600;">정밀 가청 범위 측정</p>
              <p class="caption">이어폰 기준, Hz 단위 정밀 측정</p>
            </div>
          </div>
          <div class="grade-row">
            <span style="font-size:1.5rem;">🧠</span>
            <div>
              <p class="body" style="font-weight:600;">변별력 테스트 (3-down-1-up)</p>
              <p class="caption">얼마나 미세한 차이를 구분할 수 있는지</p>
            </div>
          </div>
          <div class="grade-row">
            <span style="font-size:1.5rem;">🗣️</span>
            <div>
              <p class="body" style="font-weight:600;">발음 변별 테스트</p>
              <p class="caption">살/쌀, 달/딸 — 고주파 손실이 언어에 미치는 영향</p>
            </div>
          </div>
        </div>

        <div style="text-align:center;">
          <p class="caption" style="margin-bottom:16px; color:var(--text-muted);">기다리는 동안 라이트 테스트 먼저 해보세요</p>
          <NuxtLink to="/test/light" class="btn btn--outline" style="min-width:240px;">🐬 30초 청력 나이 테스트</NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const agree = ref(false)
const isSubscribed = ref(false)

const submitEmail = () => {
  if (!email.value || !email.value.includes('@')) {
    alert('올바른 이메일 주소를 입력해주세요.')
    return
  }
  if (!agree.value) {
    alert('알림 수신에 동의해주세요.')
    return
  }
  // TODO: 실제 API 연동 로직 추가
  isSubscribed.value = true
}
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
.floating { animation: float 3s ease-in-out infinite; }
.grade-row { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--border); }
.grade-row:last-child { border-bottom: none; }
</style>
