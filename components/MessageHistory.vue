<template>
  <!-- Message history container with accessibility support -->
  <div
    data-testid="message-history"
    class="message-history-container overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-sm"
    aria-label="Message history"
    aria-live="polite"
    role="log"
  >
    <!-- Empty state display when no messages exist -->
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
/**
 * MessageHistory component - displays the history of sent messages
 * 
 * Renders a scrollable container for message history with empty state
 * when no messages exist. Includes accessibility features for screen readers.
 * 
 * Currently shows empty state only as per Phase 1 requirements.
 * Message display functionality will be added in Phase 2.
 */

// Define the structure of a message for future use
interface Message {
  id: string
  text: string
  timestamp: Date
  character?: string
}

interface Props {
  messages?: Message[]
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => []
})
</script>

<style scoped>
/* Container styling with fixed dimensions for consistent layout */
.message-history-container {
  min-height: 200px;
  max-height: 400px;
}
</style>
