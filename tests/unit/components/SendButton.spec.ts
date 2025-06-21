import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SendButton from '~/components/SendButton.vue'

describe('SendButton', () => {
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
        expect(button.attributes('role')).toBe('button')
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
})
