# Revisionist - POC Implementation Plan

## Overview
A lean, iterative plan to build a working prototype of Revisionist that demonstrates all core game mechanics. Built with Vue.js (Options API), Nuxt 3, Nuxt UI, and OpenAI API.

**POC Goal**: Prove the core gameplay loop is engaging and technically feasible with real AI integration.

## Phase 1: Foundation Setup ✅ COMPLETED
**Goal**: Basic Nuxt app with single game interface and comprehensive test coverage

**Status**: ✅ **COMPLETED** - Phase 1 delivered full UI layout with comprehensive TDD/BDD test coverage

**Detailed Implementation**: See [PHASE_1_CHECKLIST.md](./PHASE_1_CHECKLIST.md) for complete TDD/BDD implementation steps.

**Results Achieved**: 
- ✅ Working Nuxt 3 app with complete game UI layout
- ✅ Comprehensive test suite with >90% coverage
- ✅ All UI components implemented and styled with Nuxt UI
- ✅ TDD/BDD development foundation established
- ✅ TypeScript configuration and error-free compilation
- ✅ Accessibility compliant interface
- ✅ Complete game interface ready for state management

## Phase 2: Core Game State 🚧 CURRENT PHASE
**Goal**: Implement game logic and state management

**Status**: 🚧 **IN PROGRESS** - Moving from static UI to functional game state

**Detailed Implementation**: See [PHASE_2_CHECKLIST.md](./PHASE_2_CHECKLIST.md) for complete TDD/BDD implementation steps.

**Result**: Functional UI with proper state management (no AI yet)

## Phase 3: OpenAI Integration
**Goal**: Connect real AI responses to game mechanics

### Tasks:
1. Set up server API route (`/api/send-message.post.ts`)
2. Configure OpenAI client with environment variables
3. Create prompt system:
   - Historical figure personality context
   - Current objective context
   - Dice roll outcome integration
   - Timeline progression context
4. Implement basic error handling for API failures
5. Connect frontend to API endpoint

**Result**: Working AI chat with historical figures responding to messages

## Phase 4: Dice System & Outcomes
**Goal**: Add probabilistic outcomes and progression tracking

### Tasks:
1. Implement D20 dice rolling on backend
2. Create outcome interpretation system:
   - 1-2: Critical Failure
   - 3-7: Failure  
   - 8-13: Neutral
   - 14-18: Success
   - 19-20: Critical Success
3. Add progress tracking (percentage toward objective)
4. Display dice roll results to player
5. Integrate dice outcomes into AI responses

**Result**: Complete core gameplay loop with randomness and progression

## Phase 5: Win/Lose Conditions
**Goal**: Implement game completion logic

### Tasks:
1. Add win condition detection (progress reaches 100%)
2. Add lose condition (5 messages used, objective not achieved)
3. Create simple end-game screens:
   - Victory message with summary
   - Defeat message with what went wrong
   - "Play Again" button that resets game state
4. Prevent further messaging after game ends

**Result**: Complete playable game with proper endings

## POC Validation Criteria

**Technical Validation**:
- [ ] AI integration works reliably with OpenAI API
- [ ] Dice system creates varied, contextual outcomes
- [ ] Game state management handles the iterative message cycle
- [ ] Progress tracking accurately reflects player actions

**Gameplay Validation**:
- [ ] 160-character constraint creates interesting strategic decisions
- [ ] Players can achieve early victory through good strategy/luck
- [ ] Setbacks force meaningful adaptation of approach
- [ ] AI responses feel authentic to historical figures
- [ ] Overall experience is engaging for 5-10 minute sessions

## Key Implementation Decisions

### Simplified Scope for POC
- **Single Objective**: "Prevent World War I" (proven engaging from game design)
- **No Scenario Selection**: Jump directly into gameplay
- **Desktop Only**: No responsive design needed
- **Basic Error Handling**: Simple user feedback, no complex retry logic
- **Minimal Polish**: Focus on functionality over animations/effects

### Critical Success Factors
1. **OpenAI Prompt Engineering**: Most important technical challenge
   - Historical figure personality consistency
   - Dice outcome integration into narrative
   - Progress tracking that feels logical
   
2. **Gameplay Feel**: Most important design challenge
   - Message constraint creates meaningful decisions
   - Progress feedback motivates continued play
   - Early victory possibility creates tension

3. **Technical Stability**: Most important implementation challenge
   - Reliable API calls to OpenAI
   - Proper error states when API fails
   - Clean state management for game resets

## Simplified File Structure for POC

```
revisionist/
├── pages/
│   └── index.vue          # Single-page game interface
├── server/
│   └── api/
│       └── send-message.post.ts  # OpenAI integration endpoint
├── stores/
│   └── game.ts            # Pinia store for game state
├── components/
│   ├── MessageInput.vue   # Message input with character counter
│   ├── MessageHistory.vue # Display sent messages and responses
│   ├── ProgressTracker.vue # Objective progress and dice results
│   └── EndGameScreen.vue  # Win/lose screens
└── utils/
    └── openai.ts          # OpenAI client configuration
```

## Development Notes

### Essential Dependencies
```json
{
  "@nuxt/ui": "^2.x",
  "openai": "^4.x", 
  "@pinia/nuxt": "^0.5.x"
}
```

### Environment Setup
```bash
# .env
OPENAI_API_KEY=your_openai_key_here
```

### Key Architectural Decisions
- **Single Page App**: No routing complexity, just one game interface
- **Minimal Components**: Only essential UI pieces, no over-engineering
- **Direct OpenAI Integration**: No response caching or optimization for POC
- **Visible Dice Rolls**: Show players the D20 results for transparency
- **Hardcoded Objective**: "Prevent World War I" - complex enough to test all mechanics

**Total Development Time Estimate: Working POC achievable in focused development session**
