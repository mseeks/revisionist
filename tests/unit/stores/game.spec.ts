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

    describe('Message History Logic', () => {
        it('should add user message to history', () => {
            const gameStore = useGameStore()
            const messageText = 'Hello, Napoleon!'

            gameStore.addUserMessage(messageText)

            expect(gameStore.messageHistory).toHaveLength(1)
            expect(gameStore.messageHistory[0]).toMatchObject({
                text: messageText,
                sender: 'user',
            })
            expect(gameStore.messageHistory[0].timestamp).toBeInstanceOf(Date)
        })

        it('should maintain chronological order', () => {
            const gameStore = useGameStore()
            const firstMessage = 'First message'
            const secondMessage = 'Second message'

            // Add first message
            gameStore.addUserMessage(firstMessage)
            const firstTimestamp = gameStore.messageHistory[0].timestamp

            // Add second message
            gameStore.addUserMessage(secondMessage)

            expect(gameStore.messageHistory).toHaveLength(2)
            expect(gameStore.messageHistory[0].text).toBe(firstMessage)
            expect(gameStore.messageHistory[1].text).toBe(secondMessage)

            // Second message should have later or equal timestamp
            expect(gameStore.messageHistory[1].timestamp.getTime())
                .toBeGreaterThanOrEqual(firstTimestamp.getTime())
        })
    })

    describe('Game Over Handling', () => {
        it('should detect when 5 messages are used', () => {
            const gameStore = useGameStore()

            // Send 5 messages to use them all up
            for (let i = 0; i < 5; i++) {
                gameStore.addUserMessage(`Message ${i + 1}`)
                gameStore.decrementMessages()
            }

            expect(gameStore.remainingMessages).toBe(0)
            expect(gameStore.gameStatus).toBe('gameOver')
        })

        it('should prevent further message sending', () => {
            const gameStore = useGameStore()

            // Use all 5 messages
            for (let i = 0; i < 5; i++) {
                gameStore.addUserMessage(`Message ${i + 1}`)
                gameStore.decrementMessages()
            }

            // Should be in game over state
            expect(gameStore.gameStatus).toBe('gameOver')
            expect(gameStore.canSendMessage).toBe(false)

            // Try to send another message - should be prevented
            const initialMessageCount = gameStore.messageHistory.length
            gameStore.addUserMessage('This should not be added')

            expect(gameStore.messageHistory.length).toBe(initialMessageCount)
        })
    })

    describe('Reset Functionality', () => {
        it('should reset messages remaining to 5', () => {
            const gameStore = useGameStore()

            // Use some messages first
            gameStore.decrementMessages()
            gameStore.decrementMessages()
            expect(gameStore.remainingMessages).toBe(3)

            // Reset the game
            gameStore.resetGame()

            expect(gameStore.remainingMessages).toBe(5)
        })

        it('should clear message history', () => {
            const gameStore = useGameStore()

            // Add some messages first
            gameStore.addUserMessage('Message 1')
            gameStore.addUserMessage('Message 2')
            expect(gameStore.messageHistory).toHaveLength(2)

            // Reset the game
            gameStore.resetGame()

            expect(gameStore.messageHistory).toEqual([])
            expect(gameStore.messageHistory).toHaveLength(0)
        })

        it('should reset game status to playing', () => {
            const gameStore = useGameStore()

            // Trigger game over
            for (let i = 0; i < 5; i++) {
                gameStore.addUserMessage(`Message ${i + 1}`)
                gameStore.decrementMessages()
            }
            expect(gameStore.gameStatus).toBe('gameOver')

            // Reset the game
            gameStore.resetGame()

            expect(gameStore.gameStatus).toBe('playing')
        })

        it('should allow sending messages after reset', () => {
            const gameStore = useGameStore()

            // Trigger game over
            for (let i = 0; i < 5; i++) {
                gameStore.addUserMessage(`Message ${i + 1}`)
                gameStore.decrementMessages()
            }
            expect(gameStore.canSendMessage).toBe(false)

            // Reset the game
            gameStore.resetGame()

            expect(gameStore.canSendMessage).toBe(true)
        })
    })
})
