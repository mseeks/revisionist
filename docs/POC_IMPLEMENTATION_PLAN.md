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
**Goal**: Add probabilistic outcomes and progression tracking with dual-layer AI architecture

**Status**: 🚧 **NEXT PHASE** - Ready to begin dice system implementation

**Detailed Implementation**: See [PHASE_4_CHECKLIST.md](./PHASE_4_CHECKLIST.md) for complete TDD/BDD implementation steps.

**Key Architecture**: 
- **Character Layer**: Franz Ferdinand responds authentically based on dice outcomes, unaware of "Prevent WWI" goal
- **Timeline Layer**: Separate AI evaluates character actions for historical impact and progress calculation
- **Structured Outputs**: Character AI returns `{message, action}` in natural language for timeline analysis

**Result**: Complete core gameplay loop with D20 dice mechanics, dual-layer AI responses, progress tracking, and win/lose conditions

## Phase 5: Polish & Expansion
**Goal**: Enhance game experience and prepare for production

### Tasks:
1. Expand Objective Generator AI for diverse historical scenarios
2. Add multiple historical figures beyond Franz Ferdinand
3. Create figure selection interface
4. Enhanced end-game screens with detailed summaries:
   - Victory analysis with key decision points
   - Defeat post-mortem with alternative strategies
   - Historical context explanations
5. Polish UI animations and transitions
6. Add sound effects and music
7. Implement achievement system

**Result**: Production-ready game with diverse AI-generated scenarios and polished experience

## POC Validation Criteria

**Technical Validation**:
- [ ] Dual-layer AI integration works reliably with character + timeline evaluation
- [ ] Dice system creates varied, contextual outcomes with structured responses
- [ ] Character authenticity maintained while achieving strategic objectives
- [ ] Timeline analysis provides meaningful progress feedback
- [ ] Game state management handles complete dual-AI message cycle

**Gameplay Validation**:
- [ ] 160-character constraint creates interesting strategic decisions
- [ ] Players can achieve early victory through good strategy/luck
- [ ] Character responses feel authentic while serving game objectives
- [ ] Timeline feedback helps players understand their impact
- [ ] Dual-layer system creates rich, coherent narratives
- [ ] Overall experience is engaging for 5-10 minute sessions

## Key Implementation Decisions

### Simplified Scope for POC
- **AI-Generated Objective**: Start each game with AI creating a unique historical goal (initially "Prevent World War I" for consistency)
- **Single Figure**: Franz Ferdinand as primary contact for Phase 4 implementation
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

#### Phase 4 (Implemented): Dual-Layer Context  
```
Character Layer (Franz Ferdinand):
- System: "You are Franz Ferdinand in 1914. A mysterious advisor contacts you..."
- Conversation History: [Previous exchanges with Franz Ferdinand]
- Dice Outcome: [Success] - affects response magnitude and conviction
- Output: {message: "...", action: "..."}

Timeline Layer (Objective Evaluator):
- Input: Dice roll + Franz Ferdinand's message + Franz Ferdinand's action
- Analysis: How character's decision affects "Prevent WWI" objective
- Output: Timeline impact explanation + progress calculation
```

**Current Benefits**:
- Character authenticity maintained (Franz Ferdinand unaware of objective)
- Strategic feedback through timeline analysis
- Natural language structured outputs for LLM-to-LLM communication
- Dice outcomes create meaningful variance in character responses

#### Phase 5+ (Proposed): Global Timeline Context  
```
Multiple Characters with Shared Timeline:
- Franz Ferdinand: [Character context] + [Relevant timeline changes]
- Kaiser Wilhelm: [Character context] + [Timeline changes from Franz Ferdinand's actions]
- Timeline Synthesis: [Cross-figure effects and cascading consequences]
```

**Future Benefits**: 
- Cross-figure awareness and strategic coordination
- Complex cascading effects across multiple historical periods
- Richer narrative continuity spanning different characters

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
