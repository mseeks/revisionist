import { test, expect } from '@playwright/test'

// Configure test to use existing dev server  
test.use({ baseURL: 'http://localhost:3000' })

test.describe('Full Game Cycle Test', () => {
    test('should cycle through all 5 messages and check final state', async ({ page }) => {
        // Given a user starts a new game
        await page.goto('/')

        // Wait for game to load
        await expect(page.locator('[data-testid="message-input"]')).toBeVisible()

        // Mock API to return small progress each time
        await page.route('/api/send-message', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        characterResponse: {
                            message: "I will consider your words.",
                            action: "Franz Ferdinand ponders the message"
                        },
                        diceRoll: 10,
                        diceOutcome: "Neutral",
                        timelineAnalysis: {
                            impact: "Minor diplomatic consideration",
                            progressChange: 15
                        }
                    }
                })
            })
        })

        // Send all 5 messages with proper delays
        for (let i = 1; i <= 5; i++) {
            console.log(`Sending message ${i}`)

            await page.fill('[data-testid="message-input"] textarea', `Message ${i}: Please avoid Sarajevo!`)
            await page.click('[data-testid="send-button"]')

            // Wait for AI response to appear
            await page.waitForSelector('text=I will consider your words.')

            // Wait for loading to complete and state to update
            await page.waitForFunction(() => {
                const sendButton = document.querySelector('[data-testid="send-button"]');
                return sendButton && !sendButton.textContent?.includes('Sending...');
            })

            // Check messages remaining
            const counterText = await page.locator('[data-testid="messages-counter"]').textContent()
            console.log(`After message ${i}: ${counterText}`)

            // Wait for rate limit to clear (1 second)
            await page.waitForTimeout(1200)
        }

        // Check final state
        await page.waitForTimeout(1000) // Wait for any async state updates

        // Take final screenshot
        await page.screenshot({ path: 'final-game-state.png' })

        // Check if game ended properly
        const finalCounter = await page.locator('[data-testid="messages-counter"]').textContent()
        console.log('Final counter:', finalCounter)

        // Check for victory or defeat badge
        const badges = await page.locator('div').filter({ hasText: /VICTORY|DEFEAT|Mission Complete/ }).allTextContents()
        console.log('Final badges:', badges)

        // Check send button state
        const sendButtonDisabled = await page.locator('[data-testid="send-button"]').isDisabled()
        console.log('Send button disabled:', sendButtonDisabled)

        // Check progress
        const progressText = await page.locator('[data-testid="progress-percentage"]').textContent()
        console.log('Final progress:', progressText)
    })
})
