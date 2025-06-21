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

test('Game Title Section - User sees main title', async ({ page, goto }) => {
  // Given a user is on the game page
  await goto('/', { waitUntil: 'hydration' })

  // When the page loads
  // Then they should see "Revisionist" as the main title
  const mainTitle = page.locator('h1')
  await expect(mainTitle).toBeVisible()
  await expect(mainTitle).toHaveText('Revisionist')

  // And it should be styled appropriately
  await expect(mainTitle).toHaveClass(/text-4xl/)
  await expect(mainTitle).toHaveClass(/font-bold/)
  await expect(mainTitle).toHaveClass(/text-center/)
})

test('Objective Display - User sees game objective prominently', async ({ page, goto }) => {
  // Given a user is on the game page
  await goto('/', { waitUntil: 'hydration' })

  // When they look for the objective
  // Then they should see "Prevent World War I" prominently displayed
  const objectiveDisplay = page.locator('[data-testid="objective-display"]')
  await expect(objectiveDisplay).toBeVisible()
  await expect(objectiveDisplay).toContainText('Prevent World War I')

  // And it should be styled as a prominent card/panel
  await expect(objectiveDisplay).toHaveClass(/card|panel|border|shadow/)
})

test('Message Input - User can type message with character counter', async ({ page, goto }) => {
  // Given a user wants to send a message
  await goto('/', { waitUntil: 'hydration' })

  // When they type in the message input
  const messageInput = page.locator('[data-testid="message-input"]')
  await expect(messageInput).toBeVisible()

  const textarea = messageInput.locator('textarea')
  await expect(textarea).toBeVisible()

  // Type a test message
  await textarea.fill('Hello, this is a test message')

  // Then they should see a real-time character counter
  const characterCounter = page.locator('[data-testid="character-counter"]')
  await expect(characterCounter).toBeVisible()
  await expect(characterCounter).toContainText('131') // 160 - 29 = 131 remaining

  // And the input should stop accepting text at 160 characters
  const longText = 'a'.repeat(200)
  await textarea.fill(longText)

  const textareaValue = await textarea.inputValue()
  expect(textareaValue.length).toBeLessThanOrEqual(160)
})

test('Send Button - User can find and access send button', async ({ page, goto }) => {
  // Given a user has typed a message
  await goto('/', { waitUntil: 'hydration' })

  const messageInput = page.locator('[data-testid="message-input"] textarea')
  await messageInput.fill('Test message')

  // When they look for how to send it
  // Then they should see a clearly labeled Send button
  const sendButton = page.locator('[data-testid="send-button"]')
  await expect(sendButton).toBeVisible()
  await expect(sendButton).toContainText('Send')

  // And the button should be keyboard accessible
  await expect(sendButton).toHaveAttribute('type', 'button')
  await expect(sendButton).toHaveAttribute('aria-label')

  // Button should be focusable with keyboard
  await sendButton.focus()
  await expect(sendButton).toBeFocused()
})

test('Message History - User sees empty message history area', async ({ page, goto }) => {
  // Given a user is on the game page
  await goto('/', { waitUntil: 'hydration' })

  // When they look for message history
  // Then they should see an empty message history area
  const messageHistory = page.locator('[data-testid="message-history"]')
  await expect(messageHistory).toBeVisible()

  // And it should be ready to display future messages
  await expect(messageHistory).toHaveAttribute('aria-label', 'Message history')
  await expect(messageHistory).toHaveAttribute('role', 'log')

  // And it should show empty state
  const emptyState = page.locator('[data-testid="empty-state"]')
  await expect(emptyState).toBeVisible()
  await expect(emptyState).toContainText('No messages yet')

  // And the container should be scrollable
  await expect(messageHistory).toHaveClass(/overflow-y-auto/)
})
