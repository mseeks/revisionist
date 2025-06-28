import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { callTimelineAI } from '~/server/utils/openai'
import type { StructuredCharacterResponse } from '~/server/utils/openai'

// Mock the OpenAI client for testing
const mockOpenAI = {
    chat: {
        completions: {
            create: vi.fn()
        }
    }
}

// Mock the OpenAI module properly
vi.mock('openai', () => ({
    default: vi.fn().mockImplementation(() => mockOpenAI)
}))

// Mock the runtime config
vi.mock('#nuxt/runtime-config', () => ({
    useRuntimeConfig: () => ({
        openaiApiKey: 'test-api-key'
    })
}))

describe('Timeline Analysis Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Mock process.env for API key
        process.env.OPENAI_API_KEY = 'test-api-key'
    })

    afterEach(() => {
        vi.resetAllMocks()
    })

    describe('callTimelineAI', () => {
        it('should evaluate character actions against current AI-generated objective', async () => {
            // Mock OpenAI client response
            mockOpenAI.chat.completions.create.mockResolvedValue({
                choices: [{
                    message: {
                        content: JSON.stringify({
                            timelineImpact: "Franz Ferdinand's decision to increase security creates a diplomatic incident with Serbia, escalating tensions toward the very conflict we seek to prevent.",
                            progressChange: -15
                        })
                    }
                }]
            })

            const characterResponse: StructuredCharacterResponse = {
                message: "These warnings concern me greatly. I shall take immediate action.",
                action: "Orders increased military presence at the Serbian border and demands investigation of Serbian intelligence"
            }

            const result = await callTimelineAI(
                3, // Critical Failure dice roll
                'Critical Failure',
                characterResponse,
                'Avoid conflict with Serbia at all costs',
                'Prevent World War I'
            )

            expect(result.success).toBe(true)
            expect(result.timelineImpact).toContain('escalating tensions')
            expect(result.progressChange).toBe(-15)
            expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    model: 'gpt-4.1',
                    messages: expect.arrayContaining([
                        expect.objectContaining({
                            role: 'system',
                            content: expect.stringContaining('Prevent World War I')
                        })
                    ]),
                    response_format: expect.objectContaining({
                        type: 'json_schema'
                    })
                })
            )
        })

        it('should consider dice roll magnitude in progress calculation', async () => {
            // Mock OpenAI client response for critical success
            mockOpenAI.chat.completions.create.mockResolvedValue({
                choices: [{
                    message: {
                        content: JSON.stringify({
                            timelineImpact: "Franz Ferdinand's diplomatic outreach to Serbian leaders creates unprecedented cooperation, significantly reducing tensions and establishing a framework for peaceful resolution of future disputes.",
                            progressChange: 35
                        })
                    }
                }]
            })

            const characterResponse: StructuredCharacterResponse = {
                message: "Your counsel rings true. I shall pursue peace through understanding.",
                action: "Initiates secret diplomatic meetings with Serbian officials and proposes joint cultural exchange programs"
            }

            const result = await callTimelineAI(
                20, // Critical Success dice roll
                'Critical Success',
                characterResponse,
                'Seek diplomatic cooperation with Serbia',
                'Prevent World War I'
            )

            expect(result.success).toBe(true)
            expect(result.timelineImpact).toContain('unprecedented cooperation')
            expect(result.progressChange).toBe(35)
            // Verify that the critical success roll magnitude influenced the calculation
            expect(result.progressChange).toBeGreaterThan(20) // Significant positive change
        })

        it('should analyze specific character decisions for cascading effects', async () => {
            // Mock OpenAI client response for character action with cascading effects
            mockOpenAI.chat.completions.create.mockResolvedValue({
                choices: [{
                    message: {
                        content: JSON.stringify({
                            timelineImpact: "Franz Ferdinand's proposal for constitutional reform creates ripple effects throughout the Empire. His advocacy for greater autonomy for ethnic minorities reduces nationalist tensions and provides a peaceful alternative to armed rebellion. This constitutional path could prevent the conditions that led to his assassination.",
                            progressChange: 25
                        })
                    }
                }]
            })

            const characterResponse: StructuredCharacterResponse = {
                message: "Perhaps it is time for the Empire to evolve with the times.",
                action: "Drafts a proposal for constitutional monarchy with increased autonomy for ethnic regions"
            }

            const result = await callTimelineAI(
                16, // Success dice roll
                'Success',
                characterResponse,
                'Consider constitutional reforms for ethnic minorities',
                'Prevent World War I'
            )

            expect(result.success).toBe(true)
            expect(result.timelineImpact).toContain('ripple effects')
            expect(result.timelineImpact).toContain('constitutional')
            expect(result.timelineImpact).toContain('assassination')
            expect(result.progressChange).toBe(25)

            // Verify the prompt includes character action analysis
            const callArgs = mockOpenAI.chat.completions.create.mock.calls[0][0]
            expect(callArgs.messages[0].content).toContain('constitutional monarchy')
            expect(callArgs.messages[0].content).toContain('ethnic regions')
        })

        it('should generate meaningful progress changes from character actions', async () => {
            // Test multiple scenarios to ensure meaningful progress calculation
            const scenarios = [
                {
                    diceRoll: 2,
                    outcome: 'Critical Failure',
                    action: 'Declares martial law and begins arresting suspected Serbian sympathizers',
                    expectedProgress: -30,
                    expectedImpact: 'martial law'
                },
                {
                    diceRoll: 10,
                    outcome: 'Neutral',
                    action: 'Postpones his planned visit to Sarajevo indefinitely',
                    expectedProgress: 5,
                    expectedImpact: 'postpones'
                },
                {
                    diceRoll: 18,
                    outcome: 'Success',
                    action: 'Establishes a peace commission with Serbian representatives',
                    expectedProgress: 30,
                    expectedImpact: 'peace commission'
                }
            ]

            for (const scenario of scenarios) {
                mockOpenAI.chat.completions.create.mockResolvedValue({
                    choices: [{
                        message: {
                            content: JSON.stringify({
                                timelineImpact: `Character action involving ${scenario.expectedImpact} has significant historical implications.`,
                                progressChange: scenario.expectedProgress
                            })
                        }
                    }]
                })

                const characterResponse: StructuredCharacterResponse = {
                    message: "I shall act according to your counsel.",
                    action: scenario.action
                }

                const result = await callTimelineAI(
                    scenario.diceRoll,
                    scenario.outcome,
                    characterResponse,
                    'Test message',
                    'Prevent World War I'
                )

                expect(result.success).toBe(true)
                expect(result.progressChange).toBe(scenario.expectedProgress)
                expect(result.timelineImpact).toContain(scenario.expectedImpact)

                // Clear the mock for the next iteration
                vi.clearAllMocks()
            }
        })

        it('should handle API errors gracefully', async () => {
            // Mock OpenAI client to throw an error
            mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API Error'))

            const characterResponse: StructuredCharacterResponse = {
                message: "Test message",
                action: "Test action"
            }

            const result = await callTimelineAI(
                15,
                'Success',
                characterResponse,
                'Test message',
                'Prevent World War I'
            )

            expect(result.success).toBe(false)
            expect(result.error).toContain('Timeline AI could not process the request')
        })

        it('should handle malformed AI responses', async () => {
            // Mock OpenAI client to return invalid JSON
            mockOpenAI.chat.completions.create.mockResolvedValue({
                choices: [{
                    message: {
                        content: 'invalid json response'
                    }
                }]
            })

            const characterResponse: StructuredCharacterResponse = {
                message: "Test message",
                action: "Test action"
            }

            const result = await callTimelineAI(
                15,
                'Success',
                characterResponse,
                'Test message',
                'Prevent World War I'
            )

            expect(result.success).toBe(false)
            expect(result.error).toContain('Timeline AI could not process the request')
        })
    })
})
