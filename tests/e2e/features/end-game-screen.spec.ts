import { test, expect } from '@playwright/test'

test.describe('End Game Screen BDD', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('Given a game has ended in victory, When the end screen appears, Then the player sees their achievement And can start a new game', async ({ page }) => {
        // Given: Set up a game state that leads to victory
        // Start the game and get an objective
        await page.waitForSelector('[data-testid="objective-display"]')

        // Mock a quick victory by intercepting the API call
        await page.route('/api/send-message', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        characterResponse: {
                            message: "Your wisdom has prevented the great war!",
                            action: "Calls for immediate peace negotiations"
                        },
                        diceRoll: 20,
                        diceOutcome: "Critical Success",
                        timelineAnalysis: {
                            impact: "Major breakthrough achieved - World War I successfully prevented!",
                            progressChange: 100
                        }
                    }
                })
            })
        })

        // Send a message to trigger victory
        await page.fill('[data-testid="message-input"] textarea', 'Peace is the only way forward')
        await page.click('[data-testid="send-button"]')

        // Wait for the response and victory condition
        await page.waitForSelector('[data-testid="end-game-screen"]')

        // When: The end screen appears
        const endGameScreen = page.locator('[data-testid="end-game-screen"]')
        await expect(endGameScreen).toBeVisible()

        // Then: The player sees their achievement
        const victoryMessage = page.locator('[data-testid="victory-message"]')
        await expect(victoryMessage).toBeVisible()
        await expect(victoryMessage).toContainText('Victory')

        const finalProgress = page.locator('[data-testid="final-progress"]')
        await expect(finalProgress).toBeVisible()
        await expect(finalProgress).toContainText('100%')

        const gameSummary = page.locator('[data-testid="game-summary"]')
        await expect(gameSummary).toBeVisible()

        // And: Can start a new game
        const playAgainButton = page.locator('[data-testid="play-again-button"]')
        await expect(playAgainButton).toBeVisible()
        await expect(playAgainButton).toContainText('Play Again')

        // Click play again and verify game resets
        await playAgainButton.click()

        // Verify the game has reset
        await expect(page.locator('[data-testid="messages-counter"]')).toContainText('5')
        await expect(page.locator('[data-testid="end-game-screen"]')).not.toBeVisible()
    })

    test('Given a game has ended in defeat, When the end screen appears, Then the player sees what went wrong And can start a new game', async ({ page }) => {
        // Given: Set up a game state that leads to defeat
        await page.waitForSelector('[data-testid="objective-display"]')

        // Mock responses that lead to defeat
        await page.route('/api/send-message', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        characterResponse: {
                            message: "I do not understand your strange words.",
                            action: "Dismisses the message and continues as planned"
                        },
                        diceRoll: 3,
                        diceOutcome: "Failure",
                        timelineAnalysis: {
                            impact: "Minimal impact - historical events proceed unchanged",
                            progressChange: 5
                        }
                    }
                })
            })
        })

        // Send all 5 messages to exhaust the limit
        for (let i = 0; i < 5; i++) {
            await page.fill('[data-testid="message-input"] textarea', `Message ${i + 1}`)
            await page.click('[data-testid="send-button"]')
            await page.waitForTimeout(1000) // Wait between messages
        }

        // Wait for defeat condition
        await page.waitForSelector('[data-testid="end-game-screen"]')

        // When: The end screen appears
        const endGameScreen = page.locator('[data-testid="end-game-screen"]')
        await expect(endGameScreen).toBeVisible()

        // Then: The player sees what went wrong
        const defeatMessage = page.locator('[data-testid="defeat-message"]')
        await expect(defeatMessage).toBeVisible()
        await expect(defeatMessage).toContainText('Defeat')

        const defeatExplanation = page.locator('[data-testid="defeat-explanation"]')
        await expect(defeatExplanation).toBeVisible()
        await expect(defeatExplanation).toContainText('objective was not achieved')

        const finalProgress = page.locator('[data-testid="final-progress"]')
        await expect(finalProgress).toBeVisible()
        // Should show progress less than 100%
        await expect(finalProgress).not.toContainText('100%')

        // And: Can start a new game
        const playAgainButton = page.locator('[data-testid="play-again-button"]')
        await expect(playAgainButton).toBeVisible()

        // Click play again and verify game resets
        await playAgainButton.click()

        // Verify the game has reset
        await expect(page.locator('[data-testid="messages-counter"]')).toContainText('5')
        await expect(page.locator('[data-testid="end-game-screen"]')).not.toBeVisible()
    })
})
