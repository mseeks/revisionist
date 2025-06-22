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
      v-if="gameStore.messageHistory.length === 0"
      data-testid="empty-state"
      class="flex flex-col items-center justify-center p-8 text-gray-500"
    >
      <div class="text-center">
        <div class="text-4xl mb-3">💬</div>
        <p class="text-lg font-medium text-gray-600 mb-1">No messages yet</p>
        <p class="text-sm text-gray-500">Messages will appear here as the story unfolds</p>
      </div>
    </div>

    <!-- Message list display -->
    <div v-else class="p-4 space-y-3">
      <div
        v-for="(message, index) in gameStore.messageHistory"
        :key="index"
        data-testid="message-item"
        :data-sender="message.sender"
        class="message-item"
      >
        <!-- User message styling -->
        <div
          v-if="message.sender === 'user'"
          class="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg"
        >
          <div class="flex items-start">
            <div class="flex-1">
              <p class="text-sm font-medium text-blue-800 mb-1">
                {{ formatSender(message.sender) }}
              </p>
              <p class="text-gray-800">{{ message.text }}</p>
              <p class="text-xs text-gray-500 mt-2" data-testid="message-timestamp">
                {{ formatTimestamp(message.timestamp) }}
              </p>
            </div>
          </div>
        </div>

        <!-- AI message styling -->
        <div
          v-else-if="message.sender === 'ai'"
          class="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg"
        >
          <div class="flex items-start">
            <div class="flex-1">
              <p class="text-sm font-medium text-green-800 mb-1">
                {{ formatSender(message.sender) }}
              </p>
              <p class="text-gray-800">{{ message.text }}</p>
              <p class="text-xs text-gray-500 mt-2" data-testid="message-timestamp">
                {{ formatTimestamp(message.timestamp) }}
              </p>
            </div>
          </div>
        </div>

        <!-- System/other message styling -->
        <div
          v-else
          class="bg-gray-50 border-l-4 border-gray-400 p-3 rounded-r-lg"
        >
          <div class="flex items-start">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800 mb-1">
                {{ formatSender(message.sender) }}
              </p>
              <p class="text-gray-800">{{ message.text }}</p>
              <p class="text-xs text-gray-500 mt-2" data-testid="message-timestamp">
                {{ formatTimestamp(message.timestamp) }}
              </p>
            </div>
          </div>
        </div>
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
 * Connected to the game store to display actual message history.
 */

import { useGameStore } from '~/stores/game'

// Initialize the game store
const gameStore = useGameStore()

/**
 * Format sender name for display
 */
const formatSender = (sender: string): string => {
  switch (sender) {
    case 'user':
      return 'You:'
    case 'ai':
      return 'Franz Ferdinand:'
    case 'system':
      return 'System:'
    default:
      return sender
  }
}

/**
 * Format timestamp for display
 */
const formatTimestamp = (timestamp: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(timestamp)
}
</script>

<style scoped>
/* Container styling with fixed dimensions for consistent layout */
.message-history-container {
  min-height: 200px;
  max-height: 400px;
}
</style>
