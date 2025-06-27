<template>
  <!-- Message history container with accessibility support -->
  <div data-testid="message-history"
    class="message-history-container overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-sm"
    aria-label="Message history" aria-live="polite" role="log">
    <!-- Empty state display when no messages exist and not loading -->
    <div v-if="gameStore.messageHistory.length === 0 && !gameStore.isLoading" data-testid="empty-state"
      class="flex flex-col items-center justify-center p-8 text-gray-500">
      <div class="text-center">
        <div class="text-4xl mb-3">💬</div>
        <p class="text-lg font-medium text-gray-600 mb-1">No messages yet</p>
        <p class="text-sm text-gray-500">Messages will appear here as the story unfolds</p>
      </div>
    </div>

    <!-- Message list display (shows when there are messages OR when loading) -->
    <div v-else class="p-4 space-y-3">
      <div v-for="(message, index) in gameStore.messageHistory" :key="index" data-testid="message-item"
        :data-sender="message.sender" class="message-item">
        <!-- User message styling -->
        <div v-if="message.sender === 'user'" data-testid="user-message"
          class="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
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
        <div v-else-if="message.sender === 'ai'" data-testid="ai-message" :class="[
          'p-3 rounded-r-lg border-l-4',
          getOutcomeClass(message.diceOutcome)
        ]">
          <div class="flex items-start">
            <div class="flex-1">
              <!-- AI name and dice roll display -->
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-medium text-green-800">
                  {{ formatSender(message.sender) }}
                </p>
                <!-- Dice display for AI messages with dice data -->
                <div v-if="message.diceRoll !== undefined" class="flex items-center space-x-2">
                  <div data-testid="dice-icon" class="text-lg">
                    🎲
                  </div>
                  <div class="text-xs bg-white rounded px-2 py-1 border">
                    <span data-testid="dice-result" class="font-bold text-gray-800">
                      {{ message.diceRoll }}
                    </span>
                    /
                    <span data-testid="dice-roll" class="text-gray-600">
                      20
                    </span>
                  </div>
                  <span data-testid="dice-outcome" :class="getOutcomeTextClass(message.diceOutcome)"
                    class="text-xs font-semibold px-2 py-1 rounded">
                    {{ message.diceOutcome }}
                  </span>
                </div>
              </div>

              <!-- Character message -->
              <p data-testid="character-message" class="text-gray-800 mb-2">
                {{ message.text }}
              </p>

              <!-- Character action (what they decide to do) -->
              <div v-if="message.characterAction" data-testid="character-action"
                class="character-action bg-white bg-opacity-70 p-2 rounded border-l-2 border-gray-300 mb-2">
                <p class="text-xs font-medium text-gray-600 mb-1">Action Taken:</p>
                <p class="text-sm text-gray-700 italic">{{ message.characterAction }}</p>
              </div>

              <!-- Timeline impact analysis -->
              <div v-if="message.timelineImpact" data-testid="timeline-impact"
                class="bg-white bg-opacity-70 p-2 rounded border-l-2 border-purple-300 mb-2">
                <p class="text-xs font-medium text-purple-600 mb-1">Timeline Impact:</p>
                <p class="text-sm text-gray-700">{{ message.timelineImpact }}</p>
                <!-- Progress change indicator -->
                <div v-if="message.progressChange !== undefined" data-testid="progress-change"
                  class="flex items-center mt-1">
                  <span class="text-xs font-medium text-gray-600 mr-1">Progress:</span>
                  <span :class="getProgressChangeClass(message.progressChange)"
                    class="text-xs font-bold px-2 py-1 rounded">
                    {{ message.progressChange > 0 ? '+' : '' }}{{ message.progressChange }}%
                  </span>
                </div>
              </div>

              <p class="text-xs text-gray-500 mt-2" data-testid="message-timestamp">
                {{ formatTimestamp(message.timestamp) }}
              </p>
            </div>
          </div>
        </div>

        <!-- System/other message styling -->
        <div v-else class="bg-gray-50 border-l-4 border-gray-400 p-3 rounded-r-lg">
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

      <!-- Loading indicator -->
      <div v-if="gameStore.isLoading" data-testid="loading-indicator"
        class="flex items-center justify-center p-3 bg-blue-50 border-l-4 border-blue-300 rounded-r-lg">
        <div class="flex items-center space-x-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span class="text-sm text-blue-600 font-medium">Franz Ferdinand is thinking...</span>
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

/**
 * Get CSS classes for outcome-based styling
 */
const getOutcomeClass = (outcome?: string): string[] => {
  const baseClasses = ['bg-green-50', 'border-green-400']

  switch (outcome) {
    case 'Critical Success':
      return ['bg-emerald-50', 'border-emerald-500', 'outcome-critical-success']
    case 'Success':
      return ['bg-green-50', 'border-green-400', 'outcome-success']
    case 'Neutral':
      return ['bg-blue-50', 'border-blue-400', 'outcome-neutral']
    case 'Failure':
      return ['bg-orange-50', 'border-orange-400', 'outcome-failure']
    case 'Critical Failure':
      return ['bg-red-50', 'border-red-500', 'outcome-critical-failure']
    default:
      return baseClasses
  }
}

/**
 * Get text classes for dice outcome display
 */
const getOutcomeTextClass = (outcome?: string): string => {
  switch (outcome) {
    case 'Critical Success':
      return 'bg-emerald-100 text-emerald-800'
    case 'Success':
      return 'bg-green-100 text-green-800'
    case 'Neutral':
      return 'bg-blue-100 text-blue-800'
    case 'Failure':
      return 'bg-orange-100 text-orange-800'
    case 'Critical Failure':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Get classes for progress change display
 */
const getProgressChangeClass = (change?: number): string => {
  if (change === undefined) return 'bg-gray-100 text-gray-800'

  if (change > 20) return 'bg-emerald-100 text-emerald-800'
  if (change > 0) return 'bg-green-100 text-green-800'
  if (change === 0) return 'bg-blue-100 text-blue-800'
  if (change > -20) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}
</script>

<style scoped>
/* Container styling with fixed dimensions for consistent layout */
.message-history-container {
  min-height: 200px;
  max-height: 400px;
}
</style>
