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

    try {
        // Call OpenAI API with the user's message
        const { callOpenAI } = await import('~/server/utils/openai')
        const aiResponse = await callOpenAI(body.message)

        // Return structured response for frontend
        return {
            success: aiResponse.success,
            message: aiResponse.success ? 'AI response generated successfully' : 'Failed to generate AI response',
            data: {
                userMessage: body.message,
                aiResponse: aiResponse.aiResponse || null,
                error: aiResponse.error || null
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
