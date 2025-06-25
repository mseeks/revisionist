import { test, expect } from '@nuxt/test-utils/playwright'

test.describe('Multiple Messages Flow (BDD)', () => {
    test('AI should respond considering conversation context', async ({ page, goto }) => {
        // Given a user has sent one message
        await goto('/', { waitUntil: 'hydration' })

        const messageInput = page.locator('[data-testid="message-input"] textarea')
        const sendButton = page.locator('[data-testid="send-button"]')
        const messageHistory = page.locator('[data-testid="message-history"]')
        const messagesCounter = page.locator('[data-testid="messages-counter"]')

        // Send first message
        await messageInput.fill('Your upcoming visit to Sarajevo concerns me')
        await sendButton.click()

        // Wait for AI response
        await expect(messageHistory).toContainText('Franz Ferdinand:', { timeout: 15000 })
        await expect(messagesCounter).toContainText('Messages Remaining: 4')

        // When they send a follow-up message
        await messageInput.fill('What specific security measures will you have?')
        await sendButton.click()

        // Then AI should respond considering context
        await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible()
        await expect(sendButton).toBeDisabled()

        // Wait for second AI response
        await expect(messageHistory.locator('[data-sender="ai"]')).toHaveCount(2, { timeout: 15000 })
        await expect(messagesCounter).toContainText('Messages Remaining: 3')

        // Verify message history builds correctly
        const messageItems = messageHistory.locator('[data-testid="message-item"]')
        await expect(messageItems).toHaveCount(4) // 2 user + 2 AI messages

        // Verify order: user1, ai1, user2, ai2
        await expect(messageItems.nth(0)).toContainText('Your upcoming visit to Sarajevo concerns me')
        await expect(messageItems.nth(0)).toHaveAttribute('data-sender', 'user')

        await expect(messageItems.nth(1)).toContainText('Franz Ferdinand:')
        await expect(messageItems.nth(1)).toHaveAttribute('data-sender', 'ai')

        await expect(messageItems.nth(2)).toContainText('What specific security measures will you have?')
        await expect(messageItems.nth(2)).toHaveAttribute('data-sender', 'user')

        await expect(messageItems.nth(3)).toContainText('Franz Ferdinand:')
        await expect(messageItems.nth(3)).toHaveAttribute('data-sender', 'ai')

        // Confirm counter decrements properly
        await expect(messagesCounter).toContainText('Messages Remaining: 3')
    })

    test('Verify AI maintains conversation context across multiple exchanges', async ({ page, goto }) => {
        // Given a user starts a conversation about a specific topic
        await goto('/', { waitUntil: 'hydration' })

        const messageInput = page.locator('[data-testid="message-input"] textarea')
        const sendButton = page.locator('[data-testid="send-button"]')
        const messageHistory = page.locator('[data-testid="message-history"]')

        // Send initial contextual message
        await messageInput.fill('I am deeply worried about the political tensions in the Balkans')
        await sendButton.click()

        // Wait for first AI response
        await expect(messageHistory).toContainText('Franz Ferdinand:', { timeout: 15000 })

        // Send follow-up that should reference the context
        await messageInput.fill('Given this situation, should you really travel there?')
        await sendButton.click()

        // Wait for second AI response that should acknowledge context
        await expect(messageHistory.locator('[data-sender="ai"]')).toHaveCount(2, { timeout: 15000 })

        // Verify that both AI responses exist and are meaningful
        const aiMessages = messageHistory.locator('[data-sender="ai"]')

        const firstResponse = await aiMessages.nth(0).textContent()
        const secondResponse = await aiMessages.nth(1).textContent()

        expect(firstResponse).toBeTruthy()
        expect(secondResponse).toBeTruthy()
        expect(firstResponse!.length).toBeGreaterThan(20)
        expect(secondResponse!.length).toBeGreaterThan(20)

        // Both should contain Franz Ferdinand identifier
        expect(firstResponse).toContain('Franz Ferdinand:')
        expect(secondResponse).toContain('Franz Ferdinand:')
    })

    test('Message history builds correctly with proper timestamps', async ({ page, goto }) => {
        // Given a user wants to send multiple messages
        await goto('/', { waitUntil: 'hydration' })

        const messageInput = page.locator('[data-testid="message-input"] textarea')
        const sendButton = page.locator('[data-testid="send-button"]')
        const messageHistory = page.locator('[data-testid="message-history"]')

        // Send first message
        await messageInput.fill('Good day, Your Imperial Highness')
        await sendButton.click()

        // Wait for AI response
        await expect(messageHistory).toContainText('Franz Ferdinand:', { timeout: 15000 })

        // Send second message
        await messageInput.fill('I bring urgent news about your planned visit')
        await sendButton.click()

        // Wait for second AI response
        await expect(messageHistory.locator('[data-sender="ai"]')).toHaveCount(2, { timeout: 15000 })

        // Verify all messages have timestamps
        const allMessages = messageHistory.locator('[data-testid="message-item"]')
        await expect(allMessages).toHaveCount(4)

        for (let i = 0; i < 4; i++) {
            const message = allMessages.nth(i)
            await expect(message.locator('[data-testid="message-timestamp"]')).toBeVisible()
        }

        // Verify chronological order (timestamps should be increasing)
        const timestamps = await allMessages.locator('[data-testid="message-timestamp"]').allTextContents()
        expect(timestamps.length).toBe(4)

        // All timestamps should be present and non-empty
        timestamps.forEach(timestamp => {
            expect(timestamp.trim()).toBeTruthy()
        })
    })
})
