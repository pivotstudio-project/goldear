<script setup lang="ts">
</script>

<template>
  <div>
    <AppHeader />

    <main class="pt-10 pb-20">
      <div class="w-full max-w-lg mx-auto px-5">

        <h1 class="text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-tight tracking-tight mb-2">개인정보처리방침</h1>
        <p class="text-sm text-muted mb-12">최종 수정일: 2026년 5월 5일</p>

        <div class="bg-surface border border-border rounded-2xl p-7 mb-4">
          <h2 class="text-xl font-semibold tracking-tight mb-4">1. 수집하는 개인정보</h2>
          <p class="text-sm text-muted">황금귀 챌린지는 서비스 오픈 알림 제공을 위해 이메일 주소를 수집합니다.</p>
        </div>

        <div class="bg-surface border border-border rounded-2xl p-7 mb-4">
          <h2 class="text-xl font-semibold tracking-tight mb-4">2. 수집 목적</h2>
          <p class="text-sm text-muted">전문가 모드 오픈 및 서비스 주요 업데이트 알림 발송에만 사용됩니다. 수집한 정보는 제3자에게 제공되지 않습니다.</p>
        </div>

        <div class="bg-surface border border-border rounded-2xl p-7 mb-4">
          <h2 class="text-xl font-semibold tracking-tight mb-4">3. 보유 및 이용 기간</h2>
          <p class="text-sm text-muted">수집된 이메일은 서비스 종료 시 또는 본인이 수신 거부 의사를 밝힌 시점까지 보유합니다.</p>
        </div>

        <div class="bg-surface border border-border rounded-2xl p-7 mb-12">
          <h2 class="text-xl font-semibold tracking-tight mb-4">4. 수신 거부</h2>
          <p class="text-sm text-muted">
            수신 거부를 원하시면 아래 이메일로 요청해주세요. 즉시 삭제 처리합니다.<br /><br />
            <a href="mailto:info@pivotstudio.co.kr" class="text-primary">info@pivotstudio.co.kr</a>
          </p>
        </div>

        <div class="text-center">
          <NuxtLink to="/" class="inline-flex items-center justify-center text-sm text-muted hover:text-text transition-colors duration-300">
            ← 홈으로 돌아가기
          </NuxtLink>
        </div>

      </div>
    </main>
  </div>
</template>
