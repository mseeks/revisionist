import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../../../stores/game'
import { generateGameSummary } from '../../../utils/game-summary'
import type { Message } from '../../../stores/game'

describe('Game Summary Generation', () => {
    let gameStore: ReturnType<typeof useGameStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        gameStore = useGameStore()
    })

    describe('Critical Turning Points', () => {
        beforeEach(() => {
            // Set up message history with various dice rolls
            gameStore.messageHistory = [
                {
                    text: 'Mediocre message 1',
                    sender: 'user',
                    timestamp: new Date('2024-01-01T10:00:00'),
                    diceRoll: 12,
                    diceOutcome: 'Neutral',
                    progressChange: 0
                },
                {
                    text: 'Critical success message',
                    sender: 'user',
                    timestamp: new Date('2024-01-01T10:05:00'),
                    diceRoll: 20,
                    diceOutcome: 'Critical Success',
                    progressChange: 50
                },
                {
                    text: 'Critical failure message',
                    sender: 'user',
                    timestamp: new Date('2024-01-01T10:10:00'),
                    diceRoll: 1,
                    diceOutcome: 'Critical Failure',
                    progressChange: -25
                },
                {
                    text: 'Regular success message',
                    sender: 'user',
                    timestamp: new Date('2024-01-01T10:15:00'),
                    diceRoll: 16,
                    diceOutcome: 'Success',
                    progressChange: 20
                }
            ] as Message[]
        })

        it('should list critical turning points', () => {
            const summary = generateGameSummary(gameStore)

            expect(summary.criticalTurningPoints).toBeDefined()
            expect(summary.criticalTurningPoints.length).toBeGreaterThan(0)

            // Should include critical success and critical failure
            const criticalRolls = summary.criticalTurningPoints.filter(point =>
                point.diceRoll === 20 || point.diceRoll === 1
            )
            expect(criticalRolls.length).toBe(2)
        })

        it('should prioritize extreme outcomes in turning points', () => {
            const summary = generateGameSummary(gameStore)

            // Critical success (20) should be first in importance
            const firstTurningPoint = summary.criticalTurningPoints[0]
            expect(firstTurningPoint.diceRoll).toBe(20)
            expect(firstTurningPoint.diceOutcome).toBe('Critical Success')
        })

        it('should include progress impact in turning points', () => {
            const summary = generateGameSummary(gameStore)

            const criticalSuccess = summary.criticalTurningPoints.find(point => point.diceRoll === 20)
            expect(criticalSuccess?.progressChange).toBe(50)

            const criticalFailure = summary.criticalTurningPoints.find(point => point.diceRoll === 1)
            expect(criticalFailure?.progressChange).toBe(-25)
        })
    })

    describe('Best/Worst Rolls Highlighting', () => {
        beforeEach(() => {
            gameStore.messageHistory = [
                {
                    text: 'Worst roll message',
                    sender: 'user',
                    timestamp: new Date(),
                    diceRoll: 2,
                    diceOutcome: 'Critical Failure',
                    progressChange: -10
                },
                {
                    text: 'Medium roll message',
                    sender: 'user',
                    timestamp: new Date(),
                    diceRoll: 15,
                    diceOutcome: 'Success',
                    progressChange: 15
                },
                {
                    text: 'Best roll message',
                    sender: 'user',
                    timestamp: new Date(),
                    diceRoll: 19,
                    diceOutcome: 'Critical Success',
                    progressChange: 40
                }
            ] as Message[]
        })

        it('should highlight best roll', () => {
            const summary = generateGameSummary(gameStore)

            expect(summary.bestRoll).toBeDefined()
            expect(summary.bestRoll?.diceRoll).toBe(19)
            expect(summary.bestRoll?.diceOutcome).toBe('Critical Success')
            expect(summary.bestRoll?.text).toBe('Best roll message')
        })

        it('should highlight worst roll', () => {
            const summary = generateGameSummary(gameStore)

            expect(summary.worstRoll).toBeDefined()
            expect(summary.worstRoll?.diceRoll).toBe(2)
            expect(summary.worstRoll?.diceOutcome).toBe('Critical Failure')
            expect(summary.worstRoll?.text).toBe('Worst roll message')
        })

        it('should handle single message correctly', () => {
            gameStore.messageHistory = [
                {
                    text: 'Only message',
                    sender: 'user',
                    timestamp: new Date(),
                    diceRoll: 12,
                    diceOutcome: 'Neutral',
                    progressChange: 5
                }
            ] as Message[]

            const summary = generateGameSummary(gameStore)

            expect(summary.bestRoll?.diceRoll).toBe(12)
            expect(summary.worstRoll?.diceRoll).toBe(12)
            expect(summary.bestRoll).toEqual(summary.worstRoll)
        })
    })

    describe('Message Efficiency', () => {
        it('should show message efficiency for victory', () => {
            gameStore.gameStatus = 'victory'
            gameStore.remainingMessages = 2
            gameStore.objectiveProgress = 100

            const summary = generateGameSummary(gameStore)

            expect(summary.messageEfficiency).toBeDefined()
            expect(summary.messageEfficiency.messagesUsed).toBe(3)
            expect(summary.messageEfficiency.messagesSaved).toBe(2)
            expect(summary.messageEfficiency.totalMessages).toBe(5)
            expect(summary.messageEfficiency.efficiencyPercentage).toBe(40) // 2/5 * 100
        })

        it('should show message efficiency for defeat', () => {
            gameStore.gameStatus = 'defeat'
            gameStore.remainingMessages = 0
            gameStore.objectiveProgress = 75

            const summary = generateGameSummary(gameStore)

            expect(summary.messageEfficiency.messagesUsed).toBe(5)
            expect(summary.messageEfficiency.messagesSaved).toBe(0)
            expect(summary.messageEfficiency.efficiencyPercentage).toBe(0)
        })

        it('should calculate efficiency rating', () => {
            gameStore.gameStatus = 'victory'
            gameStore.remainingMessages = 4 // Only 1 message used

            const summary = generateGameSummary(gameStore)

            expect(summary.messageEfficiency.efficiencyRating).toBe('Legendary')
        })
    })

    describe('Overall Statistics', () => {
        beforeEach(() => {
            gameStore.gameStatus = 'victory'
            gameStore.objectiveProgress = 100
            gameStore.remainingMessages = 1
            gameStore.messageHistory = [
                {
                    text: 'Message 1',
                    sender: 'user',
                    timestamp: new Date('2024-01-01T10:00:00'),
                    diceRoll: 8,
                    diceOutcome: 'Neutral',
                    progressChange: 10
                },
                {
                    text: 'Message 2',
                    sender: 'user',
                    timestamp: new Date('2024-01-01T10:05:00'),
                    diceRoll: 18,
                    diceOutcome: 'Success',
                    progressChange: 30
                },
                {
                    text: 'Message 3',
                    sender: 'user',
                    timestamp: new Date('2024-01-01T10:10:00'),
                    diceRoll: 20,
                    diceOutcome: 'Critical Success',
                    progressChange: 60
                }
            ] as Message[]
        })

        it('should calculate average dice roll', () => {
            const summary = generateGameSummary(gameStore)

            expect(summary.statistics.averageDiceRoll).toBe(15.33) // (8 + 18 + 20) / 3
        })

        it('should calculate total progress gained', () => {
            const summary = generateGameSummary(gameStore)

            expect(summary.statistics.totalProgressGained).toBe(100) // 10 + 30 + 60
        })

        it('should determine game outcome', () => {
            const summary = generateGameSummary(gameStore)

            expect(summary.statistics.gameOutcome).toBe('victory')
            expect(summary.statistics.finalProgress).toBe(100)
        })

        it('should calculate game duration', () => {
            const summary = generateGameSummary(gameStore)

            expect(summary.statistics.gameDurationMinutes).toBe(10) // 10 minutes between first and last message
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty message history', () => {
            gameStore.messageHistory = []

            const summary = generateGameSummary(gameStore)

            expect(summary.criticalTurningPoints).toEqual([])
            expect(summary.bestRoll).toBeNull()
            expect(summary.worstRoll).toBeNull()
            expect(summary.statistics.averageDiceRoll).toBe(0)
        })

        it('should handle messages without dice rolls', () => {
            gameStore.messageHistory = [
                {
                    text: 'System message',
                    sender: 'system',
                    timestamp: new Date()
                },
                {
                    text: 'AI response',
                    sender: 'ai',
                    timestamp: new Date()
                }
            ] as Message[]

            const summary = generateGameSummary(gameStore)

            expect(summary.criticalTurningPoints).toEqual([])
            expect(summary.bestRoll).toBeNull()
            expect(summary.worstRoll).toBeNull()
        })

        it('should handle missing progress change data', () => {
            gameStore.messageHistory = [
                {
                    text: 'Message without progress',
                    sender: 'user',
                    timestamp: new Date(),
                    diceRoll: 15,
                    diceOutcome: 'Success'
                    // No progressChange field
                }
            ] as Message[]

            const summary = generateGameSummary(gameStore)

            expect(summary.statistics.totalProgressGained).toBe(0)
            expect(() => generateGameSummary(gameStore)).not.toThrow()
        })
    })
})
