import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MessageInput from '~/components/MessageInput.vue'

describe('MessageInput', () => {
    it('should render textarea element', () => {
        const wrapper = mount(MessageInput)
        const textarea = wrapper.find('textarea')
        expect(textarea.exists()).toBe(true)
    })

    it('should have 160 character limit attribute', () => {
        const wrapper = mount(MessageInput)
        const textarea = wrapper.find('textarea')
        expect(textarea.attributes('maxlength')).toBe('160')
    })

    it('should display character counter', () => {
        const wrapper = mount(MessageInput)
        const counter = wrapper.find('[data-testid="character-counter"]')
        expect(counter.exists()).toBe(true)
    })

    it('should update counter on input', async () => {
        const wrapper = mount(MessageInput)
        const textarea = wrapper.find('textarea')
        const counter = wrapper.find('[data-testid="character-counter"]')

        await textarea.setValue('Hello')
        expect(counter.text()).toContain('155') // 160 - 5 = 155 remaining
    })

    it('should show remaining characters correctly', async () => {
        const wrapper = mount(MessageInput)
        const textarea = wrapper.find('textarea')
        const counter = wrapper.find('[data-testid="character-counter"]')

        await textarea.setValue('Test message')
        expect(counter.text()).toContain('148') // 160 - 12 = 148 remaining
    })

    it('should prevent input beyond 160 characters', async () => {
        const wrapper = mount(MessageInput)
        const textarea = wrapper.find('textarea')

        const longText = 'a'.repeat(200) // 200 characters
        await textarea.setValue(longText)

        expect(textarea.element.value.length).toBeLessThanOrEqual(160)
    })
})
