import { test, expect } from '@playwright/test'

test.describe('Rate Limiting Protection (E2E)', () => {
  test('should prevent spam clicking and show "Please wait..." message', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Revisionist')

    // Find the input and send button
    const messageInputContainer = page.locator('[data-testid="message-input"]')
    const messageTextarea = messageInputContainer.locator('textarea')
    const sendButton = page.locator('[data-testid="send-button"]')

    // Send first message
    await messageTextarea.fill('First message')
    await sendButton.click()

    // Wait for first message to complete
    await expect(sendButton).toContainText('Send', { timeout: 10000 })

    // Quickly try to send second message (this should trigger rate limiting)
    await messageTextarea.clear()
    await messageTextarea.fill('Second message too fast')
    await sendButton.click()

    // Should show "Please wait..." due to rate limiting
    await expect(sendButton).toContainText('Please wait...', { timeout: 2000 })

    // Button should be disabled during rate limiting
    await expect(sendButton).toBeDisabled()

    // Wait for rate limit to clear (1 second)
    await page.waitForTimeout(1200)

    // Button should return to normal state
    await expect(sendButton).toContainText('Send')
    await expect(sendButton).toBeEnabled()
  })

  test('should show rate limit error when trying to send too quickly', async ({ page }) => {
    await page.goto('/')

    const messageInputContainer = page.locator('[data-testid="message-input"]')
    const messageTextarea = messageInputContainer.locator('textarea')
    const sendButton = page.locator('[data-testid="send-button"]')
    const errorAlert = page.locator('[data-testid="error-alert"]')

    // Send first message
    await messageTextarea.fill('First message')
    await sendButton.click()

    // Wait for sending to complete
    await expect(sendButton).toContainText('Please wait...', { timeout: 10000 })

    // Try to send second message immediately (this should trigger rate limiting)
    await messageTextarea.clear()
    await messageTextarea.fill('Second message too soon')
    
    // Wait for button to be enabled again
    await expect(sendButton).toContainText('Send', { timeout: 2000 })
    await sendButton.click()

    // Should show error message about rate limiting
    await expect(errorAlert).toContainText('Please wait before sending another message')
  })

  test('should allow sending after 1 second delay', async ({ page }) => {
    await page.goto('/')

    const messageInputContainer = page.locator('[data-testid="message-input"]')
    const messageTextarea = messageInputContainer.locator('textarea')
    const sendButton = page.locator('[data-testid="send-button"]')
    const messageHistory = page.locator('[data-testid="message-history"]')

    // Send first message
    await messageTextarea.fill('First message')
    await sendButton.click()

    // Wait for message to be sent and processed
    await expect(messageHistory.locator('[data-testid="message-item"]')).toHaveCount(2, { timeout: 10000 }) // User + AI response

    // Wait for rate limit to clear (1+ seconds)
    await page.waitForTimeout(1200)

    // Now should be able to send second message
    await messageTextarea.clear()
    await messageTextarea.fill('Second message after delay')
    
    // Button should be enabled
    await expect(sendButton).toContainText('Send')
    await expect(sendButton).toBeEnabled()
    
    await sendButton.click()

    // Should successfully send and get response
    await expect(messageHistory.locator('[data-testid="message-item"]')).toHaveCount(4, { timeout: 10000 }) // 2 user + 2 AI responses
  })
})
