<template>
  <!-- Send button with accessibility attributes -->
  <UButton
    type="button"
    aria-label="Send message"
    role="button"
    :disabled="isDisabled"
  >
    Send
  </UButton>
</template>

<script setup lang="ts">
/**
 * SendButton component - renders the message send button
 * 
 * Connected to game store to handle disabled states based on:
 * - Remaining messages count
 * - Input validation state
 * 
 * Includes proper accessibility attributes for keyboard navigation.
 */

import { useGameStore } from '~/stores/game'

// Props interface for input validation state
interface Props {
  inputValid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  inputValid: true
})

// Connect to game store
const gameStore = useGameStore()

// Computed property to determine if button should be disabled
const isDisabled = computed((): boolean => {
  // Disabled if no messages remaining
  if (!gameStore.canSendMessage) {
    return true
  }
  
  // Disabled if input is invalid
  if (!props.inputValid) {
    return true
  }
  
  return false
})
</script>
