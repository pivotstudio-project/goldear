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

<template>
  <div>
    <AppHeader>
      <NuxtLink
        to="/test/light"
        class="inline-flex items-center justify-center py-2.5 px-5 rounded-full border border-border-hover text-sm font-semibold transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary-glow"
      >
        라이트 테스트 하기
      </NuxtLink>
    </AppHeader>

    <main class="min-h-dvh">
      <div class="w-full max-w-lg mx-auto px-5 pt-10 pb-20">

        <!-- 헤더 -->
        <div class="text-center mb-14">
          <div class="text-[5rem] mb-6 animate-float">🎧</div>
          <div class="inline-flex items-center gap-2 bg-elevated border border-border-hover rounded-full px-4 py-1.5 mb-5">
            <span class="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span class="text-xs text-primary">개발 중</span>
          </div>
          <h1 class="text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-tight tracking-tight mb-4">
            전문가 모드,<br /><span class="text-primary">곧 찾아와요</span>
          </h1>
          <p class="text-sm text-muted max-w-sm mx-auto leading-relaxed">
            이어폰을 끼고 도전하는 정밀 청각 테스트.<br />음악가 등급과 변별력 점수로 진짜 실력을 확인해보세요.
          </p>
        </div>

        <!-- 예정 기능 -->
        <div class="bg-surface border border-border rounded-2xl p-7 mb-6">
          <p class="text-xs text-muted tracking-widest uppercase mb-5">전문가 모드 예정 기능</p>

          <div class="flex items-center gap-3 py-3.5 border-b border-border">
            <span class="text-2xl">🎯</span>
            <div>
              <p class="text-sm font-semibold">정밀 가청 범위 측정</p>
              <p class="text-xs text-muted">이어폰 기준, Hz 단위 정밀 측정</p>
            </div>
          </div>

          <div class="flex items-center gap-3 py-3.5 border-b border-border">
            <span class="text-2xl">🧠</span>
            <div>
              <p class="text-sm font-semibold">변별력 테스트 (3-down-1-up)</p>
              <p class="text-xs text-muted">얼마나 미세한 차이를 구분할 수 있는지</p>
            </div>
          </div>

          <div class="flex items-center gap-3 py-3.5">
            <span class="text-2xl">🗣️</span>
            <div>
              <p class="text-sm font-semibold">발음 변별 테스트</p>
              <p class="text-xs text-muted">살/쌀, 달/딸 — 고주파 손실이 언어에 미치는 영향</p>
            </div>
          </div>
        </div>

        <!-- 이메일 수집 -->
        <div class="bg-surface border border-border-hover rounded-2xl p-7 shadow-[0_0_40px_var(--color-primary-glow)] mb-6">
          <p class="text-xl font-semibold tracking-tight mb-2">오픈 알림 받기</p>
          <p class="text-sm text-muted mb-6">전문가 모드가 오픈되면 가장 먼저 알려드릴게요.</p>

          <div v-if="!isSubscribed">
            <div class="flex flex-col sm:flex-row gap-2.5 mb-3">
              <input
                type="email"
                v-model="email"
                placeholder="이메일 주소 입력"
                class="flex-1 bg-elevated border border-border rounded-xl px-4 py-3.5 text-sm text-text outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-glow)] placeholder:text-faint"
                @keydown.enter="submitEmail"
              />
              <button
                :disabled="isLoading"
                class="sm:shrink-0 py-3.5 px-6 rounded-xl bg-primary text-bg text-sm font-semibold transition-all duration-300 hover:bg-primary-bright hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                @click="submitEmail"
              >
                {{ isLoading ? '처리 중...' : '알림 받기' }}
              </button>
            </div>

            <label class="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" v-model="agree" class="mt-0.5 accent-primary shrink-0" />
              <span class="text-xs text-muted flex-1">
                서비스 오픈 알림 수신에 동의합니다.
                <button
                  class="text-xs text-muted underline whitespace-nowrap"
                  @click.prevent="showPrivacy = true"
                >
                  [내용보기]
                </button>
              </span>
            </label>

            <p v-if="errorMsg" class="text-xs text-red-400 mt-2">{{ errorMsg }}</p>
          </div>

          <div v-else class="text-center py-4">
            <p class="text-3xl mb-2">✅</p>
            <p class="text-sm font-semibold mb-1">등록됐어요!</p>
            <p class="text-xs text-muted">오픈되면 가장 먼저 알려드릴게요.</p>
          </div>
        </div>

        <!-- 라이트 모드 CTA -->
        <div class="text-center">
          <p class="text-xs text-muted mb-4">기다리는 동안 라이트 테스트 먼저 해보세요</p>
          <NuxtLink
            to="/test/light"
            class="inline-flex items-center justify-center min-w-[240px] py-3.5 px-7 rounded-full border border-border-hover text-text font-semibold transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary-glow"
          >
            🐬 30초 청력 나이 테스트
          </NuxtLink>
        </div>

      </div>

      <PrivacyModal v-model="showPrivacy" />
    </main>
  </div>
</template>
