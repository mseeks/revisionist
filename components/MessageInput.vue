<template>
  <div data-testid="message-input" class="space-y-2">
    <UTextarea
      v-model="message"
      :maxlength="160"
      placeholder="Type your message here..."
      :rows="3"
      class="w-full"
      aria-label="Message to send"
      aria-describedby="character-counter"
    />
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
const message = ref('')

const remainingCharacters = computed(() => {
  return 160 - message.value.length
})

// Watch for changes and enforce 160 character limit
watch(message, (newValue) => {
  if (newValue.length > 160) {
    message.value = newValue.slice(0, 160)
  }
})
</script>
