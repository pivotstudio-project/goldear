<script setup lang="ts">
const grades = [
  { emoji: '🐘', label: 'BRONZE',   hz: '~8,000Hz',  color: 'text-grade-bronze',   special: false },
  { emoji: '🐱', label: 'SILVER',   hz: '~12,000Hz', color: 'text-grade-silver',   special: false },
  { emoji: '🦊', label: 'GOLD',     hz: '~15,000Hz', color: 'text-grade-gold',     special: false },
  { emoji: '🦅', label: 'PLATINUM', hz: '~17,000Hz', color: 'text-grade-platinum', special: false },
  { emoji: '🦇', label: 'DIAMOND',  hz: '~19,000Hz', color: 'text-grade-diamond',  special: false },
  { emoji: '🐬', label: '황금귀',   hz: '20,000Hz+', color: 'text-primary',        special: true  },
]
</script>

<template>
  <div>
    <AppHeader />

    <!-- 히어로 -->
    <section class="min-h-dvh flex items-center relative overflow-hidden">

      <!-- 배경 글로우 -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(240,192,64,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div class="relative z-10 w-full max-w-lg mx-auto px-5 text-center pt-10 pb-20">

        <!-- 사운드 웨이브 -->
        <div class="flex justify-center mb-8 animate-fade-up">
          <div class="sound-wave">
            <div class="sound-wave__bar" v-for="i in 5" :key="i" />
          </div>
        </div>

        <!-- 타이틀 -->
        <h1 class="text-[clamp(2.5rem,8vw,5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] mb-4 animate-fade-up animate-fade-up-delay-1">
          당신의 귀는<br />
          <span class="text-primary">몇 살인가요?</span>
        </h1>

        <p class="text-lg leading-relaxed text-muted mb-12 max-w-md mx-auto animate-fade-up animate-fade-up-delay-2">
          내 귀가 상위 몇 퍼센트인지 궁금하지 않으세요?<br />
          30초면 알 수 있어요. 지금 바로 확인해보세요.
        </p>

        <!-- CTA -->
        <div class="flex flex-col items-center gap-4 animate-fade-up animate-fade-up-delay-3">
          <NuxtLink
            to="/test/light"
            class="inline-flex items-center justify-center gap-2 min-w-[260px] py-[18px] px-10 rounded-full bg-primary text-bg text-lg font-semibold tracking-tight transition-all duration-300 hover:bg-primary-bright hover:shadow-[0_0_32px_0_var(--color-primary-glow-strong)] hover:-translate-y-px active:translate-y-0 animate-pulse-gold"
          >
            🎵 30초 테스트 시작
          </NuxtLink>
          <NuxtLink
            to="/test/pro"
            class="inline-flex items-center justify-center gap-2 min-w-[260px] py-3.5 px-7 rounded-full border border-border-hover text-text font-semibold transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary-glow"
          >
            🎧 전문가 모드 도전
          </NuxtLink>
          <p class="text-sm text-muted mt-1">전문가 모드는 이어폰이 필요해요</p>
        </div>

      </div>
    </section>

    <!-- 설명 섹션 -->
    <section class="py-20 border-t border-border">
      <div class="w-full max-w-lg mx-auto px-5">

        <p class="text-sm text-muted text-center tracking-widest uppercase mb-4">어떻게 진행되나요</p>
        <h2 class="text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-tight tracking-tight text-center mb-14">
          두 가지 모드,<br /><span class="text-primary">하나의 목표</span>
        </h2>

        <!-- 라이트 모드 카드 -->
        <div class="bg-surface border border-border rounded-2xl p-7 mb-4 flex gap-6 items-start transition-colors duration-300 hover:border-border-hover">
          <div class="text-5xl shrink-0">🐬</div>
          <div>
            <div class="flex items-center gap-2.5 mb-2">
              <h3 class="text-xl font-semibold tracking-tight">라이트 모드</h3>
              <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-primary/15 text-grade-gold border border-primary/35">30초</span>
            </div>
            <p class="text-sm text-muted leading-relaxed mb-4">
              장비 상관없이 누구나 가능해요. 소리가 들리면 됩니다.<br />
              주파수 스윕으로 <strong class="text-text">청력 나이</strong>와 <strong class="text-text">동물 등급</strong>을 확인하세요.
            </p>
            <div class="flex gap-2 flex-wrap">
              <span class="text-xs text-muted bg-elevated px-2.5 py-1 rounded-full">🔊 스피커 가능</span>
              <span class="text-xs text-muted bg-elevated px-2.5 py-1 rounded-full">⚡ 30초</span>
              <span class="text-xs text-muted bg-elevated px-2.5 py-1 rounded-full">📱 공유 가능</span>
            </div>
          </div>
        </div>

        <!-- 전문가 모드 카드 -->
        <div class="bg-surface border border-border-hover rounded-2xl p-7 flex gap-6 items-start shadow-[0_0_40px_var(--color-primary-glow)]">
          <div class="text-5xl shrink-0">🎹</div>
          <div>
            <div class="flex items-center gap-2.5 mb-2">
              <h3 class="text-xl font-semibold tracking-tight">전문가 모드</h3>
              <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-grade-diamond/10 text-grade-diamond border border-grade-diamond/30">정밀</span>
            </div>
            <p class="text-sm text-muted leading-relaxed mb-4">
              이어폰 착용 후 3단계 정밀 테스트.<br />
              변별력 점수와 <strong class="text-text">음악가 등급</strong>으로 진짜 청각 능력을 확인하세요.
            </p>
            <div class="flex gap-2 flex-wrap">
              <span class="text-xs text-muted bg-elevated px-2.5 py-1 rounded-full">🎧 이어폰 필수</span>
              <span class="text-xs text-muted bg-elevated px-2.5 py-1 rounded-full">🎯 정밀 측정</span>
              <span class="text-xs text-muted bg-elevated px-2.5 py-1 rounded-full">📊 상세 리포트</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- 등급 프리뷰 -->
    <section class="py-20 bg-surface border-t border-border border-b border-border">
      <div class="w-full max-w-lg mx-auto px-5">

        <p class="text-sm text-muted text-center tracking-widest uppercase mb-4">당신은 어느 등급?</p>
        <h2 class="text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-tight tracking-tight text-center mb-10">
          <span class="text-primary">황금귀</span>에 도전하세요
        </h2>

        <div class="grid grid-cols-3 gap-3 mb-8">
          <div
            v-for="grade in grades"
            :key="grade.label"
            class="text-center py-5 px-3 rounded-xl"
            :class="grade.special
              ? 'bg-gradient-to-br from-primary/15 to-grade-diamond/10 border border-primary'
              : 'bg-elevated border border-border'"
          >
            <div class="text-3xl mb-2">{{ grade.emoji }}</div>
            <div class="text-xs font-bold" :class="grade.color">{{ grade.label }}</div>
            <div class="text-xs text-muted mt-1">{{ grade.hz }}</div>
          </div>
        </div>

        <div class="text-center">
          <NuxtLink
            to="/test/light"
            class="inline-flex items-center justify-center gap-2 py-[18px] px-10 rounded-full bg-primary text-bg text-lg font-semibold tracking-tight transition-all duration-300 hover:bg-primary-bright hover:shadow-[0_0_32px_0_var(--color-primary-glow-strong)] hover:-translate-y-px active:translate-y-0"
          >
            내 등급 확인하기
          </NuxtLink>
        </div>

      </div>
    </section>

  </div>
</template>
