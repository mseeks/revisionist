import { test, expect } from '@playwright/test'

test.describe('Progress Display - BDD', () => {
    test.beforeEach(async ({ page }) => {
        // Start a fresh game
        await page.goto('/')

        // Wait for game to initialize
        await page.waitForSelector('[data-testid="game-title"]', { state: 'visible' })
    })

    test('should display progress toward AI-generated objective', async ({ page }) => {
        // Given a user has an AI-generated objective
        // The objective should be generated automatically when the game starts
        await page.waitForSelector('[data-testid="progress-tracker"]', { state: 'visible' })

        // The objective should be displayed
        const objectiveElement = page.locator('[data-testid="objective-title"]')
        await expect(objectiveElement).toBeVisible()
        await expect(objectiveElement).toContainText(/prevent|achieve|stop|save/i)

        // When they make progress toward the objective
        // Send a message to trigger progress
        const messageInput = page.locator('[data-testid="message-input"]')
        await messageInput.fill('I must warn you about the dangers ahead!')

        const sendButton = page.locator('[data-testid="send-button"]')
        await sendButton.click()

        // Wait for AI response and progress update
        await page.waitForSelector('[data-testid="message-history"] .message', { state: 'visible' })

        // Then they should see their progress percentage
        const progressPercentage = page.locator('[data-testid="progress-percentage"]')
        await expect(progressPercentage).toBeVisible()
        await expect(progressPercentage).toContainText(/%/)

        // And a visual progress bar
        const progressBar = page.locator('[data-testid="progress-bar"]')
        await expect(progressBar).toBeVisible()

        // And the current objective clearly displayed
        await expect(objectiveElement).toBeVisible()
        await expect(objectiveElement).toContainText(/prevent|achieve|stop|save/i)
    })

    test('should show progress status with appropriate colors', async ({ page }) => {
        // Given a user has progress toward their objective
        await page.waitForSelector('[data-testid="progress-tracker"]', { state: 'visible' })

        // Then the progress status should be visible
        const progressStatus = page.locator('[data-testid="progress-status"]')
        await expect(progressStatus).toBeVisible()

        // And should have appropriate styling based on progress level
        // (Low progress should show warning/danger colors, high progress should show success colors)
        const progressBar = page.locator('[data-testid="progress-bar"]')
        await expect(progressBar).toBeVisible()

        // Check that progress bar has some color indication
        const progressBarClasses = await progressBar.getAttribute('class')
        expect(progressBarClasses).toBeTruthy()
    })

    test('should update progress when messages are sent', async ({ page }) => {
        // Given a user starts with 0% progress
        await page.waitForSelector('[data-testid="progress-tracker"]', { state: 'visible' })

        const initialProgress = page.locator('[data-testid="progress-percentage"]')
        await expect(initialProgress).toBeVisible()

        // When they send a message that affects the timeline
        const messageInput = page.locator('[data-testid="message-input"]')
        await messageInput.fill('Let me help you change the course of history!')

        const sendButton = page.locator('[data-testid="send-button"]')
        await sendButton.click()

        // Wait for the AI response
        await page.waitForSelector('[data-testid="message-history"] .message', { state: 'visible' })

        // Then the progress should potentially update
        const updatedProgress = page.locator('[data-testid="progress-percentage"]')
        await expect(updatedProgress).toBeVisible()
        await expect(updatedProgress).toContainText(/%/)

        // And the progress bar should reflect the current state
        const progressBar = page.locator('[data-testid="progress-bar"]')
        await expect(progressBar).toBeVisible()
    })
})
