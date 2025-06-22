import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import MessagesCounter from '../../../components/MessagesCounter.vue'
import { useGameStore } from '../../../stores/game'

describe('MessagesCounter', () => {
    beforeEach(() => {
        // Create a fresh Pinia instance for each test
        setActivePinia(createPinia())
    })

    it('should render counter display', () => {
        const wrapper = mount(MessagesCounter)
        expect(wrapper.find('[data-testid="messages-counter"]').exists()).toBe(true)
    })

    it('should show "Messages Remaining: 5" initially', () => {
        const wrapper = mount(MessagesCounter)
        const gameStore = useGameStore()

        // Should show store default value
        expect(wrapper.text()).toContain(`Messages Remaining: ${gameStore.remainingMessages}`)
    })

    it('should react to store changes', async () => {
        const wrapper = mount(MessagesCounter)
        const gameStore = useGameStore()

    // Initial value
        expect(wrapper.text()).toContain('Messages Remaining: 5')

        // Change store value
        gameStore.remainingMessages = 3
        await wrapper.vm.$nextTick()

        // Should reactively update
        expect(wrapper.text()).toContain('Messages Remaining: 3')
    })

    it('should update display when store value changes', async () => {
        const wrapper = mount(MessagesCounter)
        const gameStore = useGameStore()

        expect(wrapper.text()).toContain('Messages Remaining: 5')

        gameStore.remainingMessages = 1
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain('Messages Remaining: 1')
    })

    describe('Store Integration', () => {
        it('should display current remaining messages from store', async () => {
            const wrapper = mount(MessagesCounter)
            const gameStore = useGameStore()

            // Should display store value (default 5)
            expect(wrapper.text()).toContain(`Messages Remaining: ${gameStore.remainingMessages}`)

            // Change store value
            gameStore.remainingMessages = 3
            await wrapper.vm.$nextTick()

            // Should reactively update
            expect(wrapper.text()).toContain('Messages Remaining: 3')
        })

        it('should use Pinia store instead of hardcoded value', () => {
            const gameStore = useGameStore()

            // Set a different value in store
            gameStore.remainingMessages = 2

            const wrapper = mount(MessagesCounter)

            // Should use store value, not hardcoded default
            expect(wrapper.text()).toContain('Messages Remaining: 2')
            expect(wrapper.text()).not.toContain('Messages Remaining: 5')
        })
    })
})
