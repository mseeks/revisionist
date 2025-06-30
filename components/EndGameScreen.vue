<template>
    <div v-if="gameStore.gameStatus === 'victory' || gameStore.gameStatus === 'defeat'" data-testid="end-game-screen"
        role="dialog" :aria-labelledby="headingId"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <!-- Debug info at top -->
        <div class="fixed top-4 left-4 bg-red-500 text-white p-2 rounded text-xs z-50">
            DEBUG: Status={{ gameStore.gameStatus }}, Messages={{ gameStore.remainingMessages }}, Progress={{
                gameStore.objectiveProgress }}%
        </div>
        <div class="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <!-- Victory Screen -->
            <div v-if="gameStore.gameStatus === 'victory'" class="text-center">
                <h2 :id="headingId" data-testid="victory-message"
                    class="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
                    🎉 Victory! 🎉
                </h2>

                <div data-testid="objective-title" class="text-xl mb-4">
                    <strong>{{ gameStore.currentObjective?.title || 'Historical Mission' }}</strong>
                </div>

                <div data-testid="final-progress" class="text-3xl font-bold text-green-600 mb-6">
                    {{ gameStore.objectiveProgress }}% Complete
                </div>

                <div v-if="victoryEfficiency" data-testid="efficiency-display" class="mb-6">
                    <div class="text-lg font-semibold text-green-700 dark:text-green-300">
                        {{ victoryEfficiency.efficiencyRating }} Victory!
                    </div>
                    <div class="text-gray-600 dark:text-gray-400">
                        {{ victoryEfficiency.messagesSaved }} messages saved • {{ victoryEfficiency.messagesUsed }}
                        messages used
                    </div>
                    <div v-if="victoryEfficiency.isEarlyVictory"
                        class="text-sm text-green-600 dark:text-green-400 mt-2">
                        🌟 Early Victory Bonus! You achieved your objective efficiently.
                    </div>
                </div>
            </div>

            <!-- Defeat Screen -->
            <div v-else-if="gameStore.gameStatus === 'defeat'" class="text-center">
                <h2 :id="headingId" data-testid="defeat-message"
                    class="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
                    💔 Defeat 💔
                </h2>

                <div data-testid="objective-title" class="text-xl mb-4">
                    <strong>{{ gameStore.currentObjective?.title || 'Historical Mission' }}</strong>
                </div>

                <div data-testid="final-progress" class="text-3xl font-bold text-red-600 mb-4">
                    {{ gameStore.objectiveProgress }}% Complete
                </div>

                <div data-testid="defeat-explanation" class="text-gray-600 dark:text-gray-400 mb-6">
                    Your objective was not achieved within the 5 message limit.
                    History proceeded unchanged, and the events you sought to prevent came to pass.
                </div>
            </div>

            <!-- Game Summary -->
            <div data-testid="game-summary" class="mt-6 border-t pt-6">
                <h3 class="text-xl font-semibold mb-4">Game Summary</h3>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <!-- Message Efficiency -->
                    <div data-testid="message-efficiency" class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded">
                        <div class="text-2xl font-bold">{{ messagesUsed }}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">{{ messagesUsed === 1 ? 'Message' :
                            'Messages' }} Used</div>
                    </div>

                    <!-- Best Roll -->
                    <div v-if="gameSummary.bestRoll" data-testid="best-roll"
                        class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded">
                        <div class="text-2xl font-bold text-green-600">{{ gameSummary.bestRoll.diceRoll }}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Best Roll</div>
                        <div class="text-xs text-green-600">{{ gameSummary.bestRoll.diceOutcome }}</div>
                    </div>

                    <!-- Worst Roll -->
                    <div v-if="gameSummary.worstRoll" data-testid="worst-roll"
                        class="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded">
                        <div class="text-2xl font-bold text-red-600">{{ gameSummary.worstRoll.diceRoll }}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Worst Roll</div>
                        <div class="text-xs text-red-600">{{ gameSummary.worstRoll.diceOutcome }}</div>
                    </div>
                </div>

                <!-- Key Moments -->
                <div v-if="gameSummary.criticalTurningPoints.length > 0" class="mb-6">
                    <h4 class="font-semibold mb-3">Critical Turning Points</h4>
                    <div class="space-y-2">
                        <div v-for="(moment, index) in gameSummary.criticalTurningPoints" :key="index"
                            class="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                            <div class="flex justify-between items-start">
                                <span>{{ moment.text.substring(0, 60) }}{{ moment.text.length > 60 ? '...' : ''
                                    }}</span>
                                <span :class="[
                    'px-2 py-1 rounded text-xs',
                    moment.diceRoll >= 19 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    moment.diceRoll <= 2 ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  ]">
                                    {{ moment.diceRoll }} ({{ moment.diceOutcome }})
                                </span>
                            </div>
                            <div v-if="moment.progressChange" class="text-xs text-gray-500 mt-1">
                                Progress: {{ moment.progressChange > 0 ? '+' : '' }}{{ moment.progressChange }}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Play Again Button -->
            <div class="text-center mt-6">
                <UButton data-testid="play-again-button" @click="playAgain" size="lg" color="primary" variant="solid">
                    Play Again
                </UButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '~/stores/game'
import type { Message } from '~/stores/game'

const gameStore = useGameStore()

// Generate unique ID for accessibility
const headingId = `end-game-heading-${Math.random().toString(36).substr(2, 9)}`

// Compute victory efficiency data
const victoryEfficiency = computed(() => {
    return gameStore.getVictoryEfficiency()
})

// Compute messages used
const messagesUsed = computed(() => {
  return 5 - gameStore.remainingMessages
})

// Generate game summary with key statistics
const gameSummary = computed(() => {
  return gameStore.gameSummary
})

// Handle play again action
const playAgain = async () => {
  gameStore.resetGame()
  // Generate new objective for the next game
  await gameStore.generateObjective()
}
</script>
