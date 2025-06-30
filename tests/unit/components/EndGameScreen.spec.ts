import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import EndGameScreen from '../../../components/EndGameScreen.vue'
import { useGameStore } from '../../../stores/game'
import type { GameObjective } from '../../../server/utils/objective-generator'

describe('EndGameScreen', () => {
    let gameStore: ReturnType<typeof useGameStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        gameStore = useGameStore()
    })

    describe('Victory Display', () => {
        beforeEach(() => {
            // Set up victory state
            gameStore.gameStatus = 'victory'
            gameStore.objectiveProgress = 100
            gameStore.currentObjective = {
                title: 'Prevent World War I',
                successCriteria: 'Major European conflict avoided',
                historicalContext: 'Europe in 1914 was a powder keg',
                targetProgress: 100,
                difficulty: 'medium'
            } as GameObjective
            gameStore.remainingMessages = 2
        })

        it('should display victory message', () => {
            const wrapper = mount(EndGameScreen)
            const victoryMessage = wrapper.find('[data-testid="victory-message"]')
            expect(victoryMessage.exists()).toBe(true)
            expect(victoryMessage.text()).toContain('Victory')
        })

        it('should show final progress percentage', () => {
            const wrapper = mount(EndGameScreen)
            const progressDisplay = wrapper.find('[data-testid="final-progress"]')
            expect(progressDisplay.exists()).toBe(true)
            expect(progressDisplay.text()).toContain('100%')
        })

        it('should display objective title', () => {
            const wrapper = mount(EndGameScreen)
            const objectiveDisplay = wrapper.find('[data-testid="objective-title"]')
            expect(objectiveDisplay.exists()).toBe(true)
            expect(objectiveDisplay.text()).toContain('Prevent World War I')
        })

        it('should show messages saved for early victory', () => {
            const wrapper = mount(EndGameScreen)
            const efficiencyDisplay = wrapper.find('[data-testid="efficiency-display"]')
            expect(efficiencyDisplay.exists()).toBe(true)
            expect(efficiencyDisplay.text()).toContain('2 messages saved')
        })
    })

    describe('Defeat Display', () => {
        beforeEach(() => {
            // Set up defeat state
            gameStore.gameStatus = 'defeat'
            gameStore.objectiveProgress = 45
            gameStore.currentObjective = {
                title: 'Prevent World War I',
                successCriteria: 'Major European conflict avoided',
                historicalContext: 'Europe in 1914 was a powder keg',
                targetProgress: 100,
                difficulty: 'medium'
            } as GameObjective
            gameStore.remainingMessages = 0
        })

        it('should display defeat message', () => {
            const wrapper = mount(EndGameScreen)
            const defeatMessage = wrapper.find('[data-testid="defeat-message"]')
            expect(defeatMessage.exists()).toBe(true)
            expect(defeatMessage.text()).toContain('Defeat')
        })

        it('should show final progress percentage below 100%', () => {
            const wrapper = mount(EndGameScreen)
            const progressDisplay = wrapper.find('[data-testid="final-progress"]')
            expect(progressDisplay.exists()).toBe(true)
            expect(progressDisplay.text()).toContain('45%')
        })

        it('should explain what went wrong', () => {
            const wrapper = mount(EndGameScreen)
            const explanationDisplay = wrapper.find('[data-testid="defeat-explanation"]')
            expect(explanationDisplay.exists()).toBe(true)
            expect(explanationDisplay.text()).toContain('objective was not achieved')
        })
    })

    describe('Game Summary', () => {
        beforeEach(() => {
            gameStore.gameStatus = 'victory'
            gameStore.remainingMessages = 3 // 2 messages were used (5 - 3 = 2)
            gameStore.messageHistory = [
                {
                    text: 'Test message 1',
                    sender: 'user',
                    timestamp: new Date(),
                    diceRoll: 18,
                    diceOutcome: 'Success',
                    progressChange: 25
                },
                {
                    text: 'AI response 1',
                    sender: 'ai',
                    timestamp: new Date()
                },
                {
                    text: 'Test message 2',
                    sender: 'user',
                    timestamp: new Date(),
                    diceRoll: 20,
                    diceOutcome: 'Critical Success',
                    progressChange: 75
                },
                {
                    text: 'AI response 2',
                    sender: 'ai',
                    timestamp: new Date()
                }
            ]
        })

        it('should summarize key moments', () => {
            const wrapper = mount(EndGameScreen)
            const summaryDisplay = wrapper.find('[data-testid="game-summary"]')
            expect(summaryDisplay.exists()).toBe(true)
        })

        it('should highlight best roll', () => {
            const wrapper = mount(EndGameScreen)
            const bestRoll = wrapper.find('[data-testid="best-roll"]')
            expect(bestRoll.exists()).toBe(true)
            expect(bestRoll.text()).toContain('20')
        })

        it('should highlight worst roll', () => {
            gameStore.messageHistory[0].diceRoll = 2
            gameStore.messageHistory[0].diceOutcome = 'Critical Failure'

            const wrapper = mount(EndGameScreen)
            const worstRoll = wrapper.find('[data-testid="worst-roll"]')
            expect(worstRoll.exists()).toBe(true)
            expect(worstRoll.text()).toContain('2')
        })

        it('should show message efficiency', () => {
            const wrapper = mount(EndGameScreen)
            const efficiency = wrapper.find('[data-testid="message-efficiency"]')
            expect(efficiency.exists()).toBe(true)
            expect(efficiency.text()).toContain('2')
            expect(efficiency.text()).toContain('Messages Used')
        })
    })

    describe('Play Again Feature', () => {
        beforeEach(() => {
            gameStore.gameStatus = 'victory'
        })

        it('should offer "Play Again" option', () => {
            const wrapper = mount(EndGameScreen)
            const playAgainButton = wrapper.find('[data-testid="play-again-button"]')
            expect(playAgainButton.exists()).toBe(true)
            expect(playAgainButton.text()).toContain('Play Again')
        })

        it('should reset game when play again is clicked', async () => {
            const wrapper = mount(EndGameScreen)
            const playAgainButton = wrapper.find('[data-testid="play-again-button"]')

            await playAgainButton.trigger('click')

            expect(gameStore.gameStatus).toBe('playing')
            expect(gameStore.remainingMessages).toBe(5)
            expect(gameStore.messageHistory).toEqual([])
            expect(gameStore.objectiveProgress).toBe(0)
        })
    })

    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            gameStore.gameStatus = 'victory'
            const wrapper = mount(EndGameScreen)

            const endScreen = wrapper.find('[data-testid="end-game-screen"]')
            expect(endScreen.attributes('role')).toBe('dialog')
            expect(endScreen.attributes('aria-labelledby')).toBeTruthy()
        })

        it('should have proper heading structure', () => {
            gameStore.gameStatus = 'victory'
            const wrapper = mount(EndGameScreen)

            const mainHeading = wrapper.find('h1, h2')
            expect(mainHeading.exists()).toBe(true)
        })
    })

    describe('Edge Cases', () => {
        it('should handle missing objective gracefully', () => {
            gameStore.gameStatus = 'victory'
            gameStore.currentObjective = null

            expect(() => mount(EndGameScreen)).not.toThrow()
        })

        it('should handle empty message history', () => {
            gameStore.gameStatus = 'defeat'
            gameStore.messageHistory = []

            expect(() => mount(EndGameScreen)).not.toThrow()
        })

        it('should not display when game is still playing', () => {
            gameStore.gameStatus = 'playing'

            const wrapper = mount(EndGameScreen)
            const endScreen = wrapper.find('[data-testid="end-game-screen"]')
            expect(endScreen.exists()).toBe(false)
        })
    })
})
