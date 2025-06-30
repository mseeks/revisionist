import { test, expect } from '@playwright/test'

test.describe('Defeat Detection', () => {
    test('should show defeat screen when all messages used without victory', async ({ page }) => {
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
                            message: "I don't understand.",
                            action: "Franz Ferdinand dismisses the message"
                        },
                        diceRoll: 5,
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
        for (let i = 0; i < 5; i++) {
            await page.fill('[data-testid="message-input"] textarea', `Message ${i + 1}`)
            await page.click('[data-testid="send-button"]')
            await page.waitForSelector('[data-testid="ai-message"]')
        }

        // Then they should see a defeat screen
        await expect(page.locator('[data-testid="end-game-screen"]')).toBeVisible()
        await expect(page.locator('[data-testid="defeat-message"]')).toBeVisible()

        // And understand why they failed
        await expect(page.locator('[data-testid="defeat-explanation"]')).toContainText('objective')

        // And cannot send more messages
        await expect(page.locator('[data-testid="send-button"]')).toBeDisabled()
    })
})
