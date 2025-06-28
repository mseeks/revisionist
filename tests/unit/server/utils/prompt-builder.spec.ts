import { describe, it, expect } from 'vitest'
import { buildPrompt, buildCharacterPromptWithSchema, buildTimelineEvaluationPrompt } from '~/server/utils/prompt-builder'

describe('Prompt Builder', () => {
    describe('basic system prompt', () => {
        it('should create basic system prompt', () => {
            const prompt = buildPrompt()

            expect(prompt).toBeDefined()
            expect(typeof prompt).toBe('string')
            expect(prompt.length).toBeGreaterThan(0)
            expect(prompt).toContain('You are a historical figure')
        })
    })

    describe('Franz Ferdinand persona', () => {
        it('should include Franz Ferdinand persona', () => {
            const prompt = buildPrompt()

            expect(prompt).toContain('Franz Ferdinand')
            expect(prompt).toContain('Archduke')
            expect(prompt).toContain('Austria-Hungary')
        })
    })

    describe('Prevent World War I objective', () => {
        it('should include "Prevent World War I" objective', () => {
            const prompt = buildPrompt()

            expect(prompt).toContain('Prevent World War I')
            expect(prompt).toContain('1914')
            expect(prompt).toContain('war')
        })
    })

    describe('Dual Prompt System with Structured Outputs', () => {
        describe('Character Prompt with JSON Schema', () => {
            it('should create character-specific prompt with structured output schema', () => {
                const diceOutcome = 'Success'
                const prompt = buildCharacterPromptWithSchema(diceOutcome)

                expect(prompt).toBeDefined()
                expect(typeof prompt).toBe('string')
                expect(prompt).toContain('Franz Ferdinand')
                expect(prompt).toContain('JSON format')
                expect(prompt).toContain('"message"')
                expect(prompt).toContain('"action"')
                expect(prompt).toContain('160 characters')
            })

            it('should include dice outcome in character prompt for response magnitude', () => {
                const diceOutcome = 'Critical Success'
                const prompt = buildCharacterPromptWithSchema(diceOutcome)

                expect(prompt).toContain('Critical Success')
                expect(prompt).toContain('deeply moved and convinced')
            })

            it('should exclude knowledge of AI-generated objective', () => {
                const prompt = buildCharacterPromptWithSchema('Success')

                expect(prompt).not.toContain('Prevent World War I')
                expect(prompt).not.toContain('objective')
                expect(prompt).not.toContain('goal')
            })

            it('should include JSON schema definition for structured response', () => {
                const prompt = buildCharacterPromptWithSchema('Neutral')

                expect(prompt).toContain('message')
                expect(prompt).toContain('action')
                expect(prompt).toContain('JSON')
            })
        })

        describe('Timeline Evaluation Prompt', () => {
            it('should create timeline evaluation prompt that is dice and character data aware', () => {
                const diceRoll = 15
                const diceOutcome = 'Success'
                const characterResponse = {
                    message: "Your warning troubles me. I shall increase my security.",
                    action: "Orders additional guards and changes travel plans"
                }
                const userMessage = "Avoid Sarajevo on June 28, 1914"
                const objective = "Prevent World War I"

                const prompt = buildTimelineEvaluationPrompt(
                    diceRoll,
                    diceOutcome,
                    characterResponse,
                    userMessage,
                    objective
                )

                expect(prompt).toBeDefined()
                expect(typeof prompt).toBe('string')
                expect(prompt).toContain('15')
                expect(prompt).toContain('Success')
                expect(prompt).toContain('Prevent World War I')
                expect(prompt).toContain('Sarajevo')
            })

            it('should pass character message and action to timeline evaluator', () => {
                const characterResponse = {
                    message: "Your prophecy disturbs me greatly.",
                    action: "Calls emergency meeting with military advisors"
                }

                const prompt = buildTimelineEvaluationPrompt(
                    12,
                    'Neutral',
                    characterResponse,
                    'Test message',
                    'Test objective'
                )

                expect(prompt).toContain('Your prophecy disturbs me greatly')
                expect(prompt).toContain('emergency meeting with military advisors')
            })

            it('should analyze character actions for historical impact toward current objective', () => {
                const prompt = buildTimelineEvaluationPrompt(
                    18,
                    'Success',
                    { message: "Test", action: "Test action" },
                    'Test',
                    'Prevent World War I'
                )

                expect(prompt).toContain('historical impact')
                expect(prompt).toContain('progress')
                expect(prompt).toContain('Prevent World War I')
                expect(prompt).toContain('timeline')
            })
        })
    })
})
