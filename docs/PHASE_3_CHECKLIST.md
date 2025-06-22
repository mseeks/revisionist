# Phase 3: OpenAI Integration - Detailed Checklist

## Goal
Connect real AI responses to game mechanics - minimal viable AI integration.

## Server API Setup

### 1. Install OpenAI SDK
- [x] Install OpenAI package: `npm install openai`
- [x] Add OpenAI to dependencies in `package.json`
- [x] Verify installation with `npm list openai`

### 2. Environment Configuration
- [x] Create `.env` file in project root
- [x] Add `OPENAI_API_KEY=your_openai_key_here`
- [x] Add `.env` to `.gitignore`
- [x] Create `.env.example` with placeholder

### 3. Create API Endpoint (TDD First)
- [x] Write failing unit test for API endpoint:
  - [x] Should exist at `/api/send-message`
  - [x] Should accept POST requests only
  - [x] Should require message body parameter
- [x] Create `server/api/send-message.post.ts` with minimal handler
- [x] Implement basic request validation
- [x] Verify unit tests pass

### 4. OpenAI Client Configuration (TDD First)
- [x] Write failing unit tests for OpenAI utility:
  - [x] Should initialize OpenAI client with API key
  - [x] Should handle missing API key gracefully
- [x] Create `server/utils/openai.ts` with client setup
- [x] Use runtime config for API key access
- [x] Verify configuration tests pass

## Basic AI Integration

### 5. Simple Prompt System (TDD First)
- [x] Write failing unit tests for prompt builder:
  - [x] Should create basic system prompt
  - [x] Should include Franz Ferdinand persona
  - [x] Should include "Prevent World War I" objective
- [x] Create minimal prompt builder function
- [x] Hardcode Franz Ferdinand as only figure for POC
- [x] Verify prompt builder tests pass

### 6. API Response Handler (TDD First)
- [x] Write failing unit tests for API response:
  - [x] Should return AI response text
  - [x] Should return success status
  - [x] Should handle API errors gracefully
- [x] Implement OpenAI chat completion call
- [x] Add basic error handling (return generic error message)
- [x] Verify response handler tests pass

### 7. Connect Frontend to API (BDD First)
- [x] Write E2E test for AI message flow:
  ```
  // Given a user has typed a message
  // When they click send
  // Then they should see AI response in history
  ```
- [x] Update game store to handle async responses
- [x] Add loading state while waiting for AI
- [x] Display AI response when received
- [x] Verify E2E test passes

## Game Store Updates

### 8. Async Message Handling (TDD First)
- [x] Write failing unit tests for async flow:
  - [x] Should set loading state during API call
  - [x] Should add AI response to history
  - [x] Should handle API failures
- [x] Update `sendMessage` action to be async
- [x] Add loading state to store
- [x] Implement error state handling
- [x] Verify all async tests pass

### 9. AI Message Display (TDD First)
- [x] Write failing unit tests for AI messages:
  - [x] Should differentiate user vs AI messages
  - [x] Should show sender name (Franz Ferdinand)
  - [x] Should display timestamp
- [x] Update Message interface to include sender type
- [x] Update MessageHistory component for AI messages
- [x] Style AI messages differently from user messages
- [x] Verify display tests pass

### 10. Loading States (TDD First)
- [x] Write failing unit tests for loading UI:
  - [x] Should disable send button during API call
  - [x] Should show loading indicator
  - [x] Should clear loading on response
- [x] Update SendButton to respect loading state
- [x] Add simple loading spinner to MessageHistory
- [x] Verify loading state tests pass

## Error Handling

### 11. API Error States (TDD First)
- [ ] Write failing unit tests for error handling:
  - [ ] Should show error message on API failure
  - [ ] Should allow retry after error
  - [ ] Should not decrement messages on error
- [ ] Implement error display in UI
- [ ] Add simple error message component
- [ ] Ensure message count unchanged on error
- [ ] Verify error handling tests pass

### 12. Rate Limiting Protection
- [ ] Add simple delay between API calls (1 second)
- [ ] Prevent spam clicking of send button
- [ ] Show "Please wait..." if clicking too fast

## Basic Integration Testing

### 13. Full Message Cycle (BDD)
- [ ] Write comprehensive E2E test:
  ```
  // Given a user starts a new game
  // When they send "Avoid Sarajevo in June 1914"
  // Then they should see Franz Ferdinand's AI response
  // And the message counter should decrease to 4
  // And both messages appear in history
  ```
- [ ] Verify complete flow works end-to-end
- [ ] Test with different message content
- [ ] Ensure AI responses are contextual

### 14. Multiple Messages Flow (BDD)
- [ ] Write E2E test for conversation:
  ```
  // Given a user has sent one message
  // When they send a follow-up message
  // Then AI should respond considering context
  ```
- [ ] Verify AI maintains conversation context
- [ ] Test message history builds correctly
- [ ] Confirm counter decrements properly

## Success Criteria
- [ ] ✅ API endpoint accepts messages and returns AI responses
- [ ] ✅ Frontend displays AI responses in message history
- [ ] ✅ Loading states work during API calls
- [ ] ✅ Basic error handling prevents crashes
- [ ] ✅ Message counter still decrements correctly
- [ ] ✅ AI responses are contextual to objective
- [ ] ✅ All existing tests still pass
- [ ] ✅ No TypeScript errors
- [ ] ✅ Ready for dice system in Phase 4

## Next Phase Preparation
- [ ] Response structure can accommodate dice roll data
- [ ] API can be extended for dice logic
- [ ] Store ready for outcome tracking
