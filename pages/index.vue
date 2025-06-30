<template>
  <!-- Main game layout with gradient background -->
  <div class="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Game Title -->
      <GameTitle />

      <!-- Objective Display -->
      <div class="mb-8">
        <ObjectiveDisplay data-testid="objective-display" />
      </div>

      <!-- Game Interface Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Message Input and Send Button -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Message Input Section -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-medium">Send Message</h3>
            </template>
            <div class="space-y-4">
              <MessageInput ref="messageInputRef" />
              <div class="flex justify-end">
                <SendButton data-testid="send-button" :input-valid="messageInputValid" @click="handleSendMessage" />
              </div>
            </div>
          </UCard>

          <!-- Message History Section -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-medium">Message History</h3>
            </template>
            <div class="space-y-4">
              <MessageHistory data-testid="message-history" />

              <!-- Error display -->
              <UAlert v-if="gameStore.error" data-testid="error-alert" color="error" variant="soft"
                :title="gameStore.error"
                :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link', padded: false, 'data-testid': 'error-close' }"
                @close="gameStore.setError(null)" />
            </div>
          </UCard>
        </div>

        <!-- Right Column: Messages Counter and Game Status -->
        <div class="space-y-4">
          <!-- Game Status Panel -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-medium text-center">Status</h3>
            </template>
            <div class="text-center space-y-4">
              <MessagesCounter data-testid="messages-counter" />
              <!-- Dynamic mission status badge -->
              <UBadge v-if="gameStore.gameStatus === 'playing'" color="success" variant="soft" size="lg">
                Active Mission
              </UBadge>
              <UBadge v-else-if="gameStore.gameStatus === 'victory'" color="success" variant="solid" size="lg">
                🎉 VICTORY! 🎉
              </UBadge>
              <UBadge v-else-if="gameStore.gameStatus === 'defeat'" color="error" variant="solid" size="lg">
                💥 DEFEAT 💥
              </UBadge>
              <UBadge v-else color="neutral" variant="soft" size="lg">
                Mission Complete
              </UBadge>

              <!-- Victory Efficiency Display -->
              <div v-if="gameStore.gameStatus === 'victory' && gameStore.getVictoryEfficiency()"
                class="space-y-2 p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
                <p class="text-sm font-semibold text-green-800 dark:text-green-200">
                  Efficiency: {{ gameStore.getVictoryEfficiency()?.efficiencyRating }}
                </p>
                <p class="text-xs text-green-700 dark:text-green-300">
                  {{ gameStore.getVictoryEfficiency()?.messagesSaved }} messages saved!
                </p>
                <p class="text-xs text-green-600 dark:text-green-400">
                  {{ gameStore.getVictoryEfficiency()?.efficiencyPercentage }}% efficiency
                </p>
              </div>

              <!-- Defeat Information -->
              <div v-if="gameStore.gameStatus === 'defeat'"
                class="space-y-2 p-4 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700">
                <p class="text-sm font-semibold text-red-800 dark:text-red-200">
                  Mission Failed
                </p>
                <p class="text-xs text-red-700 dark:text-red-300">
                  Progress: {{ gameStore.objectiveProgress }}%
                </p>
                <p class="text-xs text-red-600 dark:text-red-400">
                  Try a different strategy next time!
                </p>
              </div>

              <!-- Reset button for testing -->
              <UButton color="neutral" variant="soft" size="md" data-testid="reset-button" icon="i-heroicons-arrow-path"
                @click="handleResetGame">
                Reset Game
              </UButton>
            </div>
          </UCard>

          <!-- Progress Tracker Panel -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-medium text-center">Mission Progress</h3>
            </template>
            <ProgressTracker />
          </UCard>
        </div>
      </div>
    </main>

    <!-- End Game Screen Modal -->
    <EndGameScreen />
  </div>
</template>

<script setup lang="ts">
/**
 * Main game page - Revisionist
 * 
 * Central orchestration of the game interface including message input,
 * message history, counter display, and objective status.
 * 
 * Connected to game store for state management and implements complete
 * message sending flow between components.
 */

import { useGameStore } from '~/stores/game'

// Connect to game store
const gameStore = useGameStore()

// Initialize objective if not already set
onMounted(async () => {
  if (!gameStore.currentObjective) {
    await gameStore.generateObjective()
  }
})

// Component references
const messageInputRef = ref()

// Computed property for message input validation
const messageInputValid = computed(() => {
  return messageInputRef.value?.isValid ?? false
})

// Message sending handler - now async with AI integration
const handleSendMessage = async () => {
  if (!messageInputRef.value) return
  
  const messageText = messageInputRef.value.message?.trim()
  
  // Validate message before sending
  if (!messageText || !messageInputRef.value.isValid) {
    return
  }
  
  // Send message through game store (includes API call)
  await gameStore.sendMessage(messageText)
  
  // Clear the input
  messageInputRef.value.message = ''
}

// Reset game handler
const handleResetGame = () => {
  gameStore.resetGame()
  // Also clear the input if it exists
  if (messageInputRef.value) {
    messageInputRef.value.message = ''
  }
}

// Meta tags for SEO and social sharing
useHead({
  title: 'Revisionist - Prevent World War I',
  meta: [
    {
      name: 'description',
      content: 'A time travel game where you must prevent World War I by sending messages to the past.'
    }
  ]
})
</script>
