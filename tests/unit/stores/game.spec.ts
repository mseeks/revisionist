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

    describe('Message Counter Logic', () => {
        it('should decrement remaining messages when user sends', () => {
            const gameStore = useGameStore()
            const initialCount = gameStore.remainingMessages

            gameStore.decrementMessages()

            expect(gameStore.remainingMessages).toBe(initialCount - 1)
        })

        it('should not allow sending when 0 messages remain', () => {
            const gameStore = useGameStore()
            // Set messages to 0
            gameStore.remainingMessages = 0

            gameStore.decrementMessages()

            // Should not go below 0
            expect(gameStore.remainingMessages).toBe(0)
        })

        it('should return boolean for canSendMessage computed', () => {
            const gameStore = useGameStore()

            // Should be able to send when messages > 0
            expect(gameStore.canSendMessage).toBe(true)

            // Set to 0 messages
            gameStore.remainingMessages = 0

            // Should not be able to send when messages = 0
            expect(gameStore.canSendMessage).toBe(false)
        })
    })
})
