<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Game Title -->
      <GameTitle />

      <!-- Objective Display -->
      <div class="mb-8">
        <ObjectiveDisplay data-testid="objective-display" />
      </div>

      <!-- Game Interface Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Message Input and Send Button -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Message Input -->
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

          <!-- Message History -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-medium">Message History</h3>
            </template>
            <MessageHistory data-testid="message-history" :messages="messages" />
          </UCard>
        </div>

        <!-- Right Column: Messages Counter and Game Status -->
        <div class="space-y-4">
          <!-- Messages Counter -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-medium text-center">Status</h3>
            </template>
            <div class="text-center space-y-4">
              <MessagesCounter :remaining-messages="remainingMessages" />
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
// Game state
const messageText = ref('')
const messages = ref<string[]>([])
const remainingMessages = ref(5)

// Computed properties
const remainingCharacters = computed(() => 160 - messageText.value.length)

// Meta tags
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
