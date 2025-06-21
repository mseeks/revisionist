import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import type { Component } from 'vue'
import type { MockedFunction } from 'vitest'

/**
 * Test helper for mounting Vue components with common configuration
 */
export function mountComponent(component: Component, options: any = {}) {
  return mount(component, {
    global: {
      plugins: [],
      ...options.global
    },
    ...options
  })
}

/**
 * Helper to create mock functions for testing
 */
export function createMock<T extends (...args: any[]) => any>(
  implementation?: T
): MockedFunction<T> {
  return vi.fn(implementation) as MockedFunction<T>
}
