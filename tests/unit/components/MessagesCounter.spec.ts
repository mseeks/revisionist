import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MessagesCounter from '~/components/MessagesCounter.vue'

describe('MessagesCounter', () => {
    it('should render counter display', () => {
        const wrapper = mount(MessagesCounter)
        expect(wrapper.find('[data-testid="messages-counter"]').exists()).toBe(true)
    })

    it('should show "Messages Remaining: 5" initially', () => {
        const wrapper = mount(MessagesCounter)
        expect(wrapper.text()).toContain('Messages Remaining: 5')
    })

    it('should accept remainingMessages prop', () => {
        const wrapper = mount(MessagesCounter, {
            props: {
                remainingMessages: 3
            }
        })
        expect(wrapper.props('remainingMessages')).toBe(3)
    })

    it('should update display when prop changes', async () => {
        const wrapper = mount(MessagesCounter, {
            props: {
                remainingMessages: 3
            }
        })

        expect(wrapper.text()).toContain('Messages Remaining: 3')

        await wrapper.setProps({ remainingMessages: 1 })
        expect(wrapper.text()).toContain('Messages Remaining: 1')
    })
})
