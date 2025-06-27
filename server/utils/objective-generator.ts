import { getOpenAIClient } from './openai'

/**
 * Interface for game objectives
 */
export interface GameObjective {
    title: string
    successCriteria: string
    historicalContext: string
    targetProgress: number
    difficulty: 'easy' | 'medium' | 'hard'
}

/**
 * Generates a unique historical objective for the game
 * For POC: Returns consistent "Prevent World War I" objective for testing
 * Future: Will use AI to generate diverse historical scenarios
 */
export async function generateObjective(): Promise<GameObjective> {
    try {
        // For POC: Return consistent objective for testing
        // In production, this would use AI to generate diverse objectives
        return await generatePOCObjective()
    } catch (error) {
        console.error('Error generating objective:', error)
        throw new Error('Failed to generate objective')
    }
}

/**
 * Generates the POC objective: "Prevent World War I"
 * Used for consistent testing during development
 */
async function generatePOCObjective(): Promise<GameObjective> {
    return {
        title: 'Prevent World War I',
        successCriteria: 'Successfully prevent the outbreak of World War I through strategic interventions with key historical figures. Achieve diplomatic solutions, reduce tensions, or eliminate trigger events that led to global conflict.',
        historicalContext: 'World War I began in 1914 following the assassination of Archduke Franz Ferdinand in Sarajevo. A complex web of alliances, nationalism, and imperial competition created a powder keg that exploded into global warfare. Key figures include Franz Ferdinand, Kaiser Wilhelm II, Tsar Nicholas II, and other European leaders whose decisions shaped this tragic period.',
        targetProgress: 100,
        difficulty: 'medium'
    }
}

/**
 * Future: AI-powered objective generation for diverse historical scenarios
 * This would be implemented in Phase 5 for production use
 */
async function generateAIObjective(): Promise<GameObjective> {
    const client = getOpenAIClient()

    const prompt = `Generate a unique historical objective for a strategic text-based game where players send messages to historical figures to alter history.

Requirements:
- Create a specific, achievable goal (prevent/cause event, accelerate progress, etc.)
- Include clear success criteria
- Provide historical context explaining the significance
- Choose appropriate difficulty level (easy/medium/hard)
- Focus on scenarios requiring 3-5 strategic interventions

Return a JSON object with this structure:
{
  "title": "Brief objective title",
  "successCriteria": "Clear description of what constitutes success",
  "historicalContext": "Background explaining the historical significance",
  "difficulty": "easy|medium|hard"
}`

    const response = await client.chat.completions.create({
        model: 'gpt-4.1',
        messages: [
            {
                role: 'system',
                content: 'You are an expert historian and game designer creating engaging historical scenarios for educational gameplay.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.8,
        max_tokens: 500
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
        throw new Error('No objective generated')
    }

    try {
        const objective = JSON.parse(content)
        return {
            ...objective,
            targetProgress: 100
        }
    } catch (parseError) {
        console.error('Failed to parse AI objective:', parseError)
        throw new Error('Invalid objective format generated')
    }
}
