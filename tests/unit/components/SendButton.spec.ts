import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import SendButton from '../../../components/SendButton.vue'
import { useGameStore } from '../../../stores/game'

describe('SendButton', () => {
    let gameStore: ReturnType<typeof useGameStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        gameStore = useGameStore()
    })

    it('should render button element', () => {
        const wrapper = mount(SendButton)
        const button = wrapper.find('button')
        expect(button.exists()).toBe(true)
    })

    it('should display "Send" text', () => {
        const wrapper = mount(SendButton)
        expect(wrapper.text()).toContain('Send')
    })

    it('should have button type', () => {
        const wrapper = mount(SendButton)
        const button = wrapper.find('button')
        expect(button.attributes('type')).toBe('button')
    })

    it('should be accessible (proper aria attributes)', () => {
        const wrapper = mount(SendButton)
        const button = wrapper.find('button')
        expect(button.attributes('aria-label')).toBeDefined()
        expect(button.attributes('role')).toBe('button'
        )
    })

    it('should be keyboard focusable', () => {
        const wrapper = mount(SendButton)
        const button = wrapper.find('button')
        expect(button.attributes('tabindex')).not.toBe('-1')
    })

    it('should emit click event when clicked', async () => {
        const wrapper = mount(SendButton)
        const button = wrapper.find('button')

        await button.trigger('click')
        expect(wrapper.emitted().click).toBeTruthy()
    })

    describe('Game Store Integration', () => {
        it('should be disabled when no messages remaining', () => {
            // Set remaining messages to 0
            gameStore.remainingMessages = 0

            const wrapper = mount(SendButton)
            const button = wrapper.find('button')

            // Button should be disabled
            expect(button.attributes('disabled')).toBeDefined()
        })

        it('should be enabled when messages remaining', () => {
            // Ensure messages remaining (default is 5)
            expect(gameStore.remainingMessages).toBeGreaterThan(0)

            const wrapper = mount(SendButton)
            const button = wrapper.find('button')

            // Button should not be disabled
            expect(button.attributes('disabled')).toBeUndefined()
        })

        it('should be disabled when input is invalid', () => {
            // Mock invalid input state
            const wrapper = mount(SendButton, {
                props: {
                    inputValid: false
                }
            })
            const button = wrapper.find('button')

            // Button should be disabled
            expect(button.attributes('disabled')).toBeDefined()
        })

        it('should be enabled when input is valid', () => {
            // Mock valid input state
            const wrapper = mount(SendButton, {
                props: {
                    inputValid: true
                }
            })
            const button = wrapper.find('button')

            // Button should not be disabled
            expect(button.attributes('disabled')).toBeUndefined()
        })

        it('should be disabled when both conditions are invalid', () => {
            // Set no messages remaining
            gameStore.remainingMessages = 0

            const wrapper = mount(SendButton, {
                props: {
                    inputValid: false
                }
            })
            const button = wrapper.find('button')

            // Button should be disabled
            expect(button.attributes('disabled')).toBeDefined()
        })
    })

    describe('Loading State', () => {
        it('should be disabled when game store is loading', () => {
            gameStore.setLoading(true)
            const wrapper = mount(SendButton)
            const button = wrapper.find('button')

            expect(button.attributes('disabled')).toBeDefined()
        })

        it('should not emit click event when disabled due to loading', async () => {
            gameStore.setLoading(true)
            const wrapper = mount(SendButton)
            const button = wrapper.find('button')

            await button.trigger('click')
            expect(wrapper.emitted().click).toBeFalsy()
        })

        it('should be enabled when loading is false and other conditions are met', () => {
            gameStore.setLoading(false)
            gameStore.remainingMessages = 3
            const wrapper = mount(SendButton, {
                props: { inputValid: true }
            })
            const button = wrapper.find('button')

            expect(button.attributes('disabled')).toBeUndefined()
        })
    })
})
