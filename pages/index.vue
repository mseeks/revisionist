<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Game Title -->
      <h1 class="text-4xl font-bold text-center mb-8 text-slate-800 dark:text-slate-100">
        Revisionist
      </h1>

      <!-- Objective Display -->
      <UCard data-testid="objective-display" class="mb-8">
        <template #header>
          <div class="text-center">
            <h2 class="text-xl font-semibold text-red-600 dark:text-red-400">
              Mission Objective
            </h2>
          </div>
        </template>
        <div class="text-center text-lg font-medium text-slate-700 dark:text-slate-300">
          Prevent World War I
        </div>
      </UCard>

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
              <UTextarea
                data-testid="message-input"
                v-model="messageText"
                placeholder="Type your message here..."
                :maxlength="160"
                :rows="4"
                class="resize-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
              <div class="flex justify-between items-center">
                <div class="text-sm text-slate-500 dark:text-slate-400">
                  {{ remainingCharacters }} characters remaining
                </div>
                <UButton
                  data-testid="send-button"
                  color="primary"
                  size="lg"
                  :disabled="!messageText.trim() || messageText.length > 160"
                >
                  Send
                </UButton>
              </div>
            </div>
          </UCard>

          <!-- Message History -->
          <UCard data-testid="message-history">
            <template #header>
              <h3 class="text-lg font-medium">Message History</h3>
            </template>
            <div class="space-y-2 min-h-[200px] max-h-[400px] overflow-y-auto">
              <div v-if="messages.length === 0" class="text-center text-slate-500 dark:text-slate-400 py-8">
                No messages sent yet. Start by typing your first message above.
              </div>
              <div
                v-for="(message, index) in messages"
                :key="index"
                class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border"
              >
                <div class="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Message {{ index + 1 }}
                </div>
                <div class="text-slate-800 dark:text-slate-200">
                  {{ message }}
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Right Column: Messages Counter and Game Status -->
        <div class="space-y-4">
          <!-- Messages Counter -->
          <UCard data-testid="messages-counter">
            <template #header>
              <h3 class="text-lg font-medium text-center">Status</h3>
            </template>
            <div class="text-center space-y-4">
              <div>
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {{ remainingMessages }}
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400">
                  Messages Remaining
                </div>
              </div>
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
    </div>
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
