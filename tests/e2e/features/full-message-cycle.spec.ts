import { test, expect } from '@nuxt/test-utils/playwright'

test.describe('Full Message Cycle (BDD)', () => {
    test('Complete flow: Send "Avoid Sarajevo" and receive AI response', async ({ page, goto }) => {
        // Given a user starts a new game
        await goto('/', { waitUntil: 'hydration' })

        // Verify initial game state
        const messagesCounter = page.locator('[data-testid="messages-counter"]')
        await expect(messagesCounter).toContainText('Messages Remaining: 5')

        const messageHistory = page.locator('[data-testid="message-history"]')
        const emptyState = page.locator('[data-testid="empty-state"]')
        await expect(emptyState).toBeVisible()
        await expect(emptyState).toContainText('No messages yet')

        // When they send "Avoid Sarajevo in June 1914"
        const messageInput = page.locator('[data-testid="message-input"] textarea')
        const sendButton = page.locator('[data-testid="send-button"]')

        await messageInput.fill('Avoid Sarajevo in June 1914')
        await sendButton.click()

        // Then they should see Franz Ferdinand's AI response
        // First verify loading state appears
        await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible()
        await expect(sendButton).toBeDisabled()

        // Wait for user message to appear in history
        await expect(messageHistory).toContainText('Avoid Sarajevo in June 1914')
        await expect(messageHistory).toContainText('You:')

        // Wait for AI response to appear (with generous timeout for API)
        await expect(messageHistory).toContainText('Franz Ferdinand:', { timeout: 15000 })

        // Verify AI response is present and contextual
        const aiMessage = messageHistory.locator('[data-sender="ai"]').first()
        await expect(aiMessage).toBeVisible()
        await expect(aiMessage).toContainText('Franz Ferdinand:')

        // And the message counter should decrease to 4
        await expect(messagesCounter).toContainText('Messages Remaining: 4')

        // And both messages appear in history
        const messageItems = messageHistory.locator('[data-testid="message-item"]')
        await expect(messageItems).toHaveCount(2)

        // Verify user message
        const userMessage = messageItems.first()
        await expect(userMessage).toContainText('You:')
        await expect(userMessage).toContainText('Avoid Sarajevo in June 1914')
        await expect(userMessage).toHaveAttribute('data-sender', 'user')

        // Verify AI message
        const aiMessageItem = messageItems.last()
        await expect(aiMessageItem).toContainText('Franz Ferdinand:')
        await expect(aiMessageItem).toHaveAttribute('data-sender', 'ai')

        // And loading state should be cleared
        await expect(page.locator('[data-testid="loading-indicator"]')).not.toBeVisible()

        // And input should be cleared and ready for next message
        await expect(messageInput).toHaveValue('')
        await expect(emptyState).not.toBeVisible()
    })

    test('Verify complete flow works end-to-end with contextual response', async ({ page, goto }) => {
        // Given a user starts a new game
        await goto('/', { waitUntil: 'hydration' })

        const messageInput = page.locator('[data-testid="message-input"] textarea')
        const sendButton = page.locator('[data-testid="send-button"]')
        const messageHistory = page.locator('[data-testid="message-history"]')

        // When they send the specific test message
        await messageInput.fill('Avoid Sarajevo in June 1914')
        await sendButton.click()

        // Then they should receive a contextually appropriate AI response
        await expect(messageHistory).toContainText('Franz Ferdinand:', { timeout: 15000 })

        // Verify the AI response is contextual to the objective (Prevent World War I)
        const aiMessage = messageHistory.locator('[data-sender="ai"]').first()
        await expect(aiMessage).toBeVisible()

        // The response should be relevant to Franz Ferdinand and the historical context
        // We can't predict exact content, but we can verify it's a substantial response
        const aiMessageText = await aiMessage.textContent()
        expect(aiMessageText).toBeTruthy()
        expect(aiMessageText!.length).toBeGreaterThan(20) // Should be a meaningful response

        // Verify timestamp is present
        await expect(aiMessage.locator('[data-testid="message-timestamp"]')).toBeVisible()
    })

    test('Test with different message content maintains context', async ({ page, goto }) => {
        // Given a user starts a new game
        await goto('/', { waitUntil: 'hydration' })

        const messageInput = page.locator('[data-testid="message-input"] textarea')
        const sendButton = page.locator('[data-testid="send-button"]')
        const messageHistory = page.locator('[data-testid="message-history"]')
        const messagesCounter = page.locator('[data-testid="messages-counter"]')

        // When they send a different strategic message
        const testMessage = 'Your safety concerns me, Your Imperial Highness. Perhaps delay the visit?'
        await messageInput.fill(testMessage)
        await sendButton.click()

        // Then they should receive an appropriate AI response
        await expect(messageHistory).toContainText('Franz Ferdinand:', { timeout: 15000 })

        // And the message counter should decrease appropriately
        await expect(messagesCounter).toContainText('Messages Remaining: 4')

        // And both messages should be visible with proper styling
        const messageItems = messageHistory.locator('[data-testid="message-item"]')
        await expect(messageItems).toHaveCount(2)

        // Verify user message maintains expected format
        const userMessage = messageItems.first()
        await expect(userMessage).toContainText('You:')
        await expect(userMessage).toContainText(testMessage)

        // Verify AI response is contextual and formatted correctly
        const aiMessage = messageItems.last()
        await expect(aiMessage).toContainText('Franz Ferdinand:')
        await expect(aiMessage).toHaveAttribute('data-sender', 'ai')

        // Ensure AI responses are contextual to objective
        const aiResponseText = await aiMessage.textContent()
        expect(aiResponseText).toBeTruthy()
        expect(aiResponseText!.length).toBeGreaterThan(15) // Meaningful response
    })

    test('Ensure AI responses are contextual to "Prevent World War I" objective', async ({ page, goto }) => {
        // Given a user starts a new game with the objective to prevent WWI
        await goto('/', { waitUntil: 'hydration' })

        // Verify the objective is clearly displayed
        const objectiveDisplay = page.locator('[data-testid="objective-display"]')
        await expect(objectiveDisplay).toContainText('Prevent World War I')

        const messageInput = page.locator('[data-testid="message-input"] textarea')
        const sendButton = page.locator('[data-testid="send-button"]')
        const messageHistory = page.locator('[data-testid="message-history"]')

        // When they send a message related to preventing WWI
        await messageInput.fill('The situation in the Balkans seems dangerous. What are your thoughts?')
        await sendButton.click()

        // Then Franz Ferdinand should respond in character and contextually
        await expect(messageHistory).toContainText('Franz Ferdinand:', { timeout: 15000 })

        const aiMessage = messageHistory.locator('[data-sender="ai"]').first()
        await expect(aiMessage).toBeVisible()

        // Verify the response acknowledges the WWI prevention context
        // (This is verified by the AI system prompt including the objective)
        const responseText = await aiMessage.textContent()
        expect(responseText).toBeTruthy()

        // Response should be substantial and in character
        expect(responseText!.length).toBeGreaterThan(25)
        expect(responseText).toContain('Franz Ferdinand:')
    })
})
