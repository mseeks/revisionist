<template>
  <div data-testid="messages-counter" class="inline-flex items-center prominent">
    <UBadge 
      color="primary" 
      variant="solid" 
      size="lg"
      class="font-semibold text-sm"
    >
      Messages Remaining: {{ remainingMessages }}
    </UBadge>
  </div>
</template>

<script setup lang="ts">
interface Props {
  remainingMessages?: number
}

const props = withDefaults(defineProps<Props>(), {
  remainingMessages: 5
})
</script>
