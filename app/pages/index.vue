<template>
  <div>
    <AppHeader />

    <!-- 히어로 -->
    <section style="min-height:100dvh; display:flex; align-items:center; position:relative; overflow:hidden;">

      <!-- 배경 글로우 -->
      <div style="
        position:absolute; top:20%; left:50%; transform:translateX(-50%);
        width:600px; height:600px;
        background: radial-gradient(circle, rgba(240,192,64,0.08) 0%, transparent 70%);
        pointer-events:none;
      "></div>

      <div class="container" style="position:relative; z-index:1; text-align:center; padding-top:40px; padding-bottom:80px;">

        <!-- 사운드 웨이브 -->
        <div style="display:flex; justify-content:center; margin-bottom:32px;" class="animate-fade-up">
          <div class="sound-wave">
            <div class="sound-wave__bar"></div>
            <div class="sound-wave__bar"></div>
            <div class="sound-wave__bar"></div>
            <div class="sound-wave__bar"></div>
            <div class="sound-wave__bar"></div>
          </div>
        </div>

        <!-- 타이틀 -->
        <h1 class="display animate-fade-up animate-fade-up-delay-1" style="margin-bottom:16px;">
          당신의 귀는<br />
          <span class="gold-text">몇 살인가요?</span>
        </h1>

        <p class="body-lg animate-fade-up animate-fade-up-delay-2" style="color:var(--text-muted); margin-bottom:48px; max-width:480px; margin-left:auto; margin-right:auto;">
          내 귀가 상위 몇 퍼센트인지 궁금하지 않으세요?<br />
          30초면 알 수 있어요. 지금 바로 확인해보세요.
        </p>

        <!-- CTA -->
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px;" class="animate-fade-up animate-fade-up-delay-3">
          <NuxtLink to="/test/light" class="btn btn--primary btn--lg animate-pulse-gold" style="min-width:260px;">
            🎵 30초 테스트 시작
          </NuxtLink>
          <NuxtLink to="/test/pro" class="btn btn--outline" style="min-width:260px;">
            🎧 전문가 모드 도전
          </NuxtLink>
          <p class="caption" style="margin-top:4px;">전문가 모드는 이어폰이 필요해요</p>
        </div>

      </div>
    </section>

    <!-- 설명 섹션 -->
    <section class="section" style="border-top:1px solid var(--border);">
      <div class="container">

        <p class="caption" style="text-align:center; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:16px;">어떻게 진행되나요</p>
        <h2 class="heading-1" style="text-align:center; margin-bottom:56px;">
          두 가지 모드,<br /><span class="gold-text">하나의 목표</span>
        </h2>

        <!-- 라이트 모드 카드 -->
        <div class="card" style="margin-bottom:16px; display:flex; gap:24px; align-items:flex-start;">
          <div style="font-size:2.5rem; flex-shrink:0;">🐬</div>
          <div>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
              <h3 class="heading-2">라이트 모드</h3>
              <span class="grade-badge grade-badge--gold">30초</span>
            </div>
            <p class="body" style="color:var(--text-muted); margin-bottom:16px;">
              장비 상관없이 누구나 가능해요. 소리가 들리면 됩니다.<br />
              주파수 스윕으로 <strong style="color:var(--text);">청력 나이</strong>와 <strong style="color:var(--text);">동물 등급</strong>을 확인하세요.
            </p>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <span class="caption" style="background:var(--bg-elevated); padding:4px 10px; border-radius:var(--radius-full);">🔊 스피커 가능</span>
              <span class="caption" style="background:var(--bg-elevated); padding:4px 10px; border-radius:var(--radius-full);">⚡ 30초</span>
              <span class="caption" style="background:var(--bg-elevated); padding:4px 10px; border-radius:var(--radius-full);">📱 공유 가능</span>
            </div>
          </div>
        </div>

        <!-- 전문가 모드 카드 -->
        <div class="card card--glow" style="display:flex; gap:24px; align-items:flex-start;">
          <div style="font-size:2.5rem; flex-shrink:0;">🎹</div>
          <div>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
              <h3 class="heading-2">전문가 모드</h3>
              <span class="grade-badge grade-badge--diamond">정밀</span>
            </div>
            <p class="body" style="color:var(--text-muted); margin-bottom:16px;">
              이어폰 착용 후 3단계 정밀 테스트.<br />
              변별력 점수와 <strong style="color:var(--text);">음악가 등급</strong>으로 진짜 청각 능력을 확인하세요.
            </p>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <span class="caption" style="background:var(--bg-elevated); padding:4px 10px; border-radius:var(--radius-full);">🎧 이어폰 필수</span>
              <span class="caption" style="background:var(--bg-elevated); padding:4px 10px; border-radius:var(--radius-full);">🎯 정밀 측정</span>
              <span class="caption" style="background:var(--bg-elevated); padding:4px 10px; border-radius:var(--radius-full);">📊 상세 리포트</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- 등급 프리뷰 -->
    <section class="section" style="background:var(--bg-surface); border-top:1px solid var(--border); border-bottom:1px solid var(--border);">
      <div class="container">
        <p class="caption" style="text-align:center; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:16px;">당신은 어느 등급?</p>
        <h2 class="heading-1" style="text-align:center; margin-bottom:40px;">
          <span class="gold-text">황금귀</span>에 도전하세요
        </h2>

        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:32px;">
          <div v-for="grade in grades" :key="grade.label"
               :style="grade.special ? 'background:linear-gradient(135deg, rgba(240,192,64,0.15), rgba(185,242,255,0.1)); border:1px solid var(--gold);' : 'background:var(--bg-elevated); border:1px solid var(--border);'"
               style="text-align:center; padding:20px 12px; border-radius:var(--radius);">
            <div style="font-size:2rem; margin-bottom:8px;">{{ grade.emoji }}</div>
            <div class="caption" :style="`color:${grade.color}; font-weight:700;`">{{ grade.label }}</div>
            <div class="caption" style="margin-top:4px;">{{ grade.hz }}</div>
          </div>
        </div>

        <div style="text-align:center;">
          <NuxtLink to="/test/light" class="btn btn--primary btn--lg">
            내 등급 확인하기
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
const grades = [
  { emoji: '🐘', label: 'BRONZE',  hz: '~8,000Hz',  color: 'var(--grade-bronze)',   special: false },
  { emoji: '🐱', label: 'SILVER',  hz: '~12,000Hz', color: 'var(--grade-silver)',   special: false },
  { emoji: '🦊', label: 'GOLD',    hz: '~15,000Hz', color: 'var(--grade-gold)',     special: false },
  { emoji: '🦅', label: 'PLATINUM',hz: '~17,000Hz', color: 'var(--grade-platinum)', special: false },
  { emoji: '🦇', label: 'DIAMOND', hz: '~19,000Hz', color: 'var(--grade-diamond)',  special: false },
  { emoji: '🐬', label: '황금귀',  hz: '20,000Hz+', color: 'var(--gold)',           special: true  },
]
</script>
