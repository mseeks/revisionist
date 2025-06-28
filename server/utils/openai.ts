import OpenAI from 'openai'
import { buildPrompt, buildCharacterPrompt, buildCharacterPromptWithSchema, buildTimelineEvaluationPrompt } from './prompt-builder'

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
 * Structured Character Response Interface (Phase 4)
 */
export interface StructuredCharacterResponse {
    message: string
    action: string
}

/**
 * Character AI Response Interface (Phase 4)
 */
export interface CharacterAIResponse {
    success: boolean
    characterResponse?: StructuredCharacterResponse
    error?: string
}

/**
 * Timeline Analysis Response Interface (Phase 4)
 */
export interface TimelineAIResponse {
    success: boolean
    timelineImpact?: string
    progressChange?: number
    error?: string
}

/**
 * Call OpenAI API with proper error handling
 * Uses game-specific prompt for Franz Ferdinand character
 * 
 * @param userMessage - The player's message to send to the historical figure
 * @param conversationHistory - Array of previous messages for context
 * @returns Promise<AIResponse> - Response with success status and AI reply
 */
export async function callOpenAI(userMessage: string, conversationHistory: any[] = []): Promise<AIResponse> {
    try {
        const client = getOpenAIClient()
        const systemPrompt = buildPrompt()

        // Build messages array: system prompt + conversation history
        // If conversationHistory is empty, add the current user message
        const messages = [
            { role: 'system' as const, content: systemPrompt },
            ...conversationHistory.map((msg: any) => {
                const role = msg.sender === 'user' ? 'user' as const : 'assistant' as const
                return {
                    role,
                    content: msg.text
                }
            })
        ]

        // If no conversation history provided, add the current user message
        if (conversationHistory.length === 0) {
            messages.push({ role: 'user' as const, content: userMessage })
        }

        const completion = await client.chat.completions.create({
            model: 'gpt-4.1',
            messages,
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

/**
 * Call Character AI with structured outputs (Phase 4)
 * Uses OpenAI structured outputs to get both message and action from Franz Ferdinand
 * 
 * @param userMessage - The player's message to send to the historical figure
 * @param conversationHistory - Array of previous messages for context
 * @param diceOutcome - The dice outcome to influence response magnitude
 * @returns Promise<CharacterAIResponse> - Structured response with message and action
 */
export async function callCharacterAI(
    userMessage: string,
    conversationHistory: any[] = [],
    diceOutcome: string
): Promise<CharacterAIResponse> {
    try {
        const client = getOpenAIClient()
        const systemPrompt = buildCharacterPromptWithSchema(diceOutcome)

        // Build messages array: system prompt + conversation history + current message
        const messages = [
            { role: 'system' as const, content: systemPrompt },
            ...conversationHistory.map((msg: any) => {
                const role = msg.sender === 'user' ? 'user' as const : 'assistant' as const
                return {
                    role,
                    content: msg.text
                }
            }),
            { role: 'user' as const, content: userMessage }
        ]

        // Define the structured output schema
        const responseSchema = {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'What Franz Ferdinand says in response to the player'
                },
                action: {
                    type: 'string',
                    description: 'What Franz Ferdinand decides to do as a result of this message'
                }
            },
            required: ['message', 'action'],
            additionalProperties: false
        }

        const completion = await client.chat.completions.create({
            model: 'gpt-4.1',
            messages,
            temperature: 0.8,
            max_tokens: 300,
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'character_response',
                    schema: responseSchema
                }
            }
        })

        // Validate response structure
        if (!completion.choices || completion.choices.length === 0) {
            return {
                success: false,
                error: 'Character AI could not generate a response'
            }
        }

        const aiContent = completion.choices[0].message?.content?.trim()

        if (!aiContent) {
            return {
                success: false,
                error: 'Character AI generated empty response'
            }
        }

        // Parse the structured JSON response
        const parsedResponse = JSON.parse(aiContent) as StructuredCharacterResponse

        if (!parsedResponse.message || !parsedResponse.action) {
            return {
                success: false,
                error: 'Character AI response missing required fields'
            }
        }

        return {
            success: true,
            characterResponse: parsedResponse
        }

    } catch (error) {
        console.error('Character AI error:', error)
        return {
            success: false,
            error: 'Character AI could not process the request'
        }
    }
}

/**
 * Call Timeline AI to evaluate historical impact (Phase 4)
 * Analyzes character actions for progress toward objective
 * 
 * @param diceRoll - The dice roll value (1-20)
 * @param diceOutcome - The dice outcome category
 * @param characterResponse - The structured character response
 * @param userMessage - The original user message
 * @param currentObjective - The current game objective
 * @returns Promise<TimelineAIResponse> - Timeline impact analysis
 */
export async function callTimelineAI(
    diceRoll: number,
    diceOutcome: string,
    characterResponse: StructuredCharacterResponse,
    userMessage: string,
    currentObjective: string = "Prevent World War I"
): Promise<TimelineAIResponse> {
    try {
        const client = getOpenAIClient()

        const timelinePrompt = buildTimelineEvaluationPrompt(
            diceRoll,
            diceOutcome,
            characterResponse,
            userMessage,
            currentObjective
        )

        const completion = await client.chat.completions.create({
            model: 'gpt-4.1',
            messages: [
                { role: 'system', content: timelinePrompt }
            ],
            temperature: 0.7,
            max_tokens: 250,
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'timeline_analysis',
                    schema: {
                        type: 'object',
                        properties: {
                            timelineImpact: {
                                type: 'string',
                                description: 'Narrative explanation of how the character action affects the timeline'
                            },
                            progressChange: {
                                type: 'number',
                                description: 'Progress change toward objective (-50 to +50)'
                            }
                        },
                        required: ['timelineImpact', 'progressChange'],
                        additionalProperties: false
                    }
                }
            }
        })

        if (!completion.choices || completion.choices.length === 0) {
            return {
                success: false,
                error: 'Timeline AI could not generate analysis'
            }
        }

        const aiContent = completion.choices[0].message?.content?.trim()

        if (!aiContent) {
            return {
                success: false,
                error: 'Timeline AI generated empty response'
            }
        }

        const parsedResponse = JSON.parse(aiContent)

        if (typeof parsedResponse.timelineImpact !== 'string' || typeof parsedResponse.progressChange !== 'number') {
            return {
                success: false,
                error: 'Timeline AI response missing required fields'
            }
        }

        return {
            success: true,
            timelineImpact: parsedResponse.timelineImpact,
            progressChange: parsedResponse.progressChange
        }

    } catch (error) {
        console.error('Timeline AI error:', error)
        return {
            success: false,
            error: 'Timeline AI could not process the request'
        }
    }
}
