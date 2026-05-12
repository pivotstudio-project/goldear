<script setup lang="ts">
import { HearingAge } from '~/utils/audio'

const route = useRoute()

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

const ctaMessage = percentile <= 5
  ? '이 결과, 진짜인지 확인해봐야 합니다.'
  : percentile <= 20
    ? '상위권입니다. 더 정확히 측정해보세요.'
    : '생각보다 어렵죠? 제대로 테스트해보세요.'

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
      link: { mobileWebUrl: resultUrl, webUrl: resultUrl },
    },
    buttons: [
      {
        title: '내 청력 나이 확인하기',
        link: { mobileWebUrl: resultUrl, webUrl: resultUrl },
      },
    ],
  })
}

const isIOS = import.meta.client ? /iPhone|iPad|iPod/i.test(navigator.userAgent) : false
const storyImageUrl = ref('')
const showStoryModal = ref(false)

const generateStoryImage = async () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920
  const ctx = canvas.getContext('2d')!

  const img = new Image()
  img.crossOrigin = 'anonymous'
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
    img.src = grade!.image
  })

  ctx.fillStyle = '#080808'
  ctx.fillRect(0, 0, 1080, 1920)

  const imgHeight = Math.round(1080 * 9 / 16)
  ctx.drawImage(img, 0, 0, 1080, imgHeight)

  const gradient = ctx.createLinearGradient(0, imgHeight - 120, 0, imgHeight + 40)
  gradient.addColorStop(0, 'rgba(8, 8, 8, 0)')
  gradient.addColorStop(1, 'rgba(8, 8, 8, 1)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, imgHeight - 120, 1080, 160)

  ctx.fillStyle = 'rgba(240, 192, 64, 0.6)'
  ctx.font = '500 32px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('🦻 황금귀 챌린지', 540, imgHeight + 80)

  ctx.font = '160px sans-serif'
  ctx.fillText(grade!.emoji, 540, imgHeight + 280)

  ctx.fillStyle = '#F0C040'
  ctx.font = 'bold 88px sans-serif'
  ctx.fillText(`${grade!.name} 귀`, 540, imgHeight + 420)

  ctx.fillStyle = '#F0EDE6'
  ctx.font = '600 48px sans-serif'
  ctx.fillText(grade!.headline, 540, imgHeight + 520)

  ctx.fillStyle = 'rgba(240, 237, 230, 0.5)'
  ctx.font = '400 40px sans-serif'
  ctx.fillText(`청력 나이 ${age!.age}세  ·  상위 ${percentile}%`, 540, imgHeight + 620)

  ctx.strokeStyle = 'rgba(240, 192, 64, 0.3)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(240, imgHeight + 720)
  ctx.lineTo(840, imgHeight + 720)
  ctx.stroke()

  ctx.fillStyle = 'rgba(240, 192, 64, 0.8)'
  ctx.font = '500 36px sans-serif'
  ctx.fillText('네 귀는 몇 살? → goldear.kr', 540, imgHeight + 810)

  const dataUrl = canvas.toDataURL('image/png')

  if (isIOS) {
    storyImageUrl.value = dataUrl
    showStoryModal.value = true
  } else {
    const link = document.createElement('a')
    link.download = `goldear-${grade!.grade}-result.png`
    link.href = dataUrl
    link.click()
  }
}
</script>

<template>
  <div>
    <AppHeader>
      <NuxtLink to="/test/pro" class="inline-flex items-center justify-center py-2.5 px-5 rounded-full border border-border-hover text-sm font-semibold transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary-glow">
        전문가 모드 도전
      </NuxtLink>
    </AppHeader>

    <main>
      <div class="w-full max-w-lg mx-auto px-5 pb-20">

        <!-- 결과 없음 -->
        <div v-if="!hasResult" class="text-center pt-10">
          <p class="text-xl font-semibold mb-4">결과가 없어요</p>
          <p class="text-sm text-muted mb-8">테스트를 먼저 진행해주세요.</p>
          <NuxtLink
            to="/test/light"
            class="inline-flex items-center justify-center py-[18px] px-10 rounded-full bg-primary text-bg text-lg font-semibold tracking-tight transition-all duration-300 hover:bg-primary-bright hover:shadow-[0_0_32px_0_var(--color-primary-glow-strong)] hover:-translate-y-px"
          >
            테스트 시작하기
          </NuxtLink>
        </div>

        <div v-else>

          <!-- 1. 이미지 + 헤드라인 -->
          <div class="border border-border-hover rounded-2xl overflow-hidden mb-6 animate-grade-reveal">
            <div class="relative w-full h-[320px] overflow-hidden">
              <img :src="grade!.image" :alt="grade!.name" class="w-full h-full object-cover object-center" />
              <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/85" />
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <p class="text-xs text-text/60 mb-2 tracking-widest uppercase">🦻 황금귀 챌린지</p>
                <p class="text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-tight tracking-tight mb-1.5">{{ grade!.name }} 귀</p>
                <p class="text-xl font-semibold text-primary mb-2">{{ grade!.headline }}</p>
                <p class="text-sm text-muted">{{ grade!.sub }}</p>
              </div>
            </div>
          </div>

          <!-- 2. 공유 -->
          <div class="bg-surface border border-border rounded-2xl p-7 mb-6 animate-count-up">
            <div class="flex gap-2.5 mb-4">
              <button
                class="flex-1 py-3.5 rounded-full bg-[#FEE500] text-[#391B1B] font-semibold text-sm transition-all duration-300 hover:brightness-95"
                @click="shareKakao"
              >
                💬 카톡 공유
              </button>
              <button
                class="flex-1 py-3.5 rounded-full border border-border-hover text-text font-semibold text-sm transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary-glow"
                @click="copyLink"
              >
                🔗 링크 복사
              </button>
            </div>
            <button
              class="w-full py-3.5 rounded-full border border-primary/40 text-primary font-semibold text-sm transition-all duration-300 hover:bg-primary-glow"
              @click="generateStoryImage"
            >
              📸 인스타 스토리용 저장
            </button>
            <p class="text-xs text-muted text-center mt-2">
              {{ isIOS ? '이미지를 길게 눌러서 바로 스토리에 공유해보세요 ✨' : '이미지 저장 후 스토리에 공유해보세요 ✨' }}
            </p>
          </div>

          <!-- 3. 상세 분석 -->
          <div class="bg-surface border border-border rounded-2xl p-7 mb-6">
            <p class="text-xl font-semibold tracking-tight mb-5">상세 분석</p>
            <div class="flex mb-5">
              <div class="flex-1 text-center py-4">
                <p class="text-sm text-muted mb-1.5">청력 나이</p>
                <p class="text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-tight tracking-tight text-primary">
                  {{ age!.age }}<span class="text-sm text-muted font-normal">세</span>
                </p>
              </div>
              <div class="w-px bg-border" />
              <div class="flex-1 text-center py-4">
                <p class="text-sm text-muted mb-1.5">상위</p>
                <p class="text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-tight tracking-tight text-primary">
                  {{ percentile }}<span class="text-sm text-muted font-normal">%</span>
                </p>
              </div>
            </div>
            <div class="bg-elevated rounded-xl px-4 py-3.5">
              <p class="text-sm text-muted leading-relaxed break-keep">
                인간 평균 가청 한계는 약 <strong class="text-text">14,000Hz</strong>예요.<br />
                당신의 가청 한계는 <strong class="text-primary">{{ limitHzVal.toLocaleString() }}Hz</strong>로<br />
                {{ limitHzVal >= 14000 ? '평균보다 뛰어나요.' : '평균보다 낮은 편이에요.' }}
              </p>
            </div>
          </div>

          <!-- 4. 전문가 모드 CTA -->
          <div class="bg-gradient-to-br from-primary/8 to-grade-diamond/5 border border-border-hover rounded-2xl p-6 mb-6">
            <p class="text-xl font-semibold tracking-tight mb-2">🎧 이건 워밍업이에요</p>
            <p class="text-sm text-muted mb-2">{{ ctaMessage }}</p>
            <p class="text-xs text-muted mb-5">
              상위 5%만 통과하는 변별력 테스트,<br />진짜 실력은 여기서 갈립니다.
            </p>
            <NuxtLink
              to="/test/pro"
              class="w-full inline-flex items-center justify-center py-[18px] px-10 rounded-full bg-primary text-bg text-lg font-semibold tracking-tight transition-all duration-300 hover:bg-primary-bright hover:shadow-[0_0_32px_0_var(--color-primary-glow-strong)] hover:-translate-y-px active:translate-y-0"
            >
              🎵 전문가 모드 도전하기
            </NuxtLink>
          </div>

          <div class="text-center mb-5">
            <NuxtLink to="/test/light" class="text-sm text-muted hover:text-text transition-colors duration-300">
              ↩ 다시 테스트하기
            </NuxtLink>
          </div>

        </div>
      </div>
    </main>

    <!-- iOS 스토리 이미지 모달 -->
    <Teleport to="body">
      <div
        v-if="showStoryModal"
        class="fixed inset-0 z-200 bg-black/92 flex flex-col items-center justify-center p-5 gap-5"
        @click.self="showStoryModal = false"
      >
        <button
          class="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-xl text-white"
          @click="showStoryModal = false"
        >
          ✕
        </button>
        <p class="text-sm text-primary text-center leading-relaxed">
          이미지를 <strong>길게 눌러서 저장</strong>한 후<br />인스타 스토리에 올려보세요 📸
        </p>
        <img
          :src="storyImageUrl"
          class="max-w-full max-h-[75dvh] rounded-xl object-contain"
        />
      </div>
    </Teleport>
  </div>
</template>
