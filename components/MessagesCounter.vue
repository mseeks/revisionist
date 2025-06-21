<template>
  <!-- Messages counter display with badge styling -->
  <div data-testid="messages-counter" class="inline-flex items-center prominent">
    <UBadge
      color="primary"
      variant="solid"
      size="lg"
      class="font-semibold text-sm"
    >
      Messages Remaining: {{ remainingMessages }}
    </UBadge>
  </div>
</template>

<script setup lang="ts">
/**
 * MessagesCounter component - displays remaining messages count
 * 
 * Shows the number of messages remaining in the current game session.
 * Uses a prominent badge styling to make the information easily visible.
 * 
 * Props:
 * - remainingMessages: Number of messages left (defaults to 5)
 */

interface Props {
  remainingMessages?: number
}

const props = withDefaults(defineProps<Props>(), {
  remainingMessages: 5
})
</script>
