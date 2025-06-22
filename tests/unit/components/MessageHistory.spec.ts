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

    describe('AI Message Display', () => {
        beforeEach(() => {
            // Clear any existing messages
            gameStore.resetGame()
        })

        it('should differentiate user vs AI messages', () => {
            // Add both user and AI messages
            gameStore.addUserMessage('Hello Franz Ferdinand!')
            gameStore.addAIMessage('Greetings! How may I assist you in preventing the Great War?')

            const wrapper = mount(MessageHistory)
            const messages = wrapper.findAll('[data-testid="message-item"]')

            expect(messages).toHaveLength(2)

            // Check user message styling
            const userMessage = messages[0]
            expect(userMessage.attributes('data-sender')).toBe('user')
            expect(userMessage.find('.bg-blue-50').exists()).toBe(true)
            expect(userMessage.find('.border-blue-400').exists()).toBe(true)

            // Check AI message styling  
            const aiMessage = messages[1]
            expect(aiMessage.attributes('data-sender')).toBe('ai')
            expect(aiMessage.find('.bg-green-50').exists()).toBe(true)
            expect(aiMessage.find('.border-green-400').exists()).toBe(true)
        })

        it('should show sender name (Franz Ferdinand) for AI messages', () => {
            gameStore.addAIMessage('I must avoid Sarajevo this June!')

            const wrapper = mount(MessageHistory)
            const aiMessage = wrapper.find('[data-sender="ai"]')

            expect(aiMessage.exists()).toBe(true)
            expect(aiMessage.text()).toContain('Franz Ferdinand:')
            expect(aiMessage.find('.text-green-800').text()).toBe('Franz Ferdinand:')
        })

        it('should display timestamp for AI messages', () => {
            const testTime = new Date('2023-06-28T10:30:00')

            // Manually create AI message with specific timestamp
            const aiMessage = {
                text: 'I shall change history!',
                sender: 'ai' as const,
                timestamp: testTime
            }
            gameStore.messageHistory.push(aiMessage)

            const wrapper = mount(MessageHistory)
            const messageElement = wrapper.find('[data-sender="ai"]')
            const timestamp = messageElement.find('[data-testid="message-timestamp"]')

            expect(timestamp.exists()).toBe(true)
            expect(timestamp.text()).toBe('10:30:00 AM')
        })

        it('should show user message with correct sender name', () => {
            gameStore.addUserMessage('Please avoid the assassination attempt!')

            const wrapper = mount(MessageHistory)
            const userMessage = wrapper.find('[data-sender="user"]')

            expect(userMessage.exists()).toBe(true)
            expect(userMessage.text()).toContain('You:')
            expect(userMessage.find('.text-blue-800').text()).toBe('You:')
        })

        it('should display messages in chronological order', () => {
            gameStore.addUserMessage('First message')
            gameStore.addAIMessage('AI response')
            gameStore.addUserMessage('Second message')

            const wrapper = mount(MessageHistory)
            const messages = wrapper.findAll('[data-testid="message-item"]')

            expect(messages).toHaveLength(3)
            expect(messages[0].text()).toContain('First message')
            expect(messages[1].text()).toContain('AI response')
            expect(messages[2].text()).toContain('Second message')
        })
    })
})
