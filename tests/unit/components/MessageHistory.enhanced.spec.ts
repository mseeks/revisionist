import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import MessageHistory from '../../../components/MessageHistory.vue'
import { useGameStore } from '../../../stores/game'
import type { Message } from '../../../stores/game'

const mockMessages: Message[] = [
    {
        text: "Your Highness, perhaps you should consider avoiding Sarajevo today...",
        sender: 'user',
        timestamp: new Date('2023-01-01T10:00:00Z')
    },
    {
        text: "How dare you suggest I alter my plans! I am the heir to the throne!",
        sender: 'ai',
        timestamp: new Date('2023-01-01T10:01:00Z'),
        diceRoll: 15,
        diceOutcome: 'Success',
        characterAction: 'Franz Ferdinand becomes intrigued by the warning and decides to investigate the source of the threat.',
        timelineImpact: 'Franz Ferdinand\'s heightened awareness leads to increased security measures. Progress toward preventing WWI: +15%',
        progressChange: 15
    },
    {
        text: "The security is compromised! You must stay away from the motorcade!",
        sender: 'user',
        timestamp: new Date('2023-01-01T10:02:00Z')
    },
    {
        text: "Your warnings grow tiresome. I shall proceed as planned.",
        sender: 'ai',
        timestamp: new Date('2023-01-01T10:03:00Z'),
        diceRoll: 3,
        diceOutcome: 'Failure',
        characterAction: 'Franz Ferdinand dismisses the warnings and proceeds with the original motorcade route.',
        timelineImpact: 'Franz Ferdinand\'s stubbornness makes him more vulnerable to assassination. Progress toward preventing WWI: -10%',
        progressChange: -10
    },
    {
        text: "Critical moment - redirect the driver now!",
        sender: 'user',
        timestamp: new Date('2023-01-01T10:04:00Z')
    },
    {
        text: "By God, you speak with such conviction... Driver, change course!",
        sender: 'ai',
        timestamp: new Date('2023-01-01T10:05:00Z'),
        diceRoll: 20,
        diceOutcome: 'Critical Success',
        characterAction: 'Franz Ferdinand immediately orders his driver to take an alternate route, avoiding the assassination plot entirely.',
        timelineImpact: 'Franz Ferdinand survives the assassination attempt completely! This creates a massive shift in the timeline. Progress toward preventing WWI: +35%',
        progressChange: 35
    }
]

describe('MessageHistory Enhanced Display', () => {
    let wrapper: any
    let gameStore: ReturnType<typeof useGameStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        gameStore = useGameStore()
        // Set the message history in the store
        gameStore.messageHistory = mockMessages
        wrapper = mount(MessageHistory)
    })

    describe('Dice Roll Display', () => {
        it('should show dice roll value (1-20) for AI messages with dice data', () => {
            const aiMessages = wrapper.findAll('[data-testid="ai-message"]')

            // Check first AI message with dice roll 15
            const firstAiMessage = aiMessages[0]
            expect(firstAiMessage.find('[data-testid="dice-result"]').text()).toContain('15')

            // Check second AI message with dice roll 3
            const secondAiMessage = aiMessages[1]
            expect(secondAiMessage.find('[data-testid="dice-result"]').text()).toContain('3')

            // Check third AI message with dice roll 20
            const thirdAiMessage = aiMessages[2]
            expect(thirdAiMessage.find('[data-testid="dice-result"]').text()).toContain('20')
        })

        it('should show dice outcome category for AI messages', () => {
            const aiMessages = wrapper.findAll('[data-testid="ai-message"]')

            expect(aiMessages[0].find('[data-testid="dice-outcome"]').text()).toContain('Success')
            expect(aiMessages[1].find('[data-testid="dice-outcome"]').text()).toContain('Failure')
            expect(aiMessages[2].find('[data-testid="dice-outcome"]').text()).toContain('Critical Success')
        })

        it('should not show dice data for user messages', () => {
            const userMessages = wrapper.findAll('[data-testid="user-message"]')

            userMessages.forEach((userMessage: any) => {
                expect(userMessage.find('[data-testid="dice-roll"]').exists()).toBe(false)
                expect(userMessage.find('[data-testid="dice-outcome"]').exists()).toBe(false)
            })
        })
    })

    describe('Character Message and Action Display', () => {
        it('should display character message and action separately for AI messages', () => {
            const aiMessages = wrapper.findAll('[data-testid="ai-message"]')

            // First AI message
            const firstMessage = aiMessages[0]
            expect(firstMessage.find('[data-testid="character-message"]').text()).toContain('How dare you suggest I alter my plans!')
            expect(firstMessage.find('[data-testid="character-action"]').text()).toContain('Franz Ferdinand becomes intrigued by the warning')

            // Second AI message  
            const secondMessage = aiMessages[1]
            expect(secondMessage.find('[data-testid="character-message"]').text()).toContain('Your warnings grow tiresome')
            expect(secondMessage.find('[data-testid="character-action"]').text()).toContain('Franz Ferdinand dismisses the warnings')

            // Third AI message
            const thirdMessage = aiMessages[2]
            expect(thirdMessage.find('[data-testid="character-message"]').text()).toContain('By God, you speak with such conviction')
            expect(thirdMessage.find('[data-testid="character-action"]').text()).toContain('Franz Ferdinand immediately orders his driver')
        })

        it('should display character action as consequence summary with clear visual distinction', () => {
            const aiMessages = wrapper.findAll('[data-testid="ai-message"]')

            aiMessages.forEach((message: any) => {
                const actionElement = message.find('[data-testid="character-action"]')
                expect(actionElement.exists()).toBe(true)
                // Should have different styling than the main message
                expect(actionElement.classes()).toContain('character-action')
            })
        })
    })

    describe('Timeline Impact Display', () => {
        it('should show timeline impact analysis for AI messages', () => {
            const aiMessages = wrapper.findAll('[data-testid="ai-message"]')

            expect(aiMessages[0].find('[data-testid="timeline-impact"]').text()).toContain('Franz Ferdinand\'s heightened awareness leads to increased security')
            expect(aiMessages[1].find('[data-testid="timeline-impact"]').text()).toContain('Franz Ferdinand\'s stubbornness makes him more vulnerable')
            expect(aiMessages[2].find('[data-testid="timeline-impact"]').text()).toContain('Franz Ferdinand survives the assassination attempt completely')
        })

        it('should show progress change with timeline impact', () => {
            const aiMessages = wrapper.findAll('[data-testid="ai-message"]')

            expect(aiMessages[0].find('[data-testid="progress-change"]').text()).toContain('+15%')
            expect(aiMessages[1].find('[data-testid="progress-change"]').text()).toContain('-10%')
            expect(aiMessages[2].find('[data-testid="progress-change"]').text()).toContain('+35%')
        })

        it('should not show timeline impact for user messages', () => {
            const userMessages = wrapper.findAll('[data-testid="user-message"]')

            userMessages.forEach((userMessage: any) => {
                expect(userMessage.find('[data-testid="timeline-impact"]').exists()).toBe(false)
                expect(userMessage.find('[data-testid="progress-change"]').exists()).toBe(false)
            })
        })
    })

    describe('Outcome-Based Styling', () => {
        it('should apply success styling for positive outcomes', () => {
            const aiMessages = wrapper.findAll('[data-testid="ai-message"]')

            // First message (Success) should have success styling
            expect(aiMessages[0].classes()).toContain('outcome-success')

            // Third message (Critical Success) should have critical-success styling
            expect(aiMessages[2].classes()).toContain('outcome-critical-success')
        })

        it('should apply failure styling for negative outcomes', () => {
            const aiMessages = wrapper.findAll('[data-testid="ai-message"]')

            // Second message (Failure) should have failure styling
            expect(aiMessages[1].classes()).toContain('outcome-failure')
        })

        it('should use red styling for critical failure outcomes', () => {
            // Test with a critical failure message
            const criticalFailureMessage: Message = {
                text: "I refuse to listen to such nonsense!",
                sender: 'ai',
                timestamp: new Date(),
                diceRoll: 1,
                diceOutcome: 'Critical Failure',
                characterAction: 'Franz Ferdinand storms off angrily',
                timelineImpact: 'Relations deteriorate further',
                progressChange: -25
            }

            // Create a new store with just the critical failure message
            const criticalGameStore = useGameStore()
            criticalGameStore.messageHistory = [criticalFailureMessage]

            const criticalWrapper = mount(MessageHistory)

            const aiMessage = criticalWrapper.find('[data-testid="ai-message"]')
            expect(aiMessage.classes()).toContain('outcome-critical-failure')
        })

        it('should use green styling for critical success outcomes', () => {
            const aiMessages = wrapper.findAll('[data-testid="ai-message"]')
            const criticalSuccessMessage = aiMessages[2] // dice roll 20

            expect(criticalSuccessMessage.classes()).toContain('outcome-critical-success')
        })
    })

    describe('Dice Icon and Animation', () => {
        it('should display dice icon for AI messages with dice data', () => {
            const aiMessages = wrapper.findAll('[data-testid="ai-message"]')

            aiMessages.forEach((message: any) => {
                expect(message.find('[data-testid="dice-icon"]').exists()).toBe(true)
            })
        })

        it('should not display dice icon for user messages', () => {
            const userMessages = wrapper.findAll('[data-testid="user-message"]')

            userMessages.forEach((message: any) => {
                expect(message.find('[data-testid="dice-icon"]').exists()).toBe(false)
            })
        })

        it('should show dice result after roll animation', () => {
            const aiMessages = wrapper.findAll('[data-testid="ai-message"]')

            aiMessages.forEach((message: any) => {
                const diceResult = message.find('[data-testid="dice-result"]')
                expect(diceResult.exists()).toBe(true)
                expect(diceResult.text()).toMatch(/\d{1,2}/) // Should contain 1-2 digit number
            })
        })
    })
})
