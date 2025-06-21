import { test, expect } from '@nuxt/test-utils/playwright'

test('BDD Setup - Game interface structure', async ({ page, goto }) => {
  // Given a user visits the game page
  await goto('/', { waitUntil: 'hydration' })

  // When the page loads
  // Then they should see the complete game interface
  await expect(page.locator('h1')).toContainText('Revisionist')
  await expect(page.locator('[data-testid="objective-display"]')).toBeVisible()
  await expect(page.locator('[data-testid="message-input"]')).toBeVisible()
  await expect(page.locator('[data-testid="send-button"]')).toBeVisible()
  await expect(page.locator('[data-testid="message-history"]')).toBeVisible()
  await expect(page.locator('[data-testid="messages-counter"]')).toBeVisible()
})
