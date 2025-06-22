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
        error: null as string | null
    }),

    getters: {
        /**
         * Computed property to check if user can send messages
         * Returns false when no messages remain, game is over, or loading
         */
        canSendMessage(): boolean {
            return this.remainingMessages > 0 && 
                   this.gameStatus === 'playing' && 
                   !this.isLoading
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
         * Send message with async AI response handling
         * Handles the full flow: user message -> API call -> AI response
         */
        async sendMessage(text: string): Promise<void> {
            try {
                // Clear any previous errors
                this.setError(null)
                
                // Add user message first
                this.addUserMessage(text)
                
                // Decrement message count
                this.decrementMessages()
                
                // Set loading state
                this.setLoading(true)
                
                // Call the API
                const response = await $fetch('/api/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: {
                        message: text
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
        }
    }
})
