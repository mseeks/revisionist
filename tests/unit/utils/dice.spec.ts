import { describe, it, expect, vi } from 'vitest'
import { rollD20, DiceOutcome } from '../../../utils/dice'

describe('Dice Utility', () => {
    describe('rollD20', () => {
        it('should roll a number between 1-20', () => {
            // Test multiple rolls to ensure range is correct
            for (let i = 0; i < 100; i++) {
                const result = rollD20()
                expect(result.roll).toBeGreaterThanOrEqual(1)
                expect(result.roll).toBeLessThanOrEqual(20)
                expect(Number.isInteger(result.roll)).toBe(true)
            }
        })

        it('should categorize roll into outcome tiers', () => {
            // Mock Math.random to test specific outcomes
            const mockRandom = vi.spyOn(Math, 'random')

            // Test Critical Failure (1-2)
            mockRandom.mockReturnValue(0) // Should give roll of 1
            let result = rollD20()
            expect(result.outcome).toBe(DiceOutcome.CRITICAL_FAILURE)

            mockRandom.mockReturnValue(0.05) // Should give roll of 2
            result = rollD20()
            expect(result.outcome).toBe(DiceOutcome.CRITICAL_FAILURE)

            // Test Failure (3-7)
            mockRandom.mockReturnValue(0.15) // Should give roll of 4
            result = rollD20()
            expect(result.outcome).toBe(DiceOutcome.FAILURE)

            mockRandom.mockReturnValue(0.3) // Should give roll of 7
            result = rollD20()
            expect(result.outcome).toBe(DiceOutcome.FAILURE)

            // Test Neutral (8-13)
            mockRandom.mockReturnValue(0.4) // Should give roll of 9
            result = rollD20()
            expect(result.outcome).toBe(DiceOutcome.NEUTRAL)

            mockRandom.mockReturnValue(0.6) // Should give roll of 13
            result = rollD20()
            expect(result.outcome).toBe(DiceOutcome.NEUTRAL)

            // Test Success (14-18)
            mockRandom.mockReturnValue(0.7) // Should give roll of 15
            result = rollD20()
            expect(result.outcome).toBe(DiceOutcome.SUCCESS)

            mockRandom.mockReturnValue(0.85) // Should give roll of 18
            result = rollD20()
            expect(result.outcome).toBe(DiceOutcome.SUCCESS)

            // Test Critical Success (19-20)
            mockRandom.mockReturnValue(0.9) // Should give roll of 19
            result = rollD20()
            expect(result.outcome).toBe(DiceOutcome.CRITICAL_SUCCESS)

            mockRandom.mockReturnValue(0.95) // Should give roll of 20
            result = rollD20()
            expect(result.outcome).toBe(DiceOutcome.CRITICAL_SUCCESS)

            mockRandom.mockRestore()
        })

        it('should return both roll value and outcome type', () => {
            const result = rollD20()

            // Check that result has both properties
            expect(result).toHaveProperty('roll')
            expect(result).toHaveProperty('outcome')

            // Check types
            expect(typeof result.roll).toBe('number')
            expect(typeof result.outcome).toBe('string')

            // Check that outcome is one of the valid enum values
            const validOutcomes = Object.values(DiceOutcome)
            expect(validOutcomes).toContain(result.outcome)
        })

        it('should have consistent outcome categorization', () => {
            // Test specific roll values to ensure consistent categorization
            const testCases = [
                { roll: 1, expected: DiceOutcome.CRITICAL_FAILURE },
                { roll: 2, expected: DiceOutcome.CRITICAL_FAILURE },
                { roll: 3, expected: DiceOutcome.FAILURE },
                { roll: 7, expected: DiceOutcome.FAILURE },
                { roll: 8, expected: DiceOutcome.NEUTRAL },
                { roll: 13, expected: DiceOutcome.NEUTRAL },
                { roll: 14, expected: DiceOutcome.SUCCESS },
                { roll: 18, expected: DiceOutcome.SUCCESS },
                { roll: 19, expected: DiceOutcome.CRITICAL_SUCCESS },
                { roll: 20, expected: DiceOutcome.CRITICAL_SUCCESS }
            ]

            const mockRandom = vi.spyOn(Math, 'random')

            testCases.forEach(({ roll, expected }) => {
                // Math.random() * 20 + 1, so for roll N, we need (N-1)/20
                mockRandom.mockReturnValue((roll - 1) / 20)
                const result = rollD20()
                expect(result.roll).toBe(roll)
                expect(result.outcome).toBe(expected)
            })

            mockRandom.mockRestore()
        })
    })
})
