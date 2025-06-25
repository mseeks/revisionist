import { defineStore } from 'pinia'

/**
 * Message Interface
 * Defines the structure of messages in the game
 */
export interface Message {
    text: string
    sender: 'user' | 'ai' | 'system'
    timestamp: Date
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
        isRateLimited: false
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
                if (response.success && response.data.aiResponse) {
                    this.addAIMessage(response.data.aiResponse)
                } else {
                    // Handle API errors
                    const errorMsg = response.data.error || 'Failed to get AI response'
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
        }
    }
})
