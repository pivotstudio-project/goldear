<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
defineEmits(['update:modelValue'])
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-200 flex items-center justify-center p-5"
      @click.self="$emit('update:modelValue', false)"
    >
      <!-- 배경 -->
      <div
        class="fixed inset-0 bg-black/70 backdrop-blur-sm"
        @click="$emit('update:modelValue', false)"
      />

      <!-- 모달 -->
      <div class="relative z-10 w-full max-w-xl max-h-[80dvh] overflow-y-auto bg-surface border border-border-hover rounded-2xl px-6 py-8">

        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold tracking-tight">개인정보처리방침</h2>
          <button
            class="text-muted text-2xl leading-none"
            @click="$emit('update:modelValue', false)"
          >
            ✕
          </button>
        </div>

        <p class="text-sm text-muted mb-6">최종 수정일: 2026년 5월 5일</p>

        <div class="mb-5">
          <p class="font-semibold mb-2">1. 수집하는 개인정보</p>
          <p class="text-sm text-muted">황금귀 챌린지는 서비스 오픈 알림 제공을 위해 이메일 주소를 수집합니다.</p>
        </div>

        <div class="mb-5">
          <p class="font-semibold mb-2">2. 수집 목적</p>
          <p class="text-sm text-muted">전문가 모드 오픈 알림 발송 목적으로만 사용됩니다. 수집한 정보는 제3자에게 제공되지 않습니다.</p>
        </div>

        <div class="mb-5">
          <p class="font-semibold mb-2">3. 보유 및 이용 기간</p>
          <p class="text-sm text-muted">수집된 이메일은 서비스 종료 시 또는 본인이 수신 거부 의사를 밝힌 시점까지 보유합니다.</p>
        </div>

        <div class="mb-8">
          <p class="font-semibold mb-2">4. 수신 거부</p>
          <p class="text-sm text-muted">
            수신 거부를 원하시면 아래 이메일로 요청해주세요. 즉시 삭제 처리합니다.<br /><br />
            <a href="mailto:info@pivotstudio.co.kr" class="text-primary">info@pivotstudio.co.kr</a>
          </p>
        </div>

        <button
          class="w-full py-3.5 rounded-full bg-primary text-bg font-semibold text-base transition-all duration-300 hover:bg-primary-bright hover:shadow-[0_0_32px_0_var(--color-primary-glow-strong)] hover:-translate-y-px active:translate-y-0"
          @click="$emit('update:modelValue', false)"
        >
          확인
        </button>

      </div>
    </div>
  </Teleport>
</template>
