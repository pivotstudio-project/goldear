import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
  },

  vite: {
    plugins: [tailwindcss()]
  },

  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  css: ['~/assets/css/style.css'],

  // Sitemap
  sitemap: {
    sitemaps: true,
    urls: [
      { loc: '/', priority: 1.0, changefreq: 'weekly' },
      { loc: '/test/light', priority: 0.9, changefreq: 'monthly' },
      { loc: '/test/pro', priority: 0.8, changefreq: 'monthly' },
    ]
  },

  // Robots
  robots: {
    disallow: [],
    allow: '/',
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: '황금귀 챌린지 — 당신의 귀는 몇 살인가요?',
      meta: [
        { name: 'description', content: '게임처럼 즐기는 청각 인지력 테스트. 30초 만에 당신의 청력 나이를 확인하세요.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: '황금귀 챌린지' },
        { property: 'og:title', content: '황금귀 챌린지 — 당신의 귀는 몇 살?' },
        { property: 'og:description', content: '게임처럼 즐기는 청각 인지력 테스트. 30초 만에 청력 나이 확인.' },
        { property: 'og:url', content: 'https://goldear.kr' },
        { property: 'og:image', content: 'https://goldear.kr/og.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://goldear.kr/og.jpg' },

        { name: 'google-site-verification', content: 'GG4KYbd-KynG_jFLMPU1xtLaFjxTpJmzES_VF_uzU9k' },
        { name: 'naver-site-verification', content: 'e728bb75585a171c4a0abc98b218c8d8b6e32f4a' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css'
        }
      ],
      script: [
        {
          src: '/_vercel/insights/script.js',
          defer: true
        },
        { src: 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js', defer: true }
      ]
    },
  }
})
