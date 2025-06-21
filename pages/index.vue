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
              <MessageInput />
              <div class="flex justify-end">
                <SendButton data-testid="send-button" />
              </div>
            </div>
          </UCard>

          <!-- Message History Section -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-medium">Message History</h3>
            </template>
            <MessageHistory data-testid="message-history" :messages="messages" />
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
              <MessagesCounter :remaining-messages="remainingMessages" />
              <!-- Dynamic mission status badge -->
              <UBadge
                v-if="remainingMessages > 0"
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
 * Main game page - Revisionist game interface
 * 
 * This is the primary game interface that brings together all game components
 * in a responsive layout. Features include:
 * - Game title and objective display
 * - Message input with character limiting
 * - Message history (empty state for Phase 1)
 * - Messages counter and status indicators
 * 
 * Currently uses hardcoded values as per Phase 1 requirements.
 * Dynamic state management will be added in Phase 2.
 */

// Define the message structure for type safety
interface Message {
  id: string
  text: string
  timestamp: Date
  character?: string
}

// Game state - hardcoded values for Phase 1 foundation
const messages = ref<Message[]>([])
const remainingMessages = ref<number>(5)

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
