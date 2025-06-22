import { describe, it, expect } from 'vitest'
import { buildPrompt } from '~/server/utils/prompt-builder'

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
})
