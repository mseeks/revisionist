import { test, expect } from '@playwright/test'

// Configure test to use existing dev server
test.use({ baseURL: 'http://localhost:3000' })

test.describe('Defeat Detection (Dev Server)', () => {
    test('should show defeat badge when all messages used without victory', async ({ page }) => {
        // Given a user starts a new game
        await page.goto('/')

        // Wait for game to load
        await expect(page.locator('[data-testid="message-input"]')).toBeVisible()

        // Mock API to return responses that make insufficient progress
        await page.route('/api/send-message', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        characterResponse: {
                            message: "I don't understand this message.",
                            action: "Franz Ferdinand dismisses the warning"
                        },
                        diceRoll: 3,
                        diceOutcome: "Failure",
                        timelineAnalysis: {
                            impact: "No significant progress made",
                            progressChange: 10
                        }
                    }
                })
            })
        })

        // When they use all 5 messages with insufficient progress
        for (let i = 1; i <= 5; i++) {
            await page.fill('[data-testid="message-input"] textarea', `Message ${i}: War is coming!`)
            await page.click('[data-testid="send-button"]')

            // Wait for response before sending next message
            await page.waitForSelector(`text=I don't understand this message.`)
        }

        // Then they should see a defeat badge
        await expect(page.locator('text=💥 DEFEAT 💥')).toBeVisible()

        // And see defeat information
        await expect(page.locator('text=Mission Failed')).toBeVisible()

        // And cannot send more messages
        await expect(page.locator('[data-testid="send-button"]')).toBeDisabled()
    })
})
