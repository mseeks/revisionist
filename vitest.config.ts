import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    include: [
      '**/*.nuxt.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      'tests/e2e/**'
    ],
    coverage: {
      include: ['components/**', 'pages/**', 'composables/**', 'utils/**'],
      exclude: ['tests/**', '**/*.spec.{js,ts}', '**/*.test.{js,ts}']
    }
  }
})
