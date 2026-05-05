<template>
  <div>
    <AppHeader>
      <NuxtLink to="/test/light" class="btn btn--outline btn--sm">라이트 테스트 하기</NuxtLink>
    </AppHeader>

    <main style="min-height:100dvh;">
      <div class="container" style="padding-top:40px; padding-bottom:80px;">
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

        <!-- 이메일 수집 -->
        <div class="card card--glow" style="margin-bottom:24px;">
          <p class="heading-2" style="margin-bottom:8px;">오픈 알림 받기</p>
          <p class="body" style="color:var(--text-muted); margin-bottom:24px;">
            전문가 모드가 오픈되면 가장 먼저 알려드릴게요.
          </p>

          <div v-if="!isSubscribed">
            <div class="flex flex-col sm:flex-row gap-[10px]" style="margin-bottom:12px;">
              <input
                type="email"
                class="input"
                v-model="email"
                placeholder="이메일 주소 입력"
                @keydown.enter="submitEmail"
              />
              <button
                class="btn btn--primary w-full sm:w-auto sm:flex-shrink-0"
                @click="submitEmail"
                :disabled="isLoading"
              >
                {{ isLoading ? '처리 중...' : '알림 받기' }}
              </button>
            </div>
            <label class="checkbox-wrap">
              <input type="checkbox" v-model="agree" />
              <span class="caption" style="color:var(--text-muted); flex:1;">
                서비스 오픈 알림 수신에 동의합니다.
                <button
                  class="caption"
                  style="color:var(--text-muted); text-decoration:underline; white-space:nowrap; flex-shrink:0;"
                  @click.prevent="showPrivacy = true"
                >
                [내용보기]
              </button>
              </span>
            </label>
            <p v-if="errorMsg" class="caption" style="color:#ff6b6b; margin-top:8px;">{{ errorMsg }}</p>
          </div>

          <div v-else style="text-align:center; padding:16px 0;">
            <p style="font-size:2rem; margin-bottom:8px;">✅</p>
            <p class="body" style="font-weight:600; margin-bottom:4px;">등록됐어요!</p>
            <p class="caption" style="color:var(--text-muted);">오픈되면 가장 먼저 알려드릴게요.</p>
          </div>
        </div>

        <div style="text-align:center;">
          <p class="caption" style="margin-bottom:16px; color:var(--text-muted);">기다리는 동안 라이트 테스트 먼저 해보세요</p>
          <NuxtLink to="/test/light" class="btn btn--outline" style="min-width:240px;">🐬 30초 청력 나이 테스트</NuxtLink>
        </div>
      </div>

      <PrivacyModal v-model="showPrivacy" />
    </main>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const agree = ref(false)
const isSubscribed = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')
const showPrivacy = ref(false)

const submitEmail = async () => {
  errorMsg.value = ''

  if (!email.value || !email.value.includes('@')) {
    errorMsg.value = '올바른 이메일 주소를 입력해주세요.'
    return
  }
  if (!agree.value) {
    errorMsg.value = '알림 수신에 동의해주세요.'
    return
  }

  isLoading.value = true
  try {
    await $fetch('/api/subscribe', {
      method: 'POST',
      body: { email: email.value }
    })
    isSubscribed.value = true
  } catch (e) {
    errorMsg.value = '오류가 발생했어요. 잠시 후 다시 시도해주세요.'
  } finally {
    isLoading.value = false
  }
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
