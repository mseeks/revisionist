import { test, expect } from '@playwright/test'

// Configure test to use existing dev server
test.use({ baseURL: 'http://localhost:3000' })

test.describe('Victory Test (Complete Cycle)', () => {
    test('should achieve victory with high-progress messages', async ({ page }) => {
        // Given a user starts a new game
        await page.goto('/')

        // Wait for game to load
        await expect(page.locator('[data-testid="message-input"]')).toBeVisible()

        // Mock API to return high progress responses for early victory
        await page.route('/api/send-message', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        characterResponse: {
                            message: "You are absolutely right! I will heed your warning!",
                            action: "Franz Ferdinand cancels all public appearances"
                        },
                        diceRoll: 20,
                        diceOutcome: "Critical Success",
                        timelineAnalysis: {
                            impact: "Major diplomatic breakthrough achieved - war prevention likely",
                            progressChange: 35
                        }
                    }
                })
            })
        })

        // Send 3 messages (3 × 35% = 105% > 100%)
        for (let i = 1; i <= 3; i++) {
            console.log(`Sending message ${i}`)

            await page.fill('[data-testid="message-input"] textarea', `Message ${i}: Cancel your trip to Sarajevo immediately!`)
            await page.click('[data-testid="send-button"]')

            // Wait for AI response
            await page.waitForSelector('text=You are absolutely right!')

            // Wait for loading to complete
            await page.waitForFunction(() => {
                const sendButton = document.querySelector('[data-testid="send-button"]');
                return sendButton && !sendButton.textContent?.includes('Sending...');
            })

            // Check messages remaining
            const counterText = await page.locator('[data-testid="messages-counter"]').textContent()
            console.log(`After message ${i}: ${counterText}`)

            // Check if victory achieved early
            const victoryBadge = await page.locator('text=🎉 VICTORY! 🎉').count()
            if (victoryBadge > 0) {
                console.log(`Victory achieved after message ${i}!`)
                break
            }

            // Wait for rate limit to clear if continuing
            if (i < 3) {
                await page.waitForTimeout(1200)
            }
        }

        // Check final state
        await page.waitForTimeout(1000)

        // Take final screenshot
        await page.screenshot({ path: 'victory-game-state.png' })

        // Verify victory elements
        await expect(page.locator('text=🎉 VICTORY! 🎉')).toBeVisible()
        await expect(page.locator('text=Efficiency:')).toBeVisible()

        // Verify button is disabled
        await expect(page.locator('[data-testid="send-button"]')).toBeDisabled()

        // Check final progress should be 100% or more
        const progressText = await page.locator('[data-testid="progress-percentage"]').textContent()
        console.log('Final progress:', progressText)
        const progressValue = parseInt(progressText?.replace('%', '') || '0')
        expect(progressValue).toBeGreaterThanOrEqual(100)

        // Check efficiency information
        const efficiencyText = await page.locator('text=messages saved').textContent()
        console.log('Efficiency info:', efficiencyText)
    })
})
