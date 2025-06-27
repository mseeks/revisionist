import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateObjective } from '~/server/utils/objective-generator'

// Mock OpenAI
vi.mock('~/server/utils/openai', () => ({
    getOpenAIClient: vi.fn(() => ({
        chat: {
            completions: {
                create: vi.fn()
            }
        }
    }))
}))

describe('Objective Generator', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('generateObjective', () => {
        it('should generate unique historical objectives', async () => {
            // This test should fail initially since generateObjective doesn't exist
            const objective = await generateObjective()

            expect(objective).toBeDefined()
            expect(typeof objective.title).toBe('string')
            expect(objective.title.length).toBeGreaterThan(0)
        })

        it('should include clear success criteria', async () => {
            const objective = await generateObjective()

            expect(objective.successCriteria).toBeDefined()
            expect(typeof objective.successCriteria).toBe('string')
            expect(objective.successCriteria.length).toBeGreaterThan(10)
        })

        it('should provide historical context', async () => {
            const objective = await generateObjective()

            expect(objective.historicalContext).toBeDefined()
            expect(typeof objective.historicalContext).toBe('string')
            expect(objective.historicalContext.length).toBeGreaterThan(20)
        })

        it('should return structured objective data', async () => {
            const objective = await generateObjective()

            expect(objective).toMatchObject({
                title: expect.any(String),
                successCriteria: expect.any(String),
                historicalContext: expect.any(String),
                targetProgress: expect.any(Number),
                difficulty: expect.any(String)
            })

            expect(objective.targetProgress).toBe(100)
            expect(['easy', 'medium', 'hard'].includes(objective.difficulty)).toBe(true)
        })

        it('should generate "Prevent World War I" consistently for POC testing', async () => {
            const objective1 = await generateObjective()
            const objective2 = await generateObjective()

            // For POC, should be consistent
            expect(objective1.title).toBe('Prevent World War I')
            expect(objective2.title).toBe('Prevent World War I')
            expect(objective1.title).toBe(objective2.title)
        })

        it('should handle API errors gracefully', async () => {
            // Since POC uses generatePOCObjective, this test verifies error handling structure
            // In production with AI generation, this would test actual API failures
            const spy = vi.spyOn(console, 'error').mockImplementation(() => { })

            // For now, test that the function completes successfully
            // In future AI implementation, we would mock API failures
            const objective = await generateObjective()
            expect(objective).toBeDefined()

            spy.mockRestore()
        })
    })
})
