import { defineStore } from 'pinia'
import type { GameObjective } from '~/server/utils/objective-generator'

/**
 * Message Interface
 * Defines the structure of messages in the game
 */
export interface Message {
    text: string
    sender: 'user' | 'ai' | 'system'
    timestamp: Date
    diceRoll?: number
    diceOutcome?: string
    characterAction?: string
    timelineImpact?: string
    progressChange?: number
}

/**
 * Game Status Type
 * Represents the current state of the game
 */
export type GameStatus = 'playing' | 'gameOver'

/**
 * Game Store
 * Manages the core game state including messages, counter, and game status
 */
export const useGameStore = defineStore('game', {
    state: () => ({
        remainingMessages: 5,
        messageHistory: [] as Message[],
        gameStatus: 'playing' as GameStatus,
        isLoading: false,
        error: null as string | null,
        lastMessageTime: null as number | null,
        isRateLimited: false,
        currentObjective: null as GameObjective | null,
        objectiveProgress: 0
    }),

    getters: {
        /**
         * Computed property to check if user can send messages
         * Returns false when no messages remain, game is over, loading, or rate limited
         */
        canSendMessage(): boolean {
            return this.remainingMessages > 0 && 
                   this.gameStatus === 'playing' && 
                   !this.isLoading &&
                   !this.isRateLimited
        }
    },

    actions: {
        /**
         * Checks if game should be over and updates status
         * Game ends when all 5 messages are used
         */
        checkGameOver() {
            if (this.remainingMessages === 0) {
                this.gameStatus = 'gameOver'
            }
        },

        /**
         * Decrements the remaining message count
         * Will not go below 0 and checks for game over
         */
        decrementMessages() {
            if (this.remainingMessages > 0) {
                this.remainingMessages--
                this.checkGameOver()
            }
        },

        /**
         * Adds a user message to the message history
         * Creates a new message with current timestamp
         * Will not add message if game is over
         */
        addUserMessage(text: string) {
            // Prevent adding messages when game is over
            if (this.gameStatus === 'gameOver') {
                return
            }

            const message: Message = {
                text,
                sender: 'user',
                timestamp: new Date()
            }
            this.messageHistory.push(message)
        },

        /**
         * Adds an AI message to the message history
         * Creates a new message with current timestamp
         */
        addAIMessage(text: string) {
            const message: Message = {
                text,
                sender: 'ai',
                timestamp: new Date()
            }
            this.messageHistory.push(message)
        },

        /**
         * Adds an AI message with structured data to the message history
         * Supports dice roll data, character action, timeline impact, and progress changes
         */
        addAIMessageWithData(messageData: Partial<Message> & { text: string, sender: 'ai' }) {
            const message: Message = {
                text: messageData.text,
                sender: messageData.sender,
                timestamp: messageData.timestamp || new Date(),
                diceRoll: messageData.diceRoll,
                diceOutcome: messageData.diceOutcome,
                characterAction: messageData.characterAction,
                timelineImpact: messageData.timelineImpact,
                progressChange: messageData.progressChange
            }
            this.messageHistory.push(message)
        },

        /**
         * Sets the loading state
         */
        setLoading(loading: boolean) {
            this.isLoading = loading
        },

        /**
         * Sets an error message
         */
        setError(error: string | null) {
            this.error = error
        },

        /**
         * Checks if enough time has passed since last message (1 second minimum)
         */
        checkRateLimit(): boolean {
            const now = Date.now()
            if (this.lastMessageTime && (now - this.lastMessageTime) < 1000) {
                return false // Rate limited
            }
            return true // OK to send
        },

        /**
         * Sets rate limited state with auto-clear after 1 second
         */
        setRateLimit() {
            this.isRateLimited = true
            // Auto-clear rate limit after remaining time
            const remainingTime = this.lastMessageTime ? 
                Math.max(0, 1000 - (Date.now() - this.lastMessageTime)) : 0
            
            setTimeout(() => {
                this.isRateLimited = false
            }, remainingTime || 1000)
        },

        /**
         * Send message with async AI response handling
         * Handles the full flow: user message -> API call -> AI response
         * Includes rate limiting protection (1 second between calls)
         */
        async sendMessage(text: string): Promise<void> {
            try {
                // Check rate limiting
                if (!this.checkRateLimit()) {
                    this.setRateLimit()
                    this.setError('Please wait before sending another message')
                    return
                }

                // Clear any previous errors
                this.setError(null)
                
                // Add user message first
                this.addUserMessage(text)
                
                // Decrement message count
                this.decrementMessages()
                
                // Set loading state and record timestamp
                this.setLoading(true)
                this.lastMessageTime = Date.now()
                
                // Call the API with conversation history
                const response = await $fetch('/api/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: {
                        message: text,
                        conversationHistory: this.messageHistory.filter(msg => msg.sender !== 'system')
                    }
                })
                
                // Handle successful response
                if (response.success && response.data) {
                    // Check for new dual-layer AI response first
                    if ('characterResponse' in response.data && response.data.characterResponse) {
                        // Phase 4: Handle dual-layer AI response with structured data storage
                        const data = response.data as any // Type assertion for now until we update interfaces
                        const { characterResponse, diceRoll, diceOutcome, timelineAnalysis } = data

                        // Store structured AI response with all dice and timeline data
                        this.addAIMessageWithData({
                            text: characterResponse.message,
                            sender: 'ai',
                            timestamp: new Date(),
                            diceRoll: diceRoll,
                            diceOutcome: diceOutcome,
                            characterAction: characterResponse.action,
                            timelineImpact: timelineAnalysis?.impact,
                            progressChange: timelineAnalysis?.progressChange
                        })

                        // Update objective progress if timeline analysis provided progress change
                        if (timelineAnalysis?.progressChange) {
                            this.updateObjectiveProgress(timelineAnalysis.progressChange)
                        }
                    } else if ('aiResponse' in response.data && response.data.aiResponse) {
                        // Backward compatibility: Handle old single-layer AI response
                        const data = response.data as any
                        this.addAIMessage(data.aiResponse)
                    } else {
                        // Handle case where response succeeded but no AI content
                        const data = response.data as any
                        const errorMsg = data.error || 'No AI response received'
                        this.setError(errorMsg)
                    }
                } else {
                    // Handle API errors
                    const errorMsg = response.data?.error || 'Failed to get AI response'
                    this.setError(errorMsg)
                    // Don't restore message count on error to prevent spam
                }
                
            } catch (error) {
                console.error('Error sending message:', error)
                this.setError('Failed to send message. Please try again.')
                // Restore message count on network errors
                if (this.remainingMessages < 5) {
                    this.remainingMessages++
                }
            } finally {
                // Always clear loading state
                this.setLoading(false)
            }
        },

        /**
         * Generates and sets a new objective for the game
         */
        async generateObjective(): Promise<void> {
            try {
                this.setLoading(true)
                this.setError(null)

                const { generateObjective } = await import('~/server/utils/objective-generator')
                const objective = await generateObjective()

                this.currentObjective = objective
                this.objectiveProgress = 0

            } catch (error) {
                console.error('Error generating objective:', error)
                this.setError('Failed to generate game objective')
            } finally {
                this.setLoading(false)
            }
        },

        /**
         * Updates progress toward the current objective
         */
        updateObjectiveProgress(progressChange: number) {
            if (this.currentObjective) {
                this.objectiveProgress = Math.max(0, Math.min(100, this.objectiveProgress + progressChange))

                // Check for victory condition
                if (this.objectiveProgress >= 100) {
                    this.gameStatus = 'gameOver'
                }
            }
        },

        /**
         * Resets the game to initial state
         * Clears message history and resets message count
         */
        resetGame() {
            this.remainingMessages = 5
            this.messageHistory = []
            this.gameStatus = 'playing'
            this.isLoading = false
            this.error = null
            this.lastMessageTime = null
            this.isRateLimited = false
            this.currentObjective = null
            this.objectiveProgress = 0
        }
    }
})
