import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import MessageHistory from '../../../components/MessageHistory.vue'
import { useGameStore } from '../../../stores/game'

describe('MessageHistory', () => {
    let gameStore: ReturnType<typeof useGameStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        gameStore = useGameStore()
    })

    it('should render scrollable container', () => {
        const wrapper = mount(MessageHistory)
        const container = wrapper.find('[data-testid="message-history"]')
        expect(container.exists()).toBe(true)
        expect(container.classes()).toContain('overflow-y-auto')
    })

    it('should show empty state when no messages', () => {
        const wrapper = mount(MessageHistory)
        const emptyState = wrapper.find('[data-testid="empty-state"]')
        expect(emptyState.exists()).toBe(true)
        expect(emptyState.text()).toContain('No messages yet')
    })

    it('should have proper ARIA labels for accessibility', () => {
        const wrapper = mount(MessageHistory)
        const container = wrapper.find('[data-testid="message-history"]')
        expect(container.attributes('aria-label')).toBe('Message history')
        expect(container.attributes('role')).toBe('log')
    })

    it('should connect to game store properly', () => {
        const wrapper = mount(MessageHistory)
        // Component should mount without error and use the store
        expect(() => wrapper.vm).not.toThrow()
        // Should access store messageHistory which starts empty
        expect(gameStore.messageHistory).toEqual([])
    })

    it('should handle undefined messages prop gracefully', () => {
        const wrapper = mount(MessageHistory)
        expect(() => wrapper.vm).not.toThrow()
    })

    it('should have proper styling for empty state', () => {
        const wrapper = mount(MessageHistory)
        const emptyState = wrapper.find('[data-testid="empty-state"]')
        expect(emptyState.classes()).toContain('text-gray-500')
        expect(emptyState.classes()).toContain('flex')
        expect(emptyState.classes()).toContain('flex-col')

        const textCenter = emptyState.find('.text-center')
        expect(textCenter.exists()).toBe(true)
    })

    describe('Store Integration', () => {
        it('should display messages from store history', () => {
            // Add test messages to store
            gameStore.addUserMessage('Hello, Napoleon!')
            gameStore.addUserMessage('What are your plans for Europe?')

            const wrapper = mount(MessageHistory)

            // Should not show empty state
            const emptyState = wrapper.find('[data-testid="empty-state"]')
            expect(emptyState.exists()).toBe(false)

            // Should display messages from store
            const messages = wrapper.findAll('[data-testid="message-item"]')
            expect(messages).toHaveLength(2)
            expect(messages[0].text()).toContain('Hello, Napoleon!')
            expect(messages[1].text()).toContain('What are your plans for Europe?')
        })

        it('should show empty state when no messages in store', () => {
            // Store starts empty
            const wrapper = mount(MessageHistory)

            const emptyState = wrapper.find('[data-testid="empty-state"]')
            expect(emptyState.exists()).toBe(true)
            expect(emptyState.text()).toContain('No messages yet')
        })
    })
})
