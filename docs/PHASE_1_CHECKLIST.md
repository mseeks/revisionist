# Phase 1: Foundation Setup - Detailed Checklist

## Goal
Basic Nuxt app with single game interface and comprehensive test coverage.

## Project Initialization

### 1. Initialize Nuxt 3 in Current Repository
- [x] Run `npx nuxi@latest init .` (initializes Nuxt in current directory)
- [x] Install dependencies: `npm install`
- [x] Verify basic app runs: `npm run dev`
- [x] Test at `http://localhost:3000` shows Nuxt welcome page

### 2. Configure TypeScript
- [x] Verify `nuxt.config.ts` exists with TypeScript enabled
- [x] Check `tsconfig.json` is auto-generated
- [x] Run `npm run build` to verify TypeScript compilation
- [x] Fix any TypeScript errors that appear

### 3. Install and Configure Nuxt UI
- [x] Install Nuxt UI: `npm install @nuxt/ui`
- [x] Add `@nuxt/ui` to modules in `nuxt.config.ts`
- [x] Install required peer dependencies: `npm install @headlessui/vue @heroicons/vue`
- [x] Restart dev server to verify UI module loads

### 4. Install Testing Framework
- [x] Install Vitest: `npm install --save-dev vitest @vue/test-utils happy-dom`
- [x] Install Playwright for E2E: `npm install --save-dev @playwright/test @nuxt/test-utils`
- [x] Add test scripts to `package.json`:
  ```json
  {
    "scripts": {
      "test": "vitest",
      "test:e2e": "playwright test"
    }
  }
  ```
- [x] Create `vitest.config.ts` with Nuxt integration
- [x] Create `playwright.config.ts` for E2E configuration

## Test Setup (TDD/BDD Foundation)

### 5. Configure Unit Testing (TDD Setup)
- [x] Create `tests/unit/` directory
- [x] Create basic test helper utilities in `tests/utils/`
- [x] Create `tests/unit/components/` directory for component tests
- [x] Write example failing test to verify TDD setup works
- [x] Run `npm test` to confirm test framework detects failing tests

### 6. Configure E2E Testing (BDD Setup)
- [x] Create `tests/e2e/` directory
- [x] Create `tests/e2e/features/` directory for BDD scenarios
- [x] Install Playwright browsers: `npx playwright install`
- [x] Write BDD-style E2E test structure with Given/When/Then comments
- [x] Create initial failing E2E test for game interface
- [x] Run `npm run test:e2e` to verify E2E framework detects failing tests

## Game Interface Development (TDD/BDD Approach)

### 7. Main Game Page (BDD First)
- [x] Write BDD scenario in `tests/e2e/features/game-interface.spec.ts`:
  ```
  // Given a user visits the game page
  // When the page loads
  // Then they should see the complete game interface
  ```
- [x] Write failing E2E test for complete page structure
- [x] Replace `pages/index.vue` content with minimal structure to pass E2E
- [x] Add semantic HTML elements guided by E2E test requirements
- [x] Use Nuxt UI components for consistent styling
- [x] Verify E2E test passes

### 8. Game Title Section (TDD First)
- [x] Write failing unit test in `tests/unit/components/GameTitle.nuxt.test.ts`:
  - [x] Should render "Revisionist" title
  - [x] Should use appropriate heading level (h1)
  - [x] Should apply correct CSS classes
- [x] Write failing E2E test:
  ```
  // Given a user is on the game page
  // When the page loads
  // Then they should see "Revisionist" as the main title
  ```
- [x] Create minimal title implementation to pass unit tests
- [x] Style with Nuxt UI typography classes to pass E2E tests
- [x] Verify all tests pass

### 9. Objective Display (TDD First)
- [x] Write failing unit tests in `tests/unit/components/ObjectiveDisplay.spec.ts`:
  - [x] Should render hardcoded objective text
  - [x] Should display "Prevent World War I"
  - [x] Should style as prominent card/panel
- [x] Write failing E2E test:
  ```
  // Given a user is on the game page
  // When they look for the objective
  // Then they should see "Prevent World War I" prominently displayed
  ```
- [x] Implement minimal objective display to pass unit tests
- [x] Style as prominent card/panel using Nuxt UI to pass E2E tests
- [x] Verify all tests pass

### 10. Message Input Component (TDD First)
- [x] Write failing unit tests in `tests/unit/components/MessageInput.spec.ts`:
  - [x] Should render textarea element
  - [x] Should have 160 character limit attribute
  - [x] Should display character counter
  - [x] Should update counter on input
  - [x] Should show remaining characters correctly
  - [x] Should prevent input beyond 160 characters
- [x] Write failing E2E tests:
  ```
  // Given a user wants to send a message
  // When they type in the message input
  // Then they should see a real-time character counter
  // And the input should stop accepting text at 160 characters
  ```
- [x] Create `components/MessageInput.vue` with minimal implementation
- [x] Add textarea with character limit to pass unit tests
- [x] Add real-time character counter logic to pass all tests
- [x] Style with Nuxt UI form components
- [x] Verify all tests pass

### 11. Send Button (TDD First)
- [x] Write failing unit tests in `tests/unit/components/SendButton.spec.ts`:
  - [x] Should render button element
  - [x] Should display "Send" text
  - [x] Should have button type
  - [x] Should be accessible (proper aria attributes)
- [x] Write failing E2E test:
  ```
  // Given a user has typed a message
  // When they look for how to send it
  // Then they should see a clearly labeled Send button
  // And the button should be keyboard accessible
  ```
- [x] Add send button with minimal implementation
- [x] Use Nuxt UI button component to pass styling tests
- [x] Add accessibility attributes to pass E2E tests
- [x] Verify all tests pass (button non-functional at this stage)

### 12. Message History Component (TDD First)
- [x] Write failing unit tests in `tests/unit/components/MessageHistory.spec.ts`:
  - [x] Should render scrollable container
  - [x] Should show empty state when no messages
  - [x] Should have proper ARIA labels for accessibility
  - [x] Should accept messages array prop (empty for now)
- [x] Write failing E2E test:
  ```
  // Given a user is on the game page
  // When they look for message history
  // Then they should see an empty message history area
  // And it should be ready to display future messages
  ```
- [x] Create `components/MessageHistory.vue` with minimal implementation
- [x] Add scrollable container to pass unit tests
- [x] Style empty state with Nuxt UI list/card components
- [x] Add accessibility features to pass E2E tests
- [x] Verify all tests pass

### 13. Messages Counter (TDD First) ✅
- [x] Write failing unit tests in `tests/unit/components/MessagesCounter.spec.ts`:
  - [x] Should render counter display
  - [x] Should show "Messages Remaining: 5" initially
  - [x] Should accept remainingMessages prop
  - [x] Should update display when prop changes
- [x] Write failing E2E test:
  ```
  // Given a user starts a new game
  // When they view the interface
  // Then they should see "Messages Remaining: 5"
  // And it should be prominently displayed
  ```
- [x] Add messages counter with hardcoded "5" value
- [x] Style with Nuxt UI badge/indicator to pass tests
- [x] Position prominently in UI as required by E2E tests
- [x] Verify all tests pass

### 14. Layout Integration (BDD First)
- [x] Write comprehensive E2E test for complete layout:
  ```
  // Given a user visits the game for the first time
  // When the page loads completely
  // Then they should see all components in logical order:
  //   - Game title at the top
  //   - Objective prominently displayed
  //   - Message input area
  //   - Send button below input
  //   - Message history area
  //   - Messages counter visible
  // And the layout should be visually hierarchical
  // And all elements should be keyboard accessible
  ```
- [x] Arrange all components in main page to pass E2E layout test
- [x] Use Nuxt UI grid/layout utilities for responsive behavior
- [x] Test visual hierarchy and spacing against E2E requirements
- [x] Verify complete layout E2E test passes

## Testing Coverage (TDD/BDD Verification)

### 15. Unit Test Coverage (TDD Verification)
- [x] Verify all components have comprehensive unit tests written first
- [x] Run `npm test -- --coverage` to check coverage metrics
- [x] Ensure >90% unit test coverage achieved through TDD approach
- [x] Verify all unit tests were written before implementation
- [x] Test component props, methods, and computed properties
- [x] Confirm all tests follow TDD Red-Green-Refactor cycle

### 16. E2E Test Coverage (BDD Verification)  
- [ ] Verify all user scenarios covered with Given/When/Then structure
- [ ] Test complete user journey through interface:
  ```
  // Given a new user visits the game
  // When they interact with each interface element  
  // Then they should have a complete, accessible experience
  ```
- [ ] Test keyboard navigation through all elements
- [ ] Test accessibility with screen reader simulation
- [ ] Verify all E2E tests follow BDD scenario structure
- [ ] Confirm all interactive elements are functionally tested

### 17. Test Documentation (TDD/BDD Process)
- [ ] Create `tests/README.md` explaining TDD/BDD approach used
- [ ] Document the Red-Green-Refactor cycles followed
- [ ] Document BDD scenario structure and Given/When/Then patterns
- [ ] Explain how to run different test types in development
- [ ] Document test coverage requirements and verification process
- [ ] Add TDD/BDD workflow to development guidelines

## Final Verification

### 18. Quality Assurance
- [ ] All tests pass: `npm test && npm run test:e2e`
- [ ] No TypeScript errors: `npm run build`
- [ ] No console errors in browser
- [ ] All UI components render correctly
- [ ] Interface is visually complete and polished

### 19. Code Quality
- [ ] Remove any unused imports or code
- [ ] Ensure consistent code formatting
- [ ] Verify all components are properly typed
- [ ] Check all files have appropriate comments

### 20. Documentation
- [ ] Update README.md with setup instructions
- [ ] Document component structure and purpose
- [ ] Add development workflow instructions
- [ ] Commit all changes with descriptive message

## Success Criteria
- [ ] ✅ Complete game interface renders without errors
- [ ] ✅ All UI components are present and styled
- [ ] ✅ Unit test coverage >90% achieved through TDD Red-Green-Refactor cycles
- [ ] ✅ All E2E tests pass with proper BDD Given/When/Then structure
- [ ] ✅ TypeScript compilation successful
- [ ] ✅ No console warnings or errors
- [ ] ✅ All tests were written before implementation (TDD/BDD followed)
- [ ] ✅ Interface ready for Phase 2 state management integration

## Estimated Deliverables
- Fully functional UI layout built through TDD/BDD approach
- Comprehensive test suite with >90% coverage
- Clean, typed codebase following test-first principles
- BDD scenarios documenting expected user behavior
- Documentation of TDD/BDD process for next phases
