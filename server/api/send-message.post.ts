export default defineEventHandler(async (event) => {
    // Only allow POST requests
    if (getMethod(event) !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        })
    }

    // Get request body
    const body = await readBody(event)

    // Validate message parameter
    if (!body || !body.message) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request: message parameter is required'
        })
    }

    // Extract message and optional conversation history
    const { message, conversationHistory = [] } = body

    try {
        // Import dual-layer AI system and dice utility
        const { callCharacterAI, callTimelineAI } = await import('~/server/utils/openai')
        const { rollD20 } = await import('~/utils/dice')

        // Step 1: Roll dice to determine outcome
        const diceResult = rollD20()

        // Step 2: Get structured character response based on dice outcome
        const characterResponse = await callCharacterAI(message, conversationHistory, diceResult.outcome)

        if (!characterResponse.success || !characterResponse.characterResponse) {
            return {
                success: false,
                message: 'Failed to generate character response',
                data: {
                    userMessage: body.message,
                    error: characterResponse.error || 'Character AI failed'
                }
            }
        }

        // Validate and enforce 160-character limit on AI message response
        if (characterResponse.characterResponse.message && characterResponse.characterResponse.message.length > 160) {
            console.warn(`AI response exceeded 160 characters (${characterResponse.characterResponse.message.length}), truncating...`)
            characterResponse.characterResponse.message = characterResponse.characterResponse.message.substring(0, 157) + '...'
        }

        // Step 3: Evaluate timeline impact based on character's action
        const timelineResponse = await callTimelineAI(
            diceResult.roll,
            diceResult.outcome,
            characterResponse.characterResponse,
            message,
            "Prevent World War I" // TODO: Get from game state in future
        )

        if (!timelineResponse.success) {
            return {
                success: false,
                message: 'Failed to generate timeline analysis',
                data: {
                    userMessage: body.message,
                    diceRoll: diceResult.roll,
                    diceOutcome: diceResult.outcome,
                    characterResponse: characterResponse.characterResponse,
                    error: timelineResponse.error || 'Timeline AI failed'
                }
            }
        }

        // Return comprehensive dual-layer response
        return {
            success: true,
            message: 'Dual-layer AI response generated successfully',
            data: {
                userMessage: body.message,
                diceRoll: diceResult.roll,
                diceOutcome: diceResult.outcome,
                characterResponse: characterResponse.characterResponse,
                timelineAnalysis: {
                    impact: timelineResponse.timelineImpact,
                    progressChange: timelineResponse.progressChange
                },
                error: null
            }
        }
    } catch (error) {
        console.error('API endpoint error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error: ' + (error as Error).message
        })
    }
})
