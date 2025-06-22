<template>
  <!-- Messages counter display with badge styling -->
  <div data-testid="messages-counter" class="inline-flex items-center prominent">
    <UBadge
      color="primary"
      variant="solid"
      size="lg"
      class="font-semibold text-sm"
    >
      Messages Remaining: {{ gameStore.remainingMessages }}
    </UBadge>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/stores/game'

/**
 * MessagesCounter component - displays remaining messages count
 * 
 * Shows the number of messages remaining in the current game session.
 * Uses a prominent badge styling to make the information easily visible.
 * Gets the count from the Pinia game store for reactive updates.
 */

const gameStore = useGameStore()
</script>
