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
                <SendButton 
                  data-testid="send-button" 
                  :input-valid="messageInputValid"
                  @click="handleSendMessage"
                />
              </div>
            </div>
          </UCard>

          <!-- Message History Section -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-medium">Message History</h3>
            </template>
            <MessageHistory data-testid="message-history" />
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
              <UBadge
                v-if="gameStore.remainingMessages > 0"
                color="success"
                variant="soft"
                size="lg"
              >
                Active Mission
              </UBadge>
              <UBadge
                v-else
                color="error"
                variant="soft"
                size="lg"
              >
                Mission Complete
              </UBadge>
            </div>
          </UCard>
        </div>
      </div>
    </main>
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

// Component references
const messageInputRef = ref()

// Computed property for message input validation
const messageInputValid = computed(() => {
  return messageInputRef.value?.isValid ?? false
})

// Message sending handler
const handleSendMessage = () => {
  if (!messageInputRef.value) return
  
  const messageText = messageInputRef.value.message?.trim()
  
  // Validate message before sending
  if (!messageText || !messageInputRef.value.isValid) {
    return
  }
  
  // Send message through game store
  gameStore.addUserMessage(messageText)
  gameStore.decrementMessages()
  
  // Clear the input
  messageInputRef.value.message = ''
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
