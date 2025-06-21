/**
 * Vitest Configuration for Unit Testing
 * Integrates with Nuxt 3 test utilities for component testing
 */
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    // Include patterns for test files
    include: [
      '**/*.nuxt.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    // Exclude E2E tests from unit test runs
    exclude: [
      'tests/e2e/**'
    ],
    // Coverage configuration
    coverage: {
      include: ['components/**', 'pages/**', 'composables/**', 'utils/**'],
      exclude: ['tests/**', '**/*.spec.{js,ts}', '**/*.test.{js,ts}']
    }
  }
})
