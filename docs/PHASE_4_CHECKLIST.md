# Phase 4: Dice System & Outcomes - Detailed Checklist

## Goal
Add probabilistic outcomes with D20 dice mechanics and objective progress tracking - bringing true game mechanics to life.

## Dice System Foundation

### 1. Objective Generation System (TDD First)
- [x] Write failing unit tests for objective generation:
  - [x] Should generate unique historical objectives
  - [x] Should include clear success criteria
  - [x] Should provide historical context
  - [x] Should return structured objective data
- [x] Create `server/utils/objective-generator.ts` with AI integration
- [x] Implement objective generation prompt system
- [x] For POC: Generate "Prevent World War I" consistently for testing
- [x] Store objective in game state for reference throughout game
- [x] Verify objective generation tests pass

### 2. Create Dice Utility (TDD First)
- [x] Write failing unit tests in `tests/unit/utils/dice.spec.ts`:
  - [x] Should roll a number between 1-20
  - [x] Should categorize roll into outcome tiers
  - [x] Should return both roll value and outcome type
- [x] Create `utils/dice.ts` with D20 roll function
- [x] Implement outcome categorization:
  ```
  1-2: Critical Failure
  3-7: Failure
  8-13: Neutral
  14-18: Success
  19-20: Critical Success
  ```
- [x] Verify all dice utility tests pass

### 3. Dual-Layer AI System with Structured Outputs (TDD First)
- [x] Write failing unit tests for dual AI system:
  - [x] Should perform dice roll on message send
  - [x] Should generate structured character response (message, action)
  - [x] Should pass dice roll and character data to timeline evaluation
  - [x] Should return both character response and timeline analysis
- [x] Update `server/api/send-message.post.ts` for structured two-stage AI generation
- [x] First AI call: Character response using OpenAI structured outputs
  ```json
  {
    "message": "What Franz Ferdinand says to the player",
    "action": "What Franz Ferdinand decides to do in response"
  }
  ```
- [x] Second AI call: Timeline evaluation (receives dice roll + character structure)
- [x] Return comprehensive response data (character response, timeline impact, dice data)
- [x] Verify dual-layer AI with structured outputs tests pass

### 4. Store Structured Character Data (TDD First)
- [x] Write failing unit tests for structured data storage:
  - [x] Should store character message with dice roll and outcome
  - [x] Should store character action description
  - [x] Should store timeline evaluation and progress impact
  - [x] Should maintain structured message history for context
- [x] Update Message interface to include structured character data:
  ```typescript
  interface Message {
    text: string
    sender: 'user' | 'ai' | 'system'
    timestamp: Date
    diceRoll?: number
    diceOutcome?: string
    characterAction?: string
    timelineImpact?: string
    progressChange?: number
  }
  ```
- [x] Update game store to save structured response data
- [x] Verify structured data storage tests pass

## Progress Tracking System

### 5. Progress State Management (TDD First)
- [x] Write failing unit tests for progress tracking:
  - [x] Should start at 0% progress toward AI-generated objective
  - [x] Should update based on timeline evaluation results
  - [x] Should calculate cumulative progress from timeline impacts
  - [x] Should store timeline evaluation explanations
- [x] Add `objectiveProgress`, `currentObjective`, and `timelineEvents` to game store
- [x] Create `updateProgressFromTimeline()` action
- [x] Implement progress calculation from timeline AI evaluation
- [x] Store narrative explanations of progress changes
- [x] Verify progress tracking tests pass

### 6. Progress Display Component (TDD First)
- [x] Write failing unit tests for ProgressTracker:
  - [x] Should display AI-generated objective
  - [x] Should display current percentage
  - [x] Should show visual progress bar
  - [x] Should indicate objective status
- [x] Write BDD test:
  ```
  // Given a user has an AI-generated objective
  // When they make progress toward the objective
  // Then they should see their progress percentage
  // And a visual progress bar
  // And the current objective clearly displayed
  ```
- [x] Create `components/ProgressTracker.vue`
- [x] Display current objective from game state
- [x] Use Nuxt UI progress component
- [x] Style with appropriate colors (red/yellow/green)
- [x] Verify all progress display tests pass

### 7. Structured Message Display (TDD First)
- [x] Write failing unit tests for enhanced message display:
  - [x] Should show dice roll value (1-20) and outcome category
  - [x] Should display character message and action separately
  - [x] Should show timeline impact analysis
  - [x] Should use appropriate styling per outcome
- [x] Update MessageHistory to show structured AI responses
- [x] Display character message as conversation
- [x] Display character action as consequence summary
- [x] Show timeline impact explanation with progress change
- [x] Add dice icon and roll animation with result reveal
- [x] Style based on outcome (critical failure = red, critical success = green)
- [x] Verify structured message display tests pass

## AI Response Enhancement

### 8. Dual-Prompt System with Structured Outputs (TDD First)
- [x] Write failing unit tests for dual prompt system:
  - [x] Should create character-specific prompt with structured output schema
  - [x] Should create timeline evaluation prompt (dice + character data aware)
  - [x] Should include dice outcome in character prompt for response magnitude
  - [x] Should pass character message and action to timeline evaluator
- [x] Create character prompt builder with JSON schema definition
- [x] Define character response schema (message, action in natural language)
- [x] Create timeline evaluation prompt builder (receives dice roll + character structure)
- [x] Character prompts exclude knowledge of AI-generated objective but include outcome guidance
- [x] Timeline prompts analyze character actions for historical impact toward current objective
- [x] Verify dual prompt system with structured outputs tests pass

### 9. Timeline Impact Analysis with Action Evaluation (TDD First)
- [x] Write failing integration tests for timeline analysis:
  - [x] Should evaluate character actions against current AI-generated objective
  - [x] Should consider dice roll magnitude in progress calculation
  - [x] Should analyze specific character decisions for cascading effects
  - [x] Should generate meaningful progress changes from character actions
- [x] Implement timeline analysis AI call with enriched input data
- [x] Generate progress updates based on character actions and dice magnitude
- [x] Create narrative explanations linking character decisions to objective achievement
- [x] Test timeline analysis provides actionable feedback on character choices
- [x] Verify timeline impact analysis with structured inputs tests pass

## Win/Lose Conditions

### 10. Victory Detection (TDD First)
- [x] Write failing unit tests for win condition:
  - [x] Should detect when progress >= 100%
  - [x] Should set game status to 'victory'
  - [x] Should prevent further messages
- [x] Write BDD test:
  ```
  // Given a user's progress reaches 100%
  // When the game evaluates the state
  // Then they should see a victory screen
  // And cannot send more messages
  ```
- [x] Implement victory detection in store
- [x] Update game status appropriately
- [x] Verify victory detection tests pass

### 11. Defeat Detection (TDD First)
- [x] Write failing unit tests for lose condition:
  - [x] Should detect when messages = 0 and progress < 100%
  - [x] Should set game status to 'defeat'
  - [x] Should show what went wrong
- [x] Write BDD test:
  ```
  // Given a user has used all 5 messages
  // When their progress is below 100%
  // Then they should see a defeat screen
  // And understand why they failed
  ```
- [x] Implement defeat detection logic
- [x] Track reason for failure
- [x] Verify defeat detection tests pass

### 12. Early Victory System (TDD First)
- [x] Write failing unit tests for early victory:
  - [x] Should allow victory with messages remaining
  - [x] Should celebrate efficient success
  - [x] Should show messages saved
- [x] Implement early victory detection
- [x] Add bonus recognition for efficiency
- [x] Verify early victory tests pass

## End Game Experience

### 13. End Game Screen Component (TDD First)
- [x] Write failing unit tests for EndGameScreen:
  - [x] Should display victory or defeat message
  - [x] Should show final progress percentage
  - [x] Should summarize key moments
  - [x] Should offer "Play Again" option
- [x] Write BDD tests:
  ```
  // Given a game has ended in victory
  // When the end screen appears
  // Then the player sees their achievement
  // And can start a new game
  ```
- [x] Create `components/EndGameScreen.vue`
- [x] Design compelling victory/defeat UI
- [x] Include game summary statistics
- [x] Verify end screen tests pass

### 14. Game Summary Generation (TDD First)
- [x] Write failing unit tests for game summary:
  - [x] Should list critical turning points
  - [x] Should highlight best/worst rolls
  - [x] Should show message efficiency
- [x] Create summary generation logic
- [x] Track key game moments in store
- [x] Display in end game screen
- [x] Verify summary generation tests pass

## Dice Animation & Polish

### 15. Dice Roll Animation (BDD First)
- [ ] Write E2E test for dice animation:
  ```
  // Given a user sends a message
  // When the dice rolls
  // Then they see an animated D20 with outcome tiers visible
  // And the result is revealed dramatically with clear outcome category
  // And they can see which outcome range was hit
  ```
- [ ] Add dice animation showing all outcome ranges
- [ ] Show rolling before revealing result with suspense
- [ ] Display outcome tiers (1-2: Critical Failure, etc.) for transparency
- [ ] Ensure accessibility with ARIA labels for dice results
- [ ] Verify animation tests pass

### 16. Progress Animation (BDD First)
- [ ] Write E2E test for progress updates:
  ```
  // Given the user's progress changes
  // When the bar updates
  // Then they see smooth animation
  // And clear before/after values
  ```
- [ ] Animate progress bar changes
- [ ] Show +/- indicators for changes
- [ ] Add subtle celebration for big gains
- [ ] Verify progress animation tests pass

## Integration Testing

### 17. Complete Game Flow (BDD)
- [ ] Write comprehensive E2E test:
  ```
  // Given a user starts a new game
  // When they play through multiple messages
  // Then they experience:
  //   - Dice rolls affecting character responses
  //   - Character responses staying authentic to personality
  //   - Timeline evaluations explaining historical impact
  //   - Progress tracking toward AI-generated objective
  //   - Victory upon reaching 100% through timeline changes
  //   - Or defeat after 5 messages if objective not achieved
  ```
- [ ] Test full dual-layer AI system from start to victory
- [ ] Test character authenticity across all dice outcomes
- [ ] Test timeline evaluation coherence across message sequence
- [ ] Test early victory through exceptional timeline impacts
- [ ] Verify edge cases in dual-AI system handled

### 18. Outcome Variety Testing (BDD)
- [ ] Write E2E tests for each outcome:
  ```
  // Given different dice roll results
  // When the game processes them
  // Then each outcome type works correctly
  ```
- [ ] Test critical failure consequences
- [ ] Test major success rewards
- [ ] Test neutral response handling
- [ ] Verify all outcome paths work

## Global Timeline Context (Architecture)

### 19. Timeline State Foundation (TDD First)
- [ ] Write failing unit tests for timeline tracking:
  - [ ] Should track major timeline changes
  - [ ] Should maintain chronological order
  - [ ] Should categorize by impact level
- [ ] Add timeline state to game store
- [ ] Create timeline event interface
- [ ] Implement basic timeline tracking
- [ ] Verify timeline foundation tests pass

### 20. Cross-Figure Context (TDD First)
- [ ] Write failing unit tests for context building:
  - [ ] Should generate timeline summary
  - [ ] Should identify cascading effects
  - [ ] Should maintain narrative coherence
- [ ] Create timeline context builder
- [ ] Generate summaries for AI prompts
- [ ] Test context includes key events
- [ ] Verify context building tests pass

### 21. Enhanced AI Prompts (Integration)
- [ ] Write integration tests for timeline awareness:
  - [ ] AI acknowledges timeline changes
  - [ ] Responses reference cascading effects
  - [ ] Historical coherence maintained
- [ ] Update prompt system for global context
- [ ] Include timeline state in all prompts
- [ ] Test AI responses show awareness
- [ ] Verify timeline integration works

## Success Criteria
- [ ] ✅ D20 dice system determines message outcomes
- [ ] ✅ Progress tracking shows advancement toward objective
- [ ] ✅ AI responses reflect dice results contextually
- [ ] ✅ Victory achieved at 100% progress
- [ ] ✅ Defeat occurs when messages exhausted below 100%
- [ ] ✅ Early victory possible with exceptional rolls
- [ ] ✅ End game screens provide satisfying conclusion
- [ ] ✅ Dice animations enhance game feel
- [ ] ✅ Timeline context architecture established
- [ ] ✅ All existing tests still pass
- [ ] ✅ >90% test coverage maintained
- [ ] ✅ No TypeScript errors
- [ ] ✅ Ready for Phase 5 polish and expansion

## Next Phase Preparation
- [ ] Core game loop fully functional
- [ ] All mechanics integrated and tested
- [ ] Foundation for multiple objectives ready
- [ ] Architecture supports future features
