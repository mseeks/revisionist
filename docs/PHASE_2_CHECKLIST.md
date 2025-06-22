# Phase 2: Core Game State - Detailed Checklist

## Goal
Implement basic game logic and state management - minimal viable game flow.

## Core State Management

### 1. Install and Configure Pinia
- [x] Install Pinia: `npm install pinia @pinia/nuxt`
- [x] Add `@pinia/nuxt` to modules in `nuxt.config.ts`
- [x] Restart dev server to verify Pinia module loads

### 2. Create Basic Game Store (TDD First)
- [x] Write failing unit tests in `tests/unit/stores/game.spec.ts`:
  - [x] Should track remaining messages (starts at 5)
  - [x] Should track message history array (starts empty)
  - [x] Should track game status (playing/gameOver)
- [x] Create `stores/game.ts` with minimal state to pass tests
- [x] Define basic Message interface (text, sender, timestamp)
- [x] Verify all tests pass

### 3. Message Counter Logic (TDD First)
- [x] Write failing unit tests for message counter:
  - [x] Should decrement remaining messages when user sends
  - [x] Should not allow sending when 0 messages remain
  - [x] Should return boolean for canSendMessage computed
- [x] Implement `decrementMessages()` action to pass tests
- [x] Implement `canSendMessage` computed property to pass tests
- [x] Verify all counter logic tests pass

### 4. Message History Logic (TDD First)
- [x] Write failing unit tests for message history:
  - [x] Should add user message to history
  - [x] Should maintain chronological order
- [x] Implement `addUserMessage()` action to pass tests
- [x] Verify all message history tests pass

## UI Integration

### 5. Connect MessagesCounter Component (TDD First)
- [x] Write failing unit tests for MessagesCounter integration:
  - [x] Should display current remaining messages from store
  - [x] Should use Pinia store instead of hardcoded value
- [x] Update `MessagesCounter.vue` to use game store
- [x] Remove hardcoded "5" value, use store state
- [x] Verify all tests pass

### 6. Connect MessageHistory Component (TDD First)
- [x] Write failing unit tests for MessageHistory integration:
  - [x] Should display messages from store history
  - [x] Should show empty state when no messages
- [x] Update `MessageHistory.vue` to use game store
- [x] Verify all history display tests pass

### 7. Basic Message Input Validation (TDD First)
- [ ] Write failing unit tests for MessageInput validation:
  - [ ] Should prevent empty message submission
  - [ ] Should enforce 160 character limit
- [ ] Update `MessageInput.vue` with basic validation
- [ ] Verify all validation tests pass

### 8. Connect Send Button (TDD First)
- [ ] Write failing unit tests for SendButton:
  - [ ] Should be disabled when no messages remaining
  - [ ] Should be disabled when input is invalid
- [ ] Update `SendButton.vue` to connect with game store
- [ ] Add disabled states based on game conditions
- [ ] Verify all button state tests pass

## Complete Message Flow

### 9. Implement Message Sending Flow (BDD First)
- [ ] Write E2E test for complete flow:
  ```
  // Given a user has typed a valid message
  // When they click send
  // Then message appears in history and counter decreases
  ```
- [ ] Implement complete message sending in MessageInput component
- [ ] Clear input after sending
- [ ] Verify complete flow E2E test passes

### 10. Game Over Handling (TDD First)
- [ ] Write failing unit tests for game over:
  - [ ] Should detect when 5 messages are used
  - [ ] Should prevent further message sending
- [ ] Implement game over detection in game store
- [ ] Update UI components to handle game over state
- [ ] Verify all game over tests pass

### 11. Basic Reset Functionality (TDD First)
- [ ] Write failing unit tests for game reset:
  - [ ] Should reset messages remaining to 5
  - [ ] Should clear message history
- [ ] Implement `resetGame()` action in game store
- [ ] Add simple reset button for testing
- [ ] Verify all reset tests pass

## Success Criteria
- [ ] ✅ Basic game store manages message count and history
- [ ] ✅ Message sending flow works end-to-end
- [ ] ✅ Game over prevents further messaging
- [ ] ✅ Reset functionality works
- [ ] ✅ All existing tests still pass
- [ ] ✅ No TypeScript errors
- [ ] ✅ Ready for AI integration in Phase 3

## Next Phase Preparation
- [ ] Message flow can accommodate async AI responses
- [ ] Store structure ready for dice roll outcomes
