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
        // Check the root div element for card-like classes
        const rootDiv = wrapper.find('div[data-testid="objective-display"]')
        expect(rootDiv.exists()).toBe(true)
        expect(rootDiv.classes()).toContain('card')
        expect(rootDiv.classes()).toContain('bg-blue-50')
        expect(rootDiv.classes()).toContain('border')
        expect(rootDiv.classes()).toContain('rounded-lg')
    })

    it('should have proper accessibility attributes', () => {
        const wrapper = mount(ObjectiveDisplay)
        const heading = wrapper.find('h2')
        expect(heading.exists()).toBe(true)
        expect(heading.text()).toBe('Prevent World War I')
    })

    it('should have proper test id for E2E testing', () => {
        const wrapper = mount(ObjectiveDisplay)
        const rootDiv = wrapper.find('div[data-testid="objective-display"]')
        expect(rootDiv.exists()).toBe(true)
        expect(rootDiv.attributes('data-testid')).toBe('objective-display')
    })
})
