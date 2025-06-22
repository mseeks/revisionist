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
         * Returns false when no messages remain
         */
        canSendMessage(): boolean {
            return this.remainingMessages > 0
        }
    },

    actions: {
        /**
         * Decrements the remaining message count
         * Will not go below 0
         */
        decrementMessages() {
            if (this.remainingMessages > 0) {
                this.remainingMessages--
            }
        },

        /**
         * Adds a user message to the message history
         * Creates a new message with current timestamp
         */
        addUserMessage(text: string) {
            const message: Message = {
                text,
                sender: 'user',
                timestamp: new Date()
            }
            this.messageHistory.push(message)
        }
    }
})
