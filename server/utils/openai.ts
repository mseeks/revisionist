import OpenAI from 'openai'

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
