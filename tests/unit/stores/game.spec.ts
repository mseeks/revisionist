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

    describe('Rate Limiting Protection', () => {
        beforeEach(() => {
            // Mock successful API response for all rate limiting tests
            mockFetch.mockResolvedValue({
                success: true,
                data: { aiResponse: 'Test response' }
            })
        })

        it('should prevent sending messages too quickly (1 second limit)', async () => {
            const gameStore = useGameStore()
            const initialCount = gameStore.remainingMessages

            // Send first message
            await gameStore.sendMessage('First message')
            expect(gameStore.remainingMessages).toBe(initialCount - 1)

            // Try to send second message immediately
            await gameStore.sendMessage('Second message')

            // Second message should be rate limited
            expect(gameStore.remainingMessages).toBe(initialCount - 1) // Only one message sent
            expect(gameStore.error).toBe('Please wait before sending another message')
            expect(gameStore.isRateLimited).toBe(true)
        })

        it('should set canSendMessage to false when rate limited', () => {
            const gameStore = useGameStore()
            
            // Initially should be able to send
            expect(gameStore.canSendMessage).toBe(true)
            
            // Simulate rate limiting
            gameStore.isRateLimited = true
            
            // Should not be able to send when rate limited
            expect(gameStore.canSendMessage).toBe(false)
        })

        it('should allow sending after 1 second delay', async () => {
            const gameStore = useGameStore()
            
            // Mock Date.now to control time
            const originalDateNow = Date.now
            let mockTime = 1000000000000 // Mock timestamp
            vi.spyOn(Date, 'now').mockImplementation(() => mockTime)
            
            // Send first message
            await gameStore.sendMessage('First message')
            
            // Advance time by 1 second
            mockTime += 1000
            
            // Should be able to send now
            expect(gameStore.checkRateLimit()).toBe(true)
            
            // Restore original Date.now
            Date.now = originalDateNow
        })

        it('should auto-clear rate limit state after timeout', async () => {
            const gameStore = useGameStore()
            
            // Set rate limit
            gameStore.setRateLimit()
            expect(gameStore.isRateLimited).toBe(true)
            
            // Wait for auto-clear
            await new Promise(resolve => setTimeout(resolve, 1100))
            expect(gameStore.isRateLimited).toBe(false)
        })

        it('should reset rate limiting state when game is reset', () => {
            const gameStore = useGameStore()
            
            // Set rate limiting state
            gameStore.isRateLimited = true
            gameStore.lastMessageTime = Date.now()
            
            // Reset game
            gameStore.resetGame()
            
            // Rate limiting state should be cleared
            expect(gameStore.isRateLimited).toBe(false)
            expect(gameStore.lastMessageTime).toBe(null)
        })
    })

    describe('Objective Management', () => {
        it('should start with no objective', () => {
            const gameStore = useGameStore()
            expect(gameStore.currentObjective).toBeNull()
            expect(gameStore.objectiveProgress).toBe(0)
        })

        it('should generate and store objective', async () => {
            const gameStore = useGameStore()

            await gameStore.generateObjective()

            expect(gameStore.currentObjective).not.toBeNull()
            expect(gameStore.currentObjective?.title).toBe('Prevent World War I')
            expect(gameStore.currentObjective?.successCriteria).toBeDefined()
            expect(gameStore.currentObjective?.historicalContext).toBeDefined()
            expect(gameStore.objectiveProgress).toBe(0)
        })

        it('should update objective progress', () => {
            const gameStore = useGameStore()
            // Set a mock objective first
            gameStore.currentObjective = {
                title: 'Test Objective',
                successCriteria: 'Test criteria',
                historicalContext: 'Test context',
                targetProgress: 100,
                difficulty: 'medium'
            }

            gameStore.updateObjectiveProgress(25)
            expect(gameStore.objectiveProgress).toBe(25)

            gameStore.updateObjectiveProgress(30)
            expect(gameStore.objectiveProgress).toBe(55)
        })

        it('should not allow progress below 0 or above 100', () => {
            const gameStore = useGameStore()
            gameStore.currentObjective = {
                title: 'Test Objective',
                successCriteria: 'Test criteria',
                historicalContext: 'Test context',
                targetProgress: 100,
                difficulty: 'medium'
            }

            // Test negative progress
            gameStore.updateObjectiveProgress(-50)
            expect(gameStore.objectiveProgress).toBe(0)

            // Test progress over 100
            gameStore.updateObjectiveProgress(150)
            expect(gameStore.objectiveProgress).toBe(100)
        })

        it('should trigger game over when progress reaches 100%', () => {
            const gameStore = useGameStore()
            gameStore.currentObjective = {
                title: 'Test Objective',
                successCriteria: 'Test criteria',
                historicalContext: 'Test context',
                targetProgress: 100,
                difficulty: 'medium'
            }

            gameStore.updateObjectiveProgress(100)

            expect(gameStore.objectiveProgress).toBe(100)
            expect(gameStore.gameStatus).toBe('gameOver')
        })

        it('should reset objective state when game resets', () => {
            const gameStore = useGameStore()

            // Set some objective state
            gameStore.currentObjective = {
                title: 'Test Objective',
                successCriteria: 'Test criteria',
                historicalContext: 'Test context',
                targetProgress: 100,
                difficulty: 'medium'
            }
            gameStore.objectiveProgress = 50

            gameStore.resetGame()

            expect(gameStore.currentObjective).toBeNull()
            expect(gameStore.objectiveProgress).toBe(0)
        })

        it('should handle objective generation errors gracefully', async () => {
            const gameStore = useGameStore()

            // This test verifies error handling when objective generation fails
            // In practice, generateObjective uses the POC version which shouldn't fail
            // But this tests the error handling structure for future AI implementation
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            // For now, test that the function works correctly
            // Future: Mock the import to test actual error handling
            await gameStore.generateObjective()

            // Should have generated successfully for POC
            expect(gameStore.currentObjective).not.toBeNull()

            consoleSpy.mockRestore()
        })
    })

    describe('Structured Character Data Storage', () => {
        it('should store character message with dice roll and outcome', () => {
            const gameStore = useGameStore()

            // Create a structured AI message with dice data
            const structuredMessage = {
                text: "I appreciate your counsel, but I must proceed with caution.",
                sender: 'ai' as const,
                timestamp: new Date(),
                diceRoll: 15,
                diceOutcome: 'Success'
            }

            gameStore.addAIMessageWithData(structuredMessage)

            const lastMessage = gameStore.messageHistory[gameStore.messageHistory.length - 1]
            expect(lastMessage.text).toBe(structuredMessage.text)
            expect(lastMessage.diceRoll).toBe(15)
            expect(lastMessage.diceOutcome).toBe('Success')
        })

        it('should store character action description', () => {
            const gameStore = useGameStore()

            const structuredMessage = {
                text: "Your advice resonates with me.",
                sender: 'ai' as const,
                timestamp: new Date(),
                diceRoll: 18,
                diceOutcome: 'Success',
                characterAction: "Franz Ferdinand decides to increase his security detail and avoid public appearances."
            }

            gameStore.addAIMessageWithData(structuredMessage)

            const lastMessage = gameStore.messageHistory[gameStore.messageHistory.length - 1]
            expect(lastMessage.characterAction).toBe("Franz Ferdinand decides to increase his security detail and avoid public appearances.")
        })

        it('should store timeline evaluation and progress impact', () => {
            const gameStore = useGameStore()

            const structuredMessage = {
                text: "I will consider this carefully.",
                sender: 'ai' as const,
                timestamp: new Date(),
                diceRoll: 16,
                diceOutcome: 'Success',
                timelineImpact: "Franz Ferdinand's increased caution reduces the likelihood of assassination, moving closer to preventing WWI.",
                progressChange: 25
            }

            gameStore.addAIMessageWithData(structuredMessage)

            const lastMessage = gameStore.messageHistory[gameStore.messageHistory.length - 1]
            expect(lastMessage.timelineImpact).toBe("Franz Ferdinand's increased caution reduces the likelihood of assassination, moving closer to preventing WWI.")
            expect(lastMessage.progressChange).toBe(25)
        })

        it('should maintain structured message history for context', () => {
            const gameStore = useGameStore()

            // Add a user message
            gameStore.addUserMessage("Be careful in Sarajevo on June 28, 1914")

            // Add structured AI response
            const structuredResponse = {
                text: "Your warning is most peculiar, yet I sense truth in it.",
                sender: 'ai' as const,
                timestamp: new Date(),
                diceRoll: 14,
                diceOutcome: 'Success',
                characterAction: "Franz Ferdinand asks his security chief to review the Sarajevo visit plans.",
                timelineImpact: "Initial steps toward preventing the assassination are taken.",
                progressChange: 15
            }

            gameStore.addAIMessageWithData(structuredResponse)

            expect(gameStore.messageHistory).toHaveLength(2)

            // Check user message remains simple
            const userMessage = gameStore.messageHistory[0]
            expect(userMessage.text).toBe("Be careful in Sarajevo on June 28, 1914")
            expect(userMessage.diceRoll).toBeUndefined()
            expect(userMessage.characterAction).toBeUndefined()

            // Check AI message has all structured data
            const aiMessage = gameStore.messageHistory[1]
            expect(aiMessage.text).toBe(structuredResponse.text)
            expect(aiMessage.diceRoll).toBe(14)
            expect(aiMessage.diceOutcome).toBe('Success')
            expect(aiMessage.characterAction).toBe(structuredResponse.characterAction)
            expect(aiMessage.timelineImpact).toBe(structuredResponse.timelineImpact)
            expect(aiMessage.progressChange).toBe(15)
        })
    })
})
