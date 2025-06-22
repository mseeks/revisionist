/**
 * Playwright Configuration for End-to-End Testing
 * Integrates with Nuxt 3 for full-stack testing
 */
import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import type { ConfigOptions } from '@nuxt/test-utils/playwright'

export default defineConfig<ConfigOptions>({
  // Test directory configuration
  testDir: './tests/e2e',

  // Run tests sequentially to avoid file handle exhaustion
  fullyParallel: false,

  // Prevent use of test.only in CI
  forbidOnly: !!process.env.CI,

  // Retry configuration for CI stability
  retries: process.env.CI ? 2 : 0,

  // Worker configuration - limit workers to prevent file handle exhaustion
  workers: process.env.CI ? 1 : 2,

  // HTML report generation
  reporter: 'html',

  // Global test configuration
  use: {
    // Nuxt integration settings
    nuxt: {
      rootDir: fileURLToPath(new URL('.', import.meta.url))
    },

    // Base URL for tests
    baseURL: 'http://127.0.0.1:3000',

    // Enable tracing for debugging failed tests
    trace: 'on-first-retry',
  },

  // Browser projects - reduced for stability
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Development server configuration
  webServer: {
    command: 'npm run build && npm run preview',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
})
