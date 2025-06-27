<template>
    <div data-testid="progress-tracker"
        class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700">
        <!-- Objective Display -->
        <div v-if="gameStore.currentObjective" class="space-y-2">
            <h3 data-testid="objective-title" class="text-xl font-bold text-blue-600 dark:text-blue-400">
                {{ gameStore.currentObjective.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ gameStore.currentObjective.successCriteria }}
            </p>
        </div>

        <!-- No Objective State -->
        <div v-else class="text-center py-4">
            <p class="text-gray-500 dark:text-gray-400 italic">No objective set - starting new game...</p>
        </div>

        <!-- Progress Display -->
        <div class="space-y-3">
            <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-700 dark:text-gray-300">Mission Progress</span>
                <span data-testid="progress-percentage" class="font-bold text-lg text-blue-600 dark:text-blue-400">
                    {{ gameStore.objectiveProgress }}%
                </span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full">
                <UProgress data-testid="progress-bar" :value="gameStore.objectiveProgress" :color="progressColor"
                    size="lg" class="w-full" />
            </div>

            <!-- Progress Status -->
            <div data-testid="progress-status" class="text-center py-2 px-4 rounded-md text-sm font-medium"
                :class="statusClass">
                <span class="font-medium">{{ statusText }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()

// Computed property for progress bar color based on progress level
const progressColor = computed(() => {
    const progress = gameStore.objectiveProgress
    if (progress < 25) return 'error'
    if (progress < 50) return 'warning'
    if (progress < 75) return 'info'
    return 'success'
})

// Computed property for status styling class
const statusClass = computed(() => {
    const progress = gameStore.objectiveProgress
    if (progress < 25) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    if (progress < 50) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    if (progress < 75) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
})

// Computed property for status text
const statusText = computed(() => {
    const progress = gameStore.objectiveProgress
    if (progress === 0) return 'Mission just beginning...'
    if (progress < 25) return 'Early stages - significant work needed'
    if (progress < 50) return 'Making progress - keep pushing forward'
    if (progress < 75) return 'Good momentum - approaching success'
    if (progress < 100) return 'Almost there - final push needed!'
    return 'Mission accomplished!'
})
</script>
