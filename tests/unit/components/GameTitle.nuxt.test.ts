import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GameTitle from '~/components/GameTitle.vue'

describe('GameTitle', () => {
  it('should render "Revisionist" title', () => {
    const wrapper = mount(GameTitle)
    expect(wrapper.text()).toContain('Revisionist')
  })

  it('should use appropriate heading level (h1)', () => {
    const wrapper = mount(GameTitle)
    const h1Element = wrapper.find('h1')
    expect(h1Element.exists()).toBe(true)
    expect(h1Element.text()).toBe('Revisionist')
  })

  it('should apply correct CSS classes', () => {
    const wrapper = mount(GameTitle)
    const h1Element = wrapper.find('h1')
    expect(h1Element.classes()).toContain('text-4xl')
    expect(h1Element.classes()).toContain('font-bold')
    expect(h1Element.classes()).toContain('text-center')
  })
})
