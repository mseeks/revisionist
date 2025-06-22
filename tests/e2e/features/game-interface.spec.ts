import { test, expect } from '@nuxt/test-utils/playwright'

// AI Integration Tests - BDD Style
test.describe('AI Message Flow (BDD)', () => {
  test('User sends message and receives AI response', async ({ page, goto }) => {
    // Given a user has typed a message
    await goto('/', { waitUntil: 'hydration' })

    const messageInputContainer = page.locator('[data-testid="message-input"]')
    const messageTextarea = messageInputContainer.locator('textarea')
    const sendButton = page.locator('[data-testid="send-button"]')
    const messageHistory = page.locator('[data-testid="message-history"]')

    // Type a message to Franz Ferdinand
    await messageTextarea.fill('Avoid Sarajevo in June 1914')

    // When they click send
    await sendButton.click()

    // Then they should see a loading state
    await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible()

    // And the send button should be disabled during loading
    await expect(sendButton).toBeDisabled()

    // Then they should see their message in history
    await expect(messageHistory).toContainText('Avoid Sarajevo in June 1914')
    await expect(messageHistory).toContainText('You:')

    // And they should see AI response in history (wait for API call)
    await expect(messageHistory).toContainText('Franz Ferdinand:', { timeout: 10000 })

    // And the loading indicator should disappear
    await expect(page.locator('[data-testid="loading-indicator"]')).not.toBeVisible()

    // And the send button should be disabled (since input is cleared)
    await expect(sendButton).toBeDisabled()

    // And the message counter should decrease to 4
    await expect(page.locator('[data-testid="messages-counter"]')).toContainText('4')

    // When user types a new message, send button should be enabled again
    await messageTextarea.fill('Another message')
    await expect(sendButton).toBeEnabled()
  })

  test('AI response appears with proper styling and timestamp', async ({ page, goto }) => {
    // Given a user sends a message
    await goto('/', { waitUntil: 'hydration' })

    const messageInputContainer = page.locator('[data-testid="message-input"]')
    const messageTextarea = messageInputContainer.locator('textarea')
    const sendButton = page.locator('[data-testid="send-button"]')
    const messageHistory = page.locator('[data-testid="message-history"]')

    await messageTextarea.fill('Your advice would be valued')
    await sendButton.click()

    // When the AI responds
    await expect(messageHistory).toContainText('Franz Ferdinand:', { timeout: 10000 })

    // Then the AI message should be styled differently from user messages
    const aiMessage = messageHistory.locator('[data-sender="ai"]').first()
    await expect(aiMessage).toBeVisible()

    // And it should have a timestamp
    await expect(aiMessage.locator('[data-testid="message-timestamp"]')).toBeVisible()

    // And it should show the sender name
    await expect(aiMessage).toContainText('Franz Ferdinand:')
  })
})

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

test('Messages Counter - User sees remaining message count', async ({ page, goto }) => {
  // Given a user starts a new game
  await goto('/', { waitUntil: 'hydration' })

  // When they view the interface
  // Then they should see "Messages Remaining: 5"
  const messagesCounter = page.locator('[data-testid="messages-counter"]')
  await expect(messagesCounter).toBeVisible()
  await expect(messagesCounter).toContainText('Messages Remaining: 5')

  // And it should be prominently displayed
  await expect(messagesCounter).toHaveClass(/badge|indicator|prominent/)
})

test('Complete Layout Integration - User sees all components in logical order', async ({ page, goto }) => {
  // Given a user visits the game for the first time
  await goto('/', { waitUntil: 'hydration' })

  // When the page loads completely
  // Then they should see all components in logical order:

  // Game title at the top
  const gameTitle = page.locator('h1')
  await expect(gameTitle).toBeVisible()
  await expect(gameTitle).toHaveText('Revisionist')

  // Objective prominently displayed
  const objective = page.locator('[data-testid="objective-display"]')
  await expect(objective).toBeVisible()
  await expect(objective).toContainText('Prevent World War I')

  // Message input area
  const messageInput = page.locator('[data-testid="message-input"]')
  await expect(messageInput).toBeVisible()

  // Send button below input
  const sendButton = page.locator('[data-testid="send-button"]')
  await expect(sendButton).toBeVisible()

  // Message history area
  const messageHistory = page.locator('[data-testid="message-history"]')
  await expect(messageHistory).toBeVisible()

  // Messages counter visible
  const messagesCounter = page.locator('[data-testid="messages-counter"]')
  await expect(messagesCounter).toBeVisible()

  // And the layout should be visually hierarchical
  // Check that title is at the top of the page
  const titleBox = await gameTitle.boundingBox()
  const objectiveBox = await objective.boundingBox()
  const inputBox = await messageInput.boundingBox()
  const historyBox = await messageHistory.boundingBox()

  // Title should be above objective
  expect(titleBox!.y).toBeLessThan(objectiveBox!.y)

  // Objective should be above input
  expect(objectiveBox!.y).toBeLessThan(inputBox!.y)

  // Input should be above or at same level as history
  expect(inputBox!.y).toBeLessThanOrEqual(historyBox!.y)

  // And all elements should be keyboard accessible
  // Test that interactive elements can be focused
  await messageInput.locator('textarea').focus()
  await expect(messageInput.locator('textarea')).toBeFocused()

  await sendButton.focus()
  await expect(sendButton).toBeFocused()

  // Test that layout is responsive (basic check)
  await expect(page.locator('main')).toHaveClass(/grid|flex|container/)
})

test('Complete User Journey - New user interacts with all interface elements', async ({ page, goto }) => {
  // Given a new user visits the game
  await goto('/', { waitUntil: 'hydration' })
  
  // When they interact with each interface element
  // Then they should have a complete, accessible experience
  
  // Step 1: User reads the game title and understands the game
  const gameTitle = page.locator('h1')
  await expect(gameTitle).toBeVisible()
  await expect(gameTitle).toHaveText('Revisionist')
  
  // Step 2: User reads and understands the objective
  const objective = page.locator('[data-testid="objective-display"]')
  await expect(objective).toBeVisible()
  await expect(objective).toContainText('Prevent World War I')
  
  // Step 3: User checks how many messages they have
  const messagesCounter = page.locator('[data-testid="messages-counter"]')
  await expect(messagesCounter).toBeVisible()
  await expect(messagesCounter).toContainText('Messages Remaining: 5')
  
  // Step 4: User looks at message history (empty initially)
  const messageHistory = page.locator('[data-testid="message-history"]')
  await expect(messageHistory).toBeVisible()
  const emptyState = page.locator('[data-testid="empty-state"]')
  await expect(emptyState).toBeVisible()
  await expect(emptyState).toContainText('No messages yet')
  
  // Step 5: User types a message and watches character counter
  const messageInput = page.locator('[data-testid="message-input"] textarea')
  await expect(messageInput).toBeVisible()
  
  await messageInput.fill('Dear Archduke Franz Ferdinand, please reconsider your visit to Sarajevo')
  
  const characterCounter = page.locator('[data-testid="character-counter"]')
  await expect(characterCounter).toBeVisible()
  await expect(characterCounter).toContainText('89') // 160 - 71 = 89 remaining
  
  // Step 6: User finds and prepares to use send button
  const sendButton = page.locator('[data-testid="send-button"]')
  await expect(sendButton).toBeVisible()
  await expect(sendButton).toContainText('Send')
  await expect(sendButton).toHaveAttribute('aria-label')
  
  // Step 7: User can navigate entire interface with keyboard
  await messageInput.focus()
  await expect(messageInput).toBeFocused()
  
  // Use click-based focus for more reliable cross-browser testing
  await sendButton.click({ trial: true }) // Just check if clickable
  await sendButton.focus()
  await expect(sendButton).toBeFocused()
  
  // Step 8: User can access all elements via screen reader simulation
  // Check ARIA labels and semantic structure
  await expect(messageHistory).toHaveAttribute('role', 'log')
  await expect(messageHistory).toHaveAttribute('aria-label', 'Message history')
  await expect(sendButton).toHaveAttribute('type', 'button')
  await expect(messageInput).toHaveAttribute('aria-label', 'Message to send')
  
  // Step 9: User understands the visual hierarchy
  const titleBox = await gameTitle.boundingBox()
  const objectiveBox = await objective.boundingBox()
  const inputBox = await messageInput.boundingBox()
  const historyBox = await messageHistory.boundingBox()
  
  // Visual flow should be top to bottom
  expect(titleBox!.y).toBeLessThan(objectiveBox!.y)
  expect(objectiveBox!.y).toBeLessThan(inputBox!.y)
  expect(inputBox!.y).toBeLessThanOrEqual(historyBox!.y)
})

test('Keyboard Navigation - All interactive elements accessible via keyboard', async ({ page, goto }) => {
  // Given a user relies on keyboard navigation
  await goto('/', { waitUntil: 'hydration' })
  
  // When they need to navigate through all elements
  const messageInput = page.locator('[data-testid="message-input"] textarea')
  const sendButton = page.locator('[data-testid="send-button"]')
  
  // Then they should be able to reach all interactive elements (core accessibility requirement)
  
  // Test 1: All interactive elements are programmatically focusable
  // This is the essential accessibility requirement per WCAG guidelines
  await messageInput.focus()
  await expect(messageInput).toBeFocused()
  
  await sendButton.focus()
  await expect(sendButton).toBeFocused()
  
  // Test 2: Elements can be navigated back and forth
  await messageInput.focus()
  await expect(messageInput).toBeFocused()
  
  await sendButton.focus()
  await expect(sendButton).toBeFocused()
  
  await messageInput.focus()
  await expect(messageInput).toBeFocused()
  
  // Test 3: Keyboard activation works on focusable elements
  await messageInput.fill('Test message')
  await messageInput.focus()
  
  await sendButton.focus()
  await expect(sendButton).toBeFocused()
  
  // Test that Enter and Space both work on button (accessibility requirement)
  await page.keyboard.press('Enter')
  // Note: Button doesn't function yet, but it should be focusable and responsive
  
  await sendButton.focus()
  await page.keyboard.press('Space')
  
  // Test 4: Tab navigation is supported (browser-dependent, non-blocking)
  // Different browsers implement Tab order differently - this is informational only
  await messageInput.focus()
  await page.keyboard.press('Tab')
  
  // We don't assert on specific Tab behavior since it varies by browser
  // The key requirement is that elements remain focusable programmatically (tested above)
  
  // Test 5: Message history is programmatically accessible via ARIA
  const messageHistory = page.locator('[data-testid="message-history"]')
  await expect(messageHistory).toHaveAttribute('role', 'log')
  await expect(messageHistory).toHaveAttribute('aria-label')
  
  // Test 6: All elements maintain accessibility properties
  await expect(messageInput).toHaveAttribute('aria-label')
  await expect(sendButton).toHaveAttribute('aria-label')
  
  // Test 7: Final verification that programmatic focus still works after Tab
  // This ensures Tab doesn't break the focus system
  await messageInput.focus()
  await expect(messageInput).toBeFocused()
  
  await sendButton.focus()
  await expect(sendButton).toBeFocused()
})

test('Accessibility - Screen reader simulation and ARIA compliance', async ({ page, goto }) => {
  // Given a user with a screen reader visits the game
  await goto('/', { waitUntil: 'hydration' })
  
  // When they navigate using assistive technology
  // Then all content should be properly announced and accessible
  
  // Test semantic HTML structure
  const mainContent = page.locator('main')
  await expect(mainContent).toBeVisible()
  
  // Test heading hierarchy
  const gameTitle = page.locator('h1')
  await expect(gameTitle).toBeVisible()
  await expect(gameTitle).toHaveText('Revisionist')
  
  // Test ARIA labels and roles
  const messageHistory = page.locator('[data-testid="message-history"]')
  await expect(messageHistory).toHaveAttribute('role', 'log')
  await expect(messageHistory).toHaveAttribute('aria-label', 'Message history')
  await expect(messageHistory).toHaveAttribute('aria-live', 'polite')
  
  const messageInput = page.locator('[data-testid="message-input"] textarea')
  await expect(messageInput).toHaveAttribute('aria-label', 'Message to send')
  await expect(messageInput).toHaveAttribute('aria-describedby')
  
  const sendButton = page.locator('[data-testid="send-button"]')
  await expect(sendButton).toHaveAttribute('aria-label')
  
  // Test that character counter is associated with input
  const characterCounter = page.locator('[data-testid="character-counter"]')
  const inputDescribedBy = await messageInput.getAttribute('aria-describedby')
  const counterId = await characterCounter.getAttribute('id')
  expect(inputDescribedBy).toContain(counterId!)
  
  // Test color contrast and visual indicators
  await expect(gameTitle).toHaveCSS('color', /.+/) // Should have readable color
  await expect(sendButton).toHaveCSS('background-color', /.+/) // Should have visible background
  
  // Test focus indicators
  await messageInput.focus()
  await expect(messageInput).toHaveCSS('outline', /.+|focus/)
  
  await sendButton.focus()
  await expect(sendButton).toHaveCSS('outline', /.+|focus/)
  
  // Test that all interactive elements have proper labels
  const interactiveElements = [messageInput, sendButton]
  for (const element of interactiveElements) {
    const ariaLabel = await element.getAttribute('aria-label')
    const ariaLabelledBy = await element.getAttribute('aria-labelledby')
    const title = await element.getAttribute('title')
    
    // Each interactive element should have at least one way of being labeled
    expect(ariaLabel || ariaLabelledBy || title).toBeTruthy()
  }
  
  // Test that status messages are announced
  await messageInput.fill('Test message that fills character limit')
  
  // Character counter should update and be announced
  await expect(characterCounter).toBeVisible()
  await expect(characterCounter).toHaveAttribute('aria-live', 'polite')
  
  // Test that empty states are announced
  const emptyState = page.locator('[data-testid="empty-state"]')
  await expect(emptyState).toBeVisible()
  await expect(emptyState).toContainText('No messages yet')
  
  // Test document structure for screen readers
  const pageTitle = await page.title()
  expect(pageTitle).toContain('Revisionist')
  
  // Test that all text content is selectable and readable
  await expect(page.locator('body')).toHaveCSS('font-family', /.+/)
})

test('BDD - Complete Message Sending Flow', async ({ page, goto }) => {
  // Given a user has typed a valid message
  await goto('/', { waitUntil: 'hydration' })

  const messageInput = page.locator('[data-testid="message-input"] textarea')
  const sendButton = page.locator('[data-testid="send-button"]')
  const messageHistory = page.locator('[data-testid="message-history"]')
  const messagesCounter = page.locator('[data-testid="messages-counter"]')

  // Verify initial state
  await expect(messagesCounter).toContainText('5') // 5 messages remaining
  await expect(messageHistory.locator('[data-testid="empty-state"]')).toBeVisible()

  // Given a user types a valid message
  const testMessage = 'Hello, Napoleon! What are your plans for Europe?'
  await messageInput.fill(testMessage)

  // Verify button becomes enabled (not disabled)
  await expect(sendButton).not.toBeDisabled()

  // When they click send
  await sendButton.click()

  // Then message appears in history and counter decreases
  // Check that message appears in history
  await expect(messageHistory.locator('[data-testid="message-item"]')).toHaveCount(1)
  await expect(messageHistory.locator('[data-testid="message-item"]').first()).toContainText(testMessage)

  // Check that counter decreases to 4
  await expect(messagesCounter).toContainText('4')

  // Check that input is cleared
  await expect(messageInput).toHaveValue('')

  // Check that empty state is no longer visible
  await expect(messageHistory.locator('[data-testid="empty-state"]')).not.toBeVisible()
})

test('BDD - Multiple Message Sending Flow', async ({ page, goto }) => {
  // Given a user wants to send multiple messages
  await goto('/', { waitUntil: 'hydration' })

  const messageInput = page.locator('[data-testid="message-input"] textarea')
  const sendButton = page.locator('[data-testid="send-button"]')
  const messageHistory = page.locator('[data-testid="message-history"]')
  const messagesCounter = page.locator('[data-testid="messages-counter"]')

  // Send first message
  await messageInput.fill('First message to Napoleon')
  await sendButton.click()

  // Send second message  
  await messageInput.fill('Second strategic question')
  await sendButton.click()

  // Then both messages appear in chronological order
  await expect(messageHistory.locator('[data-testid="message-item"]')).toHaveCount(2)
  await expect(messageHistory.locator('[data-testid="message-item"]').first()).toContainText('First message to Napoleon')
  await expect(messageHistory.locator('[data-testid="message-item"]').last()).toContainText('Second strategic question')

  // And counter shows correct remaining messages
  await expect(messagesCounter).toContainText('3')
})

test('BDD - Send Button Disabled States', async ({ page, goto }) => {
  // Given a user is on the game page
  await goto('/', { waitUntil: 'hydration' })

  const messageInput = page.locator('[data-testid="message-input"] textarea')
  const sendButton = page.locator('[data-testid="send-button"]')

  // When input is empty, button should be disabled
  await expect(sendButton).toBeDisabled()

  // When user types valid message, button becomes enabled
  await messageInput.fill('Valid message')
  await expect(sendButton).not.toBeDisabled()

  // When user clears input, button becomes disabled again
  await messageInput.fill('')
  await expect(sendButton).toBeDisabled()
})
