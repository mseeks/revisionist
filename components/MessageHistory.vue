<template>
  <div
    data-testid="message-history"
    class="message-history-container overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-sm"
    aria-label="Message history"
    role="log"
  >
    <div 
      v-if="!messages || messages.length === 0"
      data-testid="empty-state"
      class="flex flex-col items-center justify-center p-8 text-gray-500"
    >
      <div class="text-center">
        <div class="text-4xl mb-3">💬</div>
        <p class="text-lg font-medium text-gray-600 mb-1">No messages yet</p>
        <p class="text-sm text-gray-500">Messages will appear here as the story unfolds</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  messages?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => []
})
</script>

<style scoped>
.message-history-container {
  min-height: 200px;
  max-height: 400px;
}
</style>
