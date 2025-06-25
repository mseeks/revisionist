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

## Phase 2: Core Game State ✅ COMPLETED
**Goal**: Implement game logic and state management

**Status**: ✅ **COMPLETED** - Functional game state with message flow

**Detailed Implementation**: See [PHASE_2_CHECKLIST.md](./PHASE_2_CHECKLIST.md) for complete TDD/BDD implementation steps.

**Results Achieved**:
- ✅ Pinia store with complete game state management
- ✅ Working message sending flow with validation
- ✅ Message counter and history tracking
- ✅ Game over detection and reset functionality
- ✅ All UI components connected to state
- ✅ Comprehensive test coverage maintained

## Phase 3: OpenAI Integration ✅ COMPLETED
**Goal**: Connect real AI responses to game mechanics

**Status**: ✅ **COMPLETED** - AI integration with conversation history

**Detailed Implementation**: See [PHASE_3_CHECKLIST.md](./PHASE_3_CHECKLIST.md) for complete TDD/BDD implementation steps.

**Results Achieved**:
- ✅ Working AI chat with Franz Ferdinand responding to messages  
- ✅ Conversation history maintained per figure (Phase 3 approach)
- ✅ GPT-4.1 model integration with contextual responses
- ✅ Loading states and error handling
- ✅ All existing tests pass with conversation context support

**Architecture Note**: Phase 3 implements **per-figure conversation history**. Franz Ferdinand remembers previous exchanges within a single game session. Phase 4 will explore **global timeline context** where figures can reference actions by other historical figures and timeline changes.

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

## Narrative Framework & Context Architecture

### The Communication Medium Question
**Challenge**: How does a historical figure receive a "text message" from the future?

**Design Solutions** (to be refined):
1. **Mystical Interpretation**: Messages appear as "visions," "dreams," or "divine inspiration" 
2. **Temporal Anomaly**: Unexplained phenomenon - messages arrive via period-appropriate medium
3. **Suspension of Disbelief**: Like sci-fi time travel, accept the premise and focus on consequences

**Current Implementation**: Messages are presented as direct communication without specific explanation

### Authority & Attention Problem  
**Challenge**: What makes historical figures pay attention to these messages?

**Potential Solutions**:
- **Prophetic Accuracy**: Early messages prove their worth through accurate predictions
- **Inside Knowledge**: Messages contain information only someone with intimate knowledge would know
- **Compelling Urgency**: Messages address the figure's deepest concerns or ambitions
- **Mysterious Authority**: Messages carry an inexplicable sense of importance

### Context Architecture Evolution

#### Phase 3 (Current): Per-Figure Context
```
Franz Ferdinand: [System: You are Franz Ferdinand...] + [Previous exchanges with Franz Ferdinand]
Napoleon: [System: You are Napoleon...] + [Previous exchanges with Napoleon]
```
**Pros**: Simple, maintains character continuity  
**Cons**: No cross-figure awareness, isolated conversations

#### Phase 4 (Proposed): Global Timeline Context  
```
Global Context: 
- Timeline State: [Key changes, cascading effects, progress toward objective]
- Cross-Figure Awareness: [Major interventions with other figures]
- Historical Consistency: [Logical flow of altered events]

Figure-Specific Context:
- Character: [Franz Ferdinand personality, concerns, historical position]  
- Direct History: [Recent exchanges with this specific figure]
```

**Example Implementation**:
*Message to Franz Ferdinand after successful intervention with Bismarck:*
```
System Context: "You are Franz Ferdinand in 1914. Recent timeline changes: Bismarck's alliance system has shifted toward economic cooperation rather than military pacts, creating a different European political landscape. You've been contacted by an mysterious advisor who demonstrated uncanny foresight about European affairs."

Conversation History: [Previous exchanges with Franz Ferdinand]
Current Message: "Given the changing alliance structures, perhaps your Sarajevo visit timing should be reconsidered?"
```

**Benefits**: 
- Figures can reference broader timeline changes
- More sophisticated narrative continuity
- Supports "cascading effects" from game design
- Enables cross-figure strategic gameplay

**Questions for Future Phases**:
1. Should figures be explicitly aware they're in an "altered timeline"?
2. How much should they remember about messages from other figures?
3. Should there be limits to their "future knowledge" to maintain historical authenticity?

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
