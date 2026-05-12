<script setup lang="ts">
const scrolled = ref(false)

onMounted(() => {
  const onScroll = () => { scrolled.value = window.scrollY > 0 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <header
    class="sticky top-0 left-0 right-0 z-100 h-[var(--header-height)] flex items-center justify-between backdrop-blur-md border-b transition-colors duration-300 px-5"
    :class="scrolled ? 'border-border bg-overlay' : 'border-transparent'"
  >
    <NuxtLink href="/" class="text-lg font-extrabold tracking-tight text-primary">
      🦻 황금귀 챌린지
    </NuxtLink>
    <slot />
  </header>
</template>
