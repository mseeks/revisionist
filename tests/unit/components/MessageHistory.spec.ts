import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MessageHistory from '~/components/MessageHistory.vue'

describe('MessageHistory', () => {
    it('should render scrollable container', () => {
        const wrapper = mount(MessageHistory)
        const container = wrapper.find('[data-testid="message-history"]')
        expect(container.exists()).toBe(true)
        expect(container.classes()).toContain('overflow-y-auto')
    })

    it('should show empty state when no messages', () => {
        const wrapper = mount(MessageHistory, {
            props: {
                messages: []
            }
        })
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

    it('should accept messages array prop (empty for now)', () => {
        const wrapper = mount(MessageHistory, {
            props: {
                messages: []
            }
        })
        expect(wrapper.props('messages')).toEqual([])
    })

    it('should handle undefined messages prop gracefully', () => {
        const wrapper = mount(MessageHistory)
        expect(() => wrapper.vm).not.toThrow()
    })

    it('should have proper styling for empty state', () => {
        const wrapper = mount(MessageHistory, {
            props: {
                messages: []
            }
        })
        const emptyState = wrapper.find('[data-testid="empty-state"]')
        expect(emptyState.classes()).toContain('text-gray-500')
        expect(emptyState.classes()).toContain('flex')
        expect(emptyState.classes()).toContain('flex-col')

        const textCenter = emptyState.find('.text-center')
        expect(textCenter.exists()).toBe(true)
    })
})
