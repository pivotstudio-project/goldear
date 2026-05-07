<script setup lang="ts">
import { HearingAge } from '~/utils/audio'

const route = useRoute()

// SSR 안정화 — computed 체인 끊고 즉시 계산
const hz = Number(route.query.hz || 0)

const grade = hz > 0
  ? HearingAge.getAnimalGrade(hz)
  : (import.meta.client
    ? (() => {
      const raw = sessionStorage.getItem('goldear_light_result')
      return raw ? HearingAge.getAnimalGrade(JSON.parse(raw).limitHz) : null
    })()
    : null)

const limitHzVal = hz > 0
  ? hz
  : (import.meta.client
    ? (() => {
      const raw = sessionStorage.getItem('goldear_light_result')
      return raw ? JSON.parse(raw).limitHz : 0
    })()
    : 0)

const age = limitHzVal > 0 ? HearingAge.getAge(limitHzVal) : null
const percentile = limitHzVal > 0 ? HearingAge.getPercentile(limitHzVal) : 0

const hasResult = !!grade && limitHzVal > 0

const ogImageUrl = grade
  ? `https://goldear.kr/og?${new URLSearchParams({
    grade: grade.grade,
    name: grade.name,
    age: String(age?.age ?? 0),
    percentile: String(percentile),
    desc: grade.desc,
    image: grade.image,
  }).toString()}`
  : 'https://goldear.kr/og.jpg'

// SSR OG — 즉시 값으로 박기
useHead({
  title: grade ? `나의 청력 나이는 ${age?.age}세! — 황금귀 챌린지` : '황금귀 챌린지',
})

useSeoMeta({
  ogTitle: grade ? `나의 청력 나이는 ${age?.age}세! ${grade.emoji}` : '황금귀 챌린지',
  ogDescription: grade ? `${grade.headline} — ${grade.desc} | goldear.kr` : '게임처럼 즐기는 청각 인지력 테스트',
  ogImage: ogImageUrl,
  ogUrl: `https://goldear.kr/test/light/result?hz=${limitHzVal}`,
  twitterCard: 'summary_large_image',
  twitterImage: ogImageUrl,
})

const resultUrl = `https://goldear.kr/test/light/result?hz=${limitHzVal}`

// 조건부 CTA 메시지
const ctaMessage = percentile <= 5
  ? '이 결과, 진짜인지 확인해봐야 합니다.'
  : percentile <= 20
    ? '상위권입니다. 더 정확히 측정해보세요.'
    : '생각보다 어렵죠? 제대로 테스트해보세요.'

// 카카오 description — 숫자 + 비교
const kakaoDescription = `상위 ${percentile}% 청력 👀\n${grade?.share ?? ''}\n친구랑 비교해보세요`

const copyLink = () => {
  navigator.clipboard.writeText(resultUrl).then(() => {
    alert('결과 링크가 복사됐어요! 친구에게 공유해보세요 🦻')
  })
}

const shareKakao = () => {
  if (!window.Kakao) {
    alert('카카오톡 SDK를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.')
    return
  }
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init('0e38b601f174f1e29ea7c63fe7a942a6')
  }
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `나의 청력 나이는 ${age?.age}세! ${grade?.emoji}`,
      description: kakaoDescription,
      imageUrl: ogImageUrl,
      link: {
        mobileWebUrl: resultUrl,
        webUrl: resultUrl,
      },
    },
    buttons: [
      {
        title: '내 청력 나이 확인하기',
        link: {
          mobileWebUrl: resultUrl,
          webUrl: resultUrl,
        },
      },
    ],
  })
}

const generateStoryImage = async () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920
  const ctx = canvas.getContext('2d')!

  // 1. 동물 이미지 로드
  const img = new Image()
  img.crossOrigin = 'anonymous'
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
    img.src = grade!.image
  })

  // 2. 배경 이미지 (상단 70% 채움)
  ctx.drawImage(img, 0, 0, 1080, 1920)

  // 3. 하단 그라디언트 오버레이
  const gradient = ctx.createLinearGradient(0, 800, 0, 1920)
  gradient.addColorStop(0, 'rgba(8, 8, 8, 0)')
  gradient.addColorStop(0.4, 'rgba(8, 8, 8, 0.85)')
  gradient.addColorStop(1, 'rgba(8, 8, 8, 1)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1080, 1920)

  // 4. 상단 브랜드
  ctx.fillStyle = 'rgba(240, 192, 64, 0.9)'
  ctx.font = '600 36px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('🦻 황금귀 챌린지', 540, 80)

  // 5. 등급 이모지 (크게)
  ctx.font = '180px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(grade!.emoji, 540, 1200)

  // 6. 등급명
  ctx.fillStyle = '#F0C040'
  ctx.font = 'bold 96px sans-serif'
  ctx.fillText(`${grade!.name} 귀`, 540, 1340)

  // 7. 헤드라인
  ctx.fillStyle = '#F0EDE6'
  ctx.font = '600 52px sans-serif'
  ctx.fillText(grade!.headline, 540, 1430)

  // 8. 청력 나이 + 상위 %
  ctx.fillStyle = 'rgba(240, 237, 230, 0.6)'
  ctx.font = '400 44px sans-serif'
  ctx.fillText(`청력 나이 ${age!.age}세  ·  상위 ${percentile}%`, 540, 1530)

  // 9. 구분선
  ctx.strokeStyle = 'rgba(240, 192, 64, 0.4)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(240, 1610)
  ctx.lineTo(840, 1610)
  ctx.stroke()

  // 10. CTA
  ctx.fillStyle = 'rgba(240, 192, 64, 0.8)'
  ctx.font = '500 38px sans-serif'
  ctx.fillText('너는 몇 등급? → goldear.kr', 540, 1690)

  // 11. 다운로드
  const link = document.createElement('a')
  link.download = `goldear-${grade!.grade}-result.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
</script>

<template>
  <div>
    <AppHeader>
      <NuxtLink to="/test/pro" class="btn btn--outline btn--sm">전문가 모드 도전</NuxtLink>
    </AppHeader>

    <main style="padding-bottom:80px;">
      <div class="container">

        <div v-if="!hasResult" style="text-align:center; padding:80px 0;">
          <p class="heading-2" style="margin-bottom:16px;">결과가 없어요</p>
          <p class="body" style="color:var(--text-muted); margin-bottom:32px;">테스트를 먼저 진행해주세요.</p>
          <NuxtLink to="/test/light" class="btn btn--primary">테스트 시작하기</NuxtLink>
        </div>

        <div v-else>

          <!-- 1. 이미지 + 헤드라인 -->
          <div class="result-card grade-reveal" style="margin-bottom:24px;">
            <div class="animal-image-wrap">
              <img :src="grade!.image" :alt="grade!.name" class="animal-image" />
              <div class="animal-image-overlay" />
              <div class="animal-image-text">
                <p class="caption" style="opacity:0.6; margin-bottom:8px; letter-spacing:0.1em; text-transform:uppercase;">🦻 황금귀 챌린지</p>
                <p class="heading-1" style="margin-bottom:6px;">{{ grade!.name }} 귀</p>
                <p style="font-size:1.25rem; font-weight:600; color:var(--gold); margin-bottom:8px;">{{ grade!.headline }}</p>
                <p class="body" style="color:var(--text-muted);">{{ grade!.sub }}</p>
              </div>
            </div>
          </div>

          <!-- 2. 공유 -->
          <div class="card count-up" style="margin-bottom:24px;">
            <p class="caption" style="text-align:center; margin-bottom:4px; color:var(--text-muted);">친구한테 보내보세요</p>
            <p class="body" style="text-align:center; margin-bottom:16px; font-weight:600;">{{ grade!.share }}</p>
            <div style="display:flex; gap:10px; margin-bottom:16px;">
              <button
                class="btn btn--full"
                @click="shareKakao"
                style="border:1px solid #FEE500; color:#391B1B; background-color:#FEE500; border-radius:var(--radius-full); font-weight:600;"
              >
                💬 카톡 공유
              </button>
              <button class="btn btn--outline btn--full" @click="copyLink">
                🔗 링크 복사
              </button>
            </div>

            <button
              class="btn btn--outline btn--full"
              @click="generateStoryImage"
              style="border-color: rgba(240,192,64,0.4); color: var(--gold);"
            >
              📸 인스타 스토리용 저장
            </button>
            <p class="caption" style="text-align:center; margin-top:8px; color:var(--text-faint);">
              저장 후 스토리에 올리고 링크 스티커 붙여보세요
            </p>
          </div>

          <!-- 3. 상세 분석 -->
          <div class="card" style="margin-bottom:24px;">
            <p class="heading-2" style="margin-bottom:20px;">상세 분석</p>
            <div style="display:flex; margin-bottom:20px;">
              <div style="flex:1; text-align:center; padding:16px 0;">
                <p class="caption" style="margin-bottom:6px;">청력 나이</p>
                <p class="heading-1 gold-text">{{ age!.age }}<span class="caption">세</span></p>
              </div>
              <div style="width:1px; background:var(--border);"></div>
              <div style="flex:1; text-align:center; padding:16px 0;">
                <p class="caption" style="margin-bottom:6px;">상위</p>
                <p class="heading-1 gold-text">{{ percentile }}<span class="caption">%</span></p>
              </div>
            </div>
            <div style="background:var(--bg-elevated); border-radius:var(--radius); padding:14px 16px;">
              <p class="caption" style="line-height:1.7;">
                인간 평균 가청 한계는 약 <strong style="color:var(--text);">14,000Hz</strong>예요.
                당신의 가청 한계는 <strong style="color:var(--gold);">{{ limitHzVal.toLocaleString() }}Hz</strong>로
                {{ limitHzVal >= 14000 ? '평균보다 뛰어나요.' : '평균보다 낮은 편이에요.' }}
              </p>
            </div>
          </div>

          <!-- 4. 전문가 모드 CTA -->
          <div style="background:linear-gradient(135deg, rgba(240,192,64,0.08), rgba(185,242,255,0.05)); border:1px solid var(--border-hover); border-radius:var(--radius-lg); padding:24px; margin-bottom:24px;">
            <p class="heading-2" style="margin-bottom:8px;">🎧 이건 워밍업이에요</p>
            <p class="body" style="color:var(--text-muted); margin-bottom:8px;">
              {{ ctaMessage }}
            </p>
            <p class="caption" style="color:var(--text-muted); margin-bottom:20px;">
              상위 5%만 통과하는 변별력 테스트 — 진짜 실력은 여기서 갈립니다.
            </p>
            <NuxtLink to="/test/pro" class="btn btn--primary btn--full">
              🎵 전문가 모드 도전하기
            </NuxtLink>
          </div>

          <div style="text-align:center;">
            <NuxtLink to="/test/light" class="btn btn--ghost btn--sm">↩ 다시 테스트하기</NuxtLink>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@keyframes revealGrade {
  0%   { transform: scale(0.7) rotate(-5deg); opacity: 0; }
  60%  { transform: scale(1.08) rotate(1deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
.grade-reveal {
  animation: revealGrade 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 0.3s;
}

@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.count-up {
  animation: countUp 0.5s var(--ease) both;
  animation-delay: 0.8s;
}

.result-card {
  border: 1px solid var(--border-hover);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.animal-image-wrap {
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
}

.animal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.animal-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(8,8,8,0.1) 0%, rgba(8,8,8,0.85) 70%, rgba(8,8,8,1) 100%);
}

.animal-image-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
}
</style>
