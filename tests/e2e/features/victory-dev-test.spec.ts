import { test, expect } from '@playwright/test'

// Configure test to use existing dev server
test.use({ baseURL: 'http://localhost:3000' })

test.describe('Victory Detection (Dev Server)', () => {
    test('should show victory badge when progress reaches 100%', async ({ page }) => {
        // Given a user starts a new game
        await page.goto('/')

        // Wait for game to load
        await expect(page.locator('[data-testid="message-input"]')).toBeVisible()

        // Mock API to return responses that achieve 100% progress
        await page.route('/api/send-message', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        characterResponse: {
                            message: "I shall prevent this war!",
                            action: "Franz Ferdinand cancels his trip to Sarajevo"
                        },
                        diceRoll: 20,
                        diceOutcome: "Critical Success",
                        timelineAnalysis: {
                            impact: "Major diplomatic breakthrough achieved",
                            progressChange: 100
                        }
                    }
                })
            })
        })

        // When they send a message that achieves the objective
        await page.fill('[data-testid="message-input"] textarea', 'Cancel your trip to Sarajevo!')
        await page.click('[data-testid="send-button"]')

        // Wait for response
        await page.waitForSelector('[data-testid="ai-message"]')

        // Then they should see a victory badge
        await expect(page.locator('text=🎉 VICTORY! 🎉')).toBeVisible()

        // And cannot send more messages
        await expect(page.locator('[data-testid="send-button"]')).toBeDisabled()
    })
})
