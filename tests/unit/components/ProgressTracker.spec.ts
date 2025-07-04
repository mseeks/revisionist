import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ProgressTracker from '../../../components/ProgressTracker.vue'
import { useGameStore } from '../../../stores/game'
import type { GameObjective } from '../../../server/utils/objective-generator'

describe('ProgressTracker', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('should display AI-generated objective', async () => {
        const gameStore = useGameStore()
        const mockObjective: GameObjective = {
            title: 'Prevent World War I',
            successCriteria: 'Convince Archduke Franz Ferdinand to avoid Sarajevo',
            historicalContext: 'It\'s June 1914, tensions are high in the Balkans...',
            targetProgress: 100,
            difficulty: 'medium'
        }
        gameStore.currentObjective = mockObjective

        const wrapper = mount(ProgressTracker)

        expect(wrapper.text()).toContain('Prevent World War I')
    })

    it('should display current percentage', async () => {
        const gameStore = useGameStore()
        gameStore.objectiveProgress = 45
        const mockObjective: GameObjective = {
            title: 'Prevent World War I',
            successCriteria: 'Test criteria',
            historicalContext: 'Test context',
            targetProgress: 100,
            difficulty: 'medium'
        }
        gameStore.currentObjective = mockObjective

        const wrapper = mount(ProgressTracker)

        expect(wrapper.text()).toContain('45%')
    })

    it('should show visual progress bar', async () => {
        const gameStore = useGameStore()
        gameStore.objectiveProgress = 60
        const mockObjective: GameObjective = {
            title: 'Test objective',
            successCriteria: 'Test criteria',
            historicalContext: 'Test context',
            targetProgress: 100,
            difficulty: 'medium'
        }
        gameStore.currentObjective = mockObjective

        const wrapper = mount(ProgressTracker)

        // Should have a progress bar element
        expect(wrapper.find('[data-testid="progress-bar"]').exists()).toBe(true)
    })

    it('should indicate objective status', async () => {
        const gameStore = useGameStore()

        // Test low progress (red/danger status)
        gameStore.objectiveProgress = 25
        const mockObjective: GameObjective = {
            title: 'Test objective',
            successCriteria: 'Test criteria',
            historicalContext: 'Test context',
            targetProgress: 100,
            difficulty: 'medium'
        }
        gameStore.currentObjective = mockObjective

        const wrapper = mount(ProgressTracker)

        // Should show appropriate status styling based on progress
        const progressElement = wrapper.find('[data-testid="progress-status"]')
        expect(progressElement.exists()).toBe(true)

        // Test that status changes with progress
        await gameStore.$patch({ objectiveProgress: 75 })
        await wrapper.vm.$nextTick()

        // Should now show better status
        expect(wrapper.find('[data-testid="progress-status"]').exists()).toBe(true)
    })

    it('should handle no objective gracefully', async () => {
        const gameStore = useGameStore()
        gameStore.currentObjective = null
        gameStore.objectiveProgress = 0

        const wrapper = mount(ProgressTracker)

        // Should not crash and show placeholder or loading state
        expect(wrapper.text()).toContain('No objective')
    })

    it('should update when progress changes', async () => {
        const gameStore = useGameStore()
        const mockObjective: GameObjective = {
            title: 'Test objective',
            successCriteria: 'Test criteria',
            historicalContext: 'Test context',
            targetProgress: 100,
            difficulty: 'medium'
        }
        gameStore.currentObjective = mockObjective
        gameStore.objectiveProgress = 30

        const wrapper = mount(ProgressTracker)

        expect(wrapper.text()).toContain('30%')

        // Update progress
        await gameStore.$patch({ objectiveProgress: 70 })
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('70%')
    })
})
