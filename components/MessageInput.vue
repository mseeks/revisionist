<template>
  <div data-testid="message-input" class="space-y-2">
    <!-- Message input textarea with character limit -->
    <UTextarea
      v-model="message"
      :maxlength="MAX_CHARACTERS"
      placeholder="Type your message here..."
      :rows="3"
      class="w-full"
      aria-label="Message to send"
      aria-describedby="character-counter"
    />
    <!-- Real-time character counter with accessibility support -->
    <div
      id="character-counter"
      data-testid="character-counter"
      class="text-sm text-gray-500 text-right"
      aria-live="polite"
    >
      {{ remainingCharacters }} characters remaining
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * MessageInput component - handles user message input with character limiting
 * 
 * Provides a textarea for user input with real-time character counting and
 * automatic enforcement of the 160-character limit for game messages.
 * Includes accessibility features for screen readers and validation.
 */

// Character limit constant for the game's message system
const MAX_CHARACTERS = 160

// Reactive message state
const message = ref<string>('')

// Computed property for remaining characters with proper typing
const remainingCharacters = computed((): number => {
  return MAX_CHARACTERS - message.value.length
})

// Validation computed properties
const validationErrors = computed((): string[] => {
  const errors: string[] = []
  
  // Trim whitespace for validation
  const trimmedMessage = message.value.trim()
  
  // Check if message is empty
  if (trimmedMessage.length === 0) {
    errors.push('Message cannot be empty')
  }
  
  // Note: Character limit is enforced by truncation, not validation
  
  return errors
})

const isValid = computed((): boolean => {
  return validationErrors.value.length === 0
})

// Watch for changes and enforce character limit
watch(message, (newValue: string) => {
  if (newValue.length > MAX_CHARACTERS) {
    message.value = newValue.slice(0, MAX_CHARACTERS)
  }
})

// Expose validation state and message for parent components
defineExpose({
  message,
  isValid,
  validationErrors
})
</script>
