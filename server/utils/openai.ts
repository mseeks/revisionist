import OpenAI from 'openai'
import { buildPrompt } from './prompt-builder'

let openaiClient: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
    if (!openaiClient) {
        const config = useRuntimeConfig()
        const apiKey = config.openaiApiKey || process.env.OPENAI_API_KEY

        if (!apiKey) {
            throw new Error('OpenAI API key is not configured')
        }

        openaiClient = new OpenAI({
            apiKey: apiKey
        })
    }

    return openaiClient
}

/**
 * AI Response Interface
 * Designed to support future dice roll integration (Phase 4)
 */
export interface AIResponse {
    success: boolean
    aiResponse?: string
    error?: string
}

/**
 * Call OpenAI API with proper error handling
 * Uses game-specific prompt for Franz Ferdinand character
 * 
 * @param userMessage - The player's message to send to the historical figure
 * @returns Promise<AIResponse> - Response with success status and AI reply
 */
export async function callOpenAI(userMessage: string): Promise<AIResponse> {
    try {
        const client = getOpenAIClient()
        const systemPrompt = buildPrompt()

        const completion = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.8, // Higher temperature for more creative/authentic responses
            max_tokens: 200 // Limit response length to keep it concise
        })

        // Validate response structure
        if (!completion.choices || completion.choices.length === 0) {
            return {
                success: false,
                error: 'I apologize, but I cannot respond at this moment. Perhaps try again shortly.'
            }
        }

        const aiContent = completion.choices[0].message?.content?.trim()

        // Handle empty or invalid responses
        if (!aiContent) {
            return {
                success: false,
                error: 'I apologize, but I cannot respond at this moment. Perhaps try again shortly.'
            }
        }

        return {
            success: true,
            aiResponse: aiContent
        }

    } catch (error) {
        // Log the actual error for debugging, but return a generic message to the user
        console.error('OpenAI API error:', error)

        return {
            success: false,
            error: 'I apologize, but I cannot respond at this moment. Perhaps try again shortly.'
        }
    }
}
