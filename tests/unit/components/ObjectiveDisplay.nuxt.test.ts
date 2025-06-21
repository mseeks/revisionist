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
  })
})
