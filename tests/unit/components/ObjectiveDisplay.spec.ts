import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ObjectiveDisplay from '~/components/ObjectiveDisplay.vue'

describe('ObjectiveDisplay', () => {
    it('should render hardcoded objective text', () => {
        const wrapper = mount(ObjectiveDisplay)
        expect(wrapper.text()).toContain('Prevent World War I')
    })

    it('should display "Prevent World War I"', () => {
        const wrapper = mount(ObjectiveDisplay)
        expect(wrapper.text()).toBe('Prevent World War I')
    })

    it('should style as prominent card/panel', () => {
        const wrapper = mount(ObjectiveDisplay)
        // Check for card-like classes or structure
        expect(wrapper.classes()).toContain('card')
        expect(wrapper.classes()).toContain('bg-blue-50')
        expect(wrapper.classes()).toContain('border')
        expect(wrapper.classes()).toContain('rounded-lg')
    })

    it('should have proper accessibility attributes', () => {
        const wrapper = mount(ObjectiveDisplay)
        const heading = wrapper.find('h2')
        expect(heading.exists()).toBe(true)
        expect(heading.text()).toBe('Prevent World War I')
    })

    it('should have proper test id for E2E testing', () => {
        const wrapper = mount(ObjectiveDisplay)
        expect(wrapper.attributes('data-testid')).toBe('objective-display')
    })
})
