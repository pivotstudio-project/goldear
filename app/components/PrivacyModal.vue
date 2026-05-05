<template>
  <Teleport to="body">
    <div v-if="modelValue" style="position:fixed; inset:0; z-index:200; display:flex; align-items:center; justify-content:center; padding:20px;"
         @click.self="$emit('update:modelValue', false)">

      <!-- 배경 -->
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px);" @click="$emit('update:modelValue', false)"></div>

      <!-- 모달 -->
      <div style="position:relative; z-index:1; width:100%; max-width:600px; max-height:80dvh; overflow-y:auto; background:var(--bg-surface); border:1px solid var(--border-hover); border-radius:var(--radius-lg); padding:32px 24px;">

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
          <h2 class="heading-2">개인정보처리방침</h2>
          <button @click="$emit('update:modelValue', false)" style="color:var(--text-muted); font-size:1.5rem; line-height:1;">✕</button>
        </div>

        <p class="caption" style="margin-bottom:24px;">최종 수정일: 2026년 5월 5일</p>

        <div style="margin-bottom:20px;">
          <p class="body" style="font-weight:600; margin-bottom:8px;">1. 수집하는 개인정보</p>
          <p class="body" style="color:var(--text-muted);">황금귀 챌린지는 서비스 오픈 알림 제공을 위해 이메일 주소를 수집합니다.</p>
        </div>

        <div style="margin-bottom:20px;">
          <p class="body" style="font-weight:600; margin-bottom:8px;">2. 수집 목적</p>
          <p class="body" style="color:var(--text-muted);">전문가 모드 오픈 알림 발송 목적으로만 사용됩니다. 수집한 정보는 제3자에게 제공되지 않습니다.</p>
        </div>

        <div style="margin-bottom:20px;">
          <p class="body" style="font-weight:600; margin-bottom:8px;">3. 보유 및 이용 기간</p>
          <p class="body" style="color:var(--text-muted);">수집된 이메일은 서비스 종료 시 또는 본인이 수신 거부 의사를 밝힌 시점까지 보유합니다.</p>
        </div>

        <div style="margin-bottom:32px;">
          <p class="body" style="font-weight:600; margin-bottom:8px;">4. 수신 거부</p>
          <p class="body" style="color:var(--text-muted);">수신 거부를 원하시면 아래 이메일로 요청해주세요. 즉시 삭제 처리합니다.<br /><br />
            <a href="mailto:info@pivotstudio.co.kr" style="color:var(--gold);">info@pivotstudio.co.kr</a>
          </p>
        </div>

        <button class="btn btn--primary btn--full" @click="$emit('update:modelValue', false)">확인</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
defineEmits(['update:modelValue'])
</script>
