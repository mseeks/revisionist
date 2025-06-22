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

    it('should show 160 characters remaining when empty', () => {
        const wrapper = mount(MessageInput)
        const counter = wrapper.find('[data-testid="character-counter"]')
        expect(counter.text()).toContain('160')
    })

    it('should show 0 characters remaining when at limit', async () => {
        const wrapper = mount(MessageInput)
        const textarea = wrapper.find('textarea')
        const counter = wrapper.find('[data-testid="character-counter"]')

        const maxText = 'a'.repeat(160)
        await textarea.setValue(maxText)
        expect(counter.text()).toContain('0')
    })

    describe('Validation', () => {
        it('should prevent empty message submission', () => {
            const wrapper = mount(MessageInput)

            // Should have validation method
            expect(wrapper.vm.isValid).toBeDefined()

            // Empty message should be invalid
            expect(wrapper.vm.isValid).toBe(false)

            // Should provide validation errors
            expect(wrapper.vm.validationErrors).toContain('Message cannot be empty')
        })

        it('should enforce 160 character limit via truncation', async () => {
            const wrapper = mount(MessageInput)
            const textarea = wrapper.find('textarea')

            // Set message over 160 characters
            const longMessage = 'a'.repeat(161)
            await textarea.setValue(longMessage)

            // Should be truncated to 160 characters and still be valid (not empty)
            expect(wrapper.vm.message.length).toBe(160)
            expect(wrapper.vm.isValid).toBe(true)
            expect(wrapper.vm.validationErrors).toHaveLength(0)
        })

        it('should be valid with proper message length', async () => {
            const wrapper = mount(MessageInput)
            const textarea = wrapper.find('textarea')

            // Set valid message
            await textarea.setValue('Hello, Napoleon!')

            // Should be valid
            expect(wrapper.vm.isValid).toBe(true)
            expect(wrapper.vm.validationErrors).toHaveLength(0)
        })

        it('should trim whitespace for validation', async () => {
            const wrapper = mount(MessageInput)
            const textarea = wrapper.find('textarea')

            // Set message with only whitespace
            await textarea.setValue('   \n\t   ')

            // Should be invalid (empty after trim)
            expect(wrapper.vm.isValid).toBe(false)
            expect(wrapper.vm.validationErrors).toContain('Message cannot be empty')
        })

        it('should expose message value for parent components', async () => {
            const wrapper = mount(MessageInput)
            const textarea = wrapper.find('textarea')

            await textarea.setValue('Test message')

            // Should provide access to message value
            expect(wrapper.vm.message).toBe('Test message')
        })
    })
})
