import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '~/stores/game'

describe('Game Store', () => {
    beforeEach(() => {
        // Create a fresh Pinia instance for each test
        setActivePinia(createPinia())
    })

    describe('Initial State', () => {
        it('should track remaining messages (starts at 5)', () => {
            const gameStore = useGameStore()
            expect(gameStore.remainingMessages).toBe(5)
        })

        it('should track message history array (starts empty)', () => {
            const gameStore = useGameStore()
            expect(gameStore.messageHistory).toEqual([])
            expect(Array.isArray(gameStore.messageHistory)).toBe(true)
        })

        it('should track game status (playing/gameOver)', () => {
            const gameStore = useGameStore()
            expect(gameStore.gameStatus).toBe('playing')
        })
    })
})
