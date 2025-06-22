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
        gameStatus: 'playing' as GameStatus
    }),

    getters: {
        /**
         * Computed property to check if user can send messages
         * Returns false when no messages remain or game is over
         */
        canSendMessage(): boolean {
            return this.remainingMessages > 0 && this.gameStatus === 'playing'
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
        }
    }
})
