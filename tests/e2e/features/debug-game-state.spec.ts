import { test, expect } from '@playwright/test'

// Configure test to use existing dev server
test.use({ baseURL: 'http://localhost:3000' })

test.describe('Game State Debug', () => {
    test('debug game state after sending messages', async ({ page }) => {
        // Given a user starts a new game
        await page.goto('/')

        // Wait for game to load
        await expect(page.locator('[data-testid="message-input"]')).toBeVisible()

        // Check initial messages counter
        const initialCounter = await page.locator('[data-testid="messages-counter"]').textContent()
        console.log('Initial counter:', initialCounter)

        // Check initial status
        const initialStatus = await page.locator('text=Active Mission').textContent()
        console.log('Initial status:', initialStatus)

        // Mock API to return responses that make minimal progress
        await page.route('/api/send-message', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        characterResponse: {
                            message: "I don't understand.",
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

        // Send just one message to see what happens
        await page.fill('[data-testid="message-input"] textarea', 'Test message')
        await page.click('[data-testid="send-button"]')

        // Wait for response
        await page.waitForSelector('text=I don\'t understand.')

        // Check counter after one message
        const afterOneCounter = await page.locator('[data-testid="messages-counter"]').textContent()
        console.log('After one message counter:', afterOneCounter)

        // Take screenshot for debugging
        await page.screenshot({ path: 'debug-after-one-message.png' })

        // Check current status
        const statusBadge = await page.locator('div:has-text("Active Mission"), div:has-text("VICTORY"), div:has-text("DEFEAT")').first()
        const currentStatus = await statusBadge.textContent()
        console.log('Current status after one message:', currentStatus)
    })
})
