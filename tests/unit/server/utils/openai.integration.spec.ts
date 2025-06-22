import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock the OpenAI client for testing
const mockOpenAI = {
    chat: {
        completions: {
            create: vi.fn()
        }
    }
}

// Mock the OpenAI utilities properly
vi.mock('openai', () => ({
    default: vi.fn().mockImplementation(() => mockOpenAI)
}))

// Mock the runtime config
vi.mock('#nuxt/runtime-config', () => ({
    useRuntimeConfig: () => ({
        openaiApiKey: 'test-api-key'
    })
}))

// Integration tests for the actual OpenAI implementation
describe('OpenAI Integration (Real Implementation)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Reset environment variable
        process.env.OPENAI_API_KEY = 'test-api-key'
    })

    afterEach(() => {
        vi.clearAllMocks()
        delete process.env.OPENAI_API_KEY
    })

    it('should create proper OpenAI API call structure', async () => {
        // Arrange
        const mockResponse = {
            choices: [{
                message: {
                    content: "Mein Freund, I find your warnings about the future most intriguing. Though I am skeptical of such prophecies, I cannot ignore the urgency in your words."
                }
            }]
        }
        mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse)

        // Act
        const { callOpenAI } = await import('~/server/utils/openai')
        const result = await callOpenAI("Avoid Sarajevo in June 1914")

        // Assert
        expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: expect.stringContaining('Franz Ferdinand')
                },
                {
                    role: 'user',
                    content: 'Avoid Sarajevo in June 1914'
                }
            ],
            temperature: 0.8,
            max_tokens: 200
        })

        expect(result.success).toBe(true)
        expect(result.aiResponse).toContain('Mein Freund')
    })

    it('should handle empty choices array gracefully', async () => {
        // Arrange
        mockOpenAI.chat.completions.create.mockResolvedValue({
            choices: []
        })

        // Act
        const { callOpenAI } = await import('~/server/utils/openai')
        const result = await callOpenAI("Test message")

        // Assert
        expect(result.success).toBe(false)
        expect(result.error).toBe('I apologize, but I cannot respond at this moment. Perhaps try again shortly.')
    })

    it('should handle empty AI response content', async () => {
        // Arrange
        mockOpenAI.chat.completions.create.mockResolvedValue({
            choices: [{
                message: {
                    content: ""
                }
            }]
        })

        // Act
        const { callOpenAI } = await import('~/server/utils/openai')
        const result = await callOpenAI("Test message")

        // Assert
        expect(result.success).toBe(false)
        expect(result.error).toBe('I apologize, but I cannot respond at this moment. Perhaps try again shortly.')
    })

    it('should handle network/API errors gracefully', async () => {
        // Arrange
        mockOpenAI.chat.completions.create.mockRejectedValue(new Error('Network error'))

        // Act
        const { callOpenAI } = await import('~/server/utils/openai')
        const result = await callOpenAI("Test message")

        // Assert
        expect(result.success).toBe(false)
        expect(result.error).toBe('I apologize, but I cannot respond at this moment. Perhaps try again shortly.')
    })

    it('should use Franz Ferdinand system prompt with historical context', async () => {
        // Arrange
        const mockResponse = {
            choices: [{
                message: {
                    content: "Your message concerns me greatly. I shall take precautions."
                }
            }]
        }
        mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse)

        // Act
        const { callOpenAI } = await import('~/server/utils/openai')
        await callOpenAI("There will be an assassination attempt")

        // Assert - Verify the system prompt includes key elements from the game design
        expect(mockOpenAI.chat.completions.create).toHaveBeenCalled()
        const callArgs = mockOpenAI.chat.completions.create.mock.calls[0][0]
        const systemPrompt = callArgs.messages[0].content

        expect(systemPrompt).toContain('Franz Ferdinand')
        expect(systemPrompt).toContain('Austria-Hungary')
        expect(systemPrompt).toContain('1913-1914')
        expect(systemPrompt).toContain('Prevent World War I')
        expect(systemPrompt).toContain('time traveler')
    })
})
