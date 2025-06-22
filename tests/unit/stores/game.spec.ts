import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '~/stores/game'

// Mock $fetch globally
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

describe('Game Store', () => {
    beforeEach(() => {
        // Create a fresh Pinia instance for each test
        setActivePinia(createPinia())
        // Clear all mocks before each test
        vi.clearAllMocks()
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

    describe('Async Message Handling', () => {
        it('should set loading state during API call', async () => {
            const gameStore = useGameStore()

            // Mock a delayed API response
            mockFetch.mockImplementation(() =>
                new Promise(resolve =>
                    setTimeout(() => resolve({
                        success: true,
                        data: { aiResponse: 'Test AI response' }
                    }), 100)
                )
            )

            // Start the async operation
            const sendPromise = gameStore.sendMessage('Test message')

            // Check that loading state is set immediately
            expect(gameStore.isLoading).toBe(true)

            // Wait for completion
            await sendPromise

            // Check that loading state is cleared
            expect(gameStore.isLoading).toBe(false)
        })

        it('should add AI response to history', async () => {
            const gameStore = useGameStore()
            const userMessage = 'Test user message'
            const aiResponse = 'Test AI response'

            // Mock successful API response
            mockFetch.mockResolvedValue({
                success: true,
                data: { aiResponse }
            })

            await gameStore.sendMessage(userMessage)

            // Should have both user and AI messages
            expect(gameStore.messageHistory).toHaveLength(2)
            expect(gameStore.messageHistory[0]).toMatchObject({
                text: userMessage,
                sender: 'user'
            })
            expect(gameStore.messageHistory[1]).toMatchObject({
                text: aiResponse,
                sender: 'ai'
            })
        })

        it('should handle API failures', async () => {
            const gameStore = useGameStore()
            const userMessage = 'Test message'

            // Mock API failure
            mockFetch.mockRejectedValue(new Error('Network error'))

            await gameStore.sendMessage(userMessage)

            // Should have error set
            expect(gameStore.error).toBe('Failed to send message. Please try again.')

            // Should not be loading
            expect(gameStore.isLoading).toBe(false)

            // Should only have user message, no AI response
            expect(gameStore.messageHistory).toHaveLength(1)
            expect(gameStore.messageHistory[0].sender).toBe('user')
        })

        it('should handle API error responses', async () => {
            const gameStore = useGameStore()
            const userMessage = 'Test message'
            const errorMessage = 'API error message'

            // Mock API error response
            mockFetch.mockResolvedValue({
                success: false,
                data: { error: errorMessage }
            })

            await gameStore.sendMessage(userMessage)

            // Should have error set
            expect(gameStore.error).toBe(errorMessage)

            // Should not be loading
            expect(gameStore.isLoading).toBe(false)

            // Should only have user message, no AI response
            expect(gameStore.messageHistory).toHaveLength(1)
            expect(gameStore.messageHistory[0].sender).toBe('user')
        })

        it('should restore message count on network errors', async () => {
            const gameStore = useGameStore()
            const initialCount = gameStore.remainingMessages

            // Mock network error
            mockFetch.mockRejectedValue(new Error('Network error'))

            await gameStore.sendMessage('Test message')

            // Message count should be restored on network error
            expect(gameStore.remainingMessages).toBe(initialCount)
        })

        it('should not restore message count on API errors', async () => {
            const gameStore = useGameStore()
            const initialCount = gameStore.remainingMessages

            // Mock API error response
            mockFetch.mockResolvedValue({
                success: false,
                data: { error: 'API error' }
            })

            await gameStore.sendMessage('Test message')

            // Message count should not be restored on API errors
            expect(gameStore.remainingMessages).toBe(initialCount - 1)
        })

        it('should clear error on successful message', async () => {
            const gameStore = useGameStore()

            // Set an initial error
            gameStore.setError('Previous error')
            expect(gameStore.error).toBe('Previous error')

            // Mock successful API response
            mockFetch.mockResolvedValue({
                success: true,
                data: { aiResponse: 'Test response' }
            })

            await gameStore.sendMessage('Test message')

            // Error should be cleared
            expect(gameStore.error).toBe(null)
        })
    })
})
