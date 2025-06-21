# Revisionist

**A strategic text-based game where players alter history by sending 160-character messages to historical figures using AI and dice mechanics.**

[![Built with Nuxt](https://img.shields.io/badge/Built%20with-Nuxt%203-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)

## 🎮 Game Concept

In **Revisionist**, you're given grand historical objectives like "Prevent World War I" or "Accelerate the Industrial Revolution." Armed with just 5 messages of 160 characters each, you must strategically contact historical figures across different time periods to alter the course of history.

### Core Mechanics
- **Strategic Communication**: Send messages to 1-5 different historical figures
- **Probabilistic Outcomes**: Every message triggers a D20 dice roll determining success/failure
- **AI-Powered Responses**: Four specialized AI systems simulate authentic historical reactions
- **Cross-Timeline Effects**: Actions in one era ripple through to affect others
- **Dynamic Objectives**: Each game presents unique historical challenges

## 📋 Project Status

**Current Phase**: Phase 2 - Core Game State 🚧

**Phase 1 - Foundation Setup ✅ COMPLETED**
- ✅ **Nuxt 3 + TypeScript** foundation
- ✅ **Nuxt UI** component library integration  
- ✅ **Comprehensive test suite** (Vitest + Playwright) with >90% coverage
- ✅ **Core UI components** with TDD/BDD approach
- ✅ **Game interface layout** fully implemented
- ✅ **Accessibility compliant** interface

**Phase 2 - Core Game State 🚧 IN PROGRESS**
- 🚧 **Pinia store** for game state management
- 🚧 **Message sending flow** with validation
- 🚧 **Game logic** (message counter, history, game over states)
- 🚧 **Form validation** and error handling

**Next Phases**: OpenAI Integration → Dice System → Win/Lose Conditions

See [POC Implementation Plan](docs/POC_IMPLEMENTATION_PLAN.md) for the complete 5-phase roadmap and [Phase 2 Checklist](docs/PHASE_2_CHECKLIST.md) for current detailed tasks.

## 🛠️ Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) with TypeScript
- **UI Library**: [Nuxt UI](https://ui.nuxt.com/) (Tailwind CSS + Headless UI)
- **State Management**: [Pinia](https://pinia.vuejs.org/) (current phase)
- **Testing**: [Vitest](https://vitest.dev/) (unit) + [Playwright](https://playwright.dev/) (E2E)
- **AI Integration**: OpenAI API (Phase 3)
- **Development**: TDD/BDD approach with comprehensive test coverage

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (Verify: `node --version`)
- **npm, pnpm, yarn, or bun** (Package manager of choice)
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/revisionist.git
cd revisionist

# Install dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the game interface.

### Development Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm run generate         # Generate static site
npm run preview          # Preview production build
npm run postinstall      # Prepare Nuxt (auto-runs after install)

# Testing
npm run test             # Run unit tests (Vitest) in watch mode
npm run test:e2e         # Run E2E tests (Playwright) with UI
npm run test -- --coverage    # Run unit tests with coverage report

# Project Verification
npm run build && npm run preview  # Full build verification
```

### First-Time Setup Verification

After installation, verify everything works:

```bash
# 1. Check TypeScript compilation
npm run build

# 2. Run all tests
npm run test
npm run test:e2e

# 3. Start development
npm run dev
```

If all commands succeed, you're ready to develop! 🎉

## 📖 Documentation

- **[Game Design](docs/GAME_DESIGN.md)** - Complete gameplay mechanics and rules
- **[Implementation Plan](docs/POC_IMPLEMENTATION_PLAN.md)** - 5-phase development roadmap  
- **[Phase 1 Checklist](docs/PHASE_1_CHECKLIST.md)** - Detailed TDD/BDD implementation steps

## 🧪 Testing Approach

This project follows a **Test-Driven Development (TDD)** approach with comprehensive coverage:

- **Unit Tests**: Component behavior and game logic (Vitest + Vue Test Utils)
- **Integration Tests**: Component interactions and state management
- **E2E Tests**: Complete user workflows (Playwright)

Run tests during development:
```bash
npm run test        # Unit tests in watch mode
npm run test:e2e    # E2E tests with browser UI
```

## 🏗️ Project Structure

```
├── components/           # Vue components (GameTitle, MessageInput, etc.)
├── pages/               # Nuxt pages (index.vue)
├── tests/
│   ├── unit/           # Component unit tests
│   ├── e2e/            # Playwright E2E tests
│   └── utils/          # Test helpers and utilities
├── docs/               # Game design and implementation docs
├── assets/css/         # Global styles
└── public/             # Static assets
```

### Component Architecture

**UI Components** (Built with TDD/BDD approach):

- **`GameTitle.vue`** - Main game title with responsive typography and dark mode support
- **`ObjectiveDisplay.vue`** - Displays current game objective (e.g., "Prevent World War I") as a prominent card
- **`MessageInput.vue`** - Textarea with 160-character limit, real-time counter, and accessibility features
- **`SendButton.vue`** - Accessible send button with proper ARIA attributes and keyboard navigation
- **`MessageHistory.vue`** - Scrollable container for message history with empty state and accessibility
- **`MessagesCounter.vue`** - Badge display showing remaining messages (e.g., "Messages Remaining: 5")

Each component follows these principles:
- **Accessibility-first**: Proper ARIA labels, keyboard navigation, screen reader support
- **TypeScript**: Full type safety with explicit prop definitions
- **Nuxt UI integration**: Consistent styling with Tailwind CSS classes
- **Test coverage**: Unit tests (component behavior) + E2E tests (user experience)

### Pages Structure

- **`pages/index.vue`** - Main game interface integrating all components in a logical, hierarchical layout

### Testing Structure

- **`tests/unit/components/`** - Component unit tests following TDD Red-Green-Refactor cycles
- **`tests/e2e/features/`** - BDD scenario tests with Given/When/Then structure
- **`tests/utils/`** - Shared test utilities and helpers

### Configuration Files

- **`nuxt.config.ts`** - Nuxt 3 configuration with TypeScript and Nuxt UI
- **`vitest.config.ts`** - Unit testing configuration with Vue Test Utils integration
- **`playwright.config.ts`** - E2E testing configuration with browser automation
- **`tsconfig.json`** - TypeScript compiler configuration

## 🎯 Game Features (Planned)

### Phase 2: Core Game State
- Message counter and validation
- Historical figure selection
- Session management

### Phase 3: AI Integration  
- OpenAI API integration
- Dynamic historical figure responses
- Objective generation system

### Phase 4: Dice System
- D20 outcome resolution
- Success/failure mechanics
- Timeline effect calculation

### Phase 5: Polish & Deploy
- Enhanced UI/UX
- Performance optimization
- Production deployment

## 🤝 Contributing

We welcome contributions! This project uses a structured TDD/BDD approach:

1. **Fork** the repository
2. **Create a feature branch** following the established testing patterns
3. **Write tests first** (follow existing test structure in `tests/`)
4. **Implement features** to make tests pass
5. **Submit a pull request** with clear description

See existing tests in `tests/unit/components/` for examples of the testing approach.

### Development Workflow

This project follows **Test-Driven Development (TDD)** and **Behavior-Driven Development (BDD)** principles:

#### TDD Workflow (Red-Green-Refactor):
```bash
# 1. Write a failing unit test
npm run test  # Should show failing test

# 2. Write minimal code to make test pass
# Edit component/logic files

# 3. Verify test passes
npm run test  # Should show passing test

# 4. Refactor and improve
# Clean up code while keeping tests green
```

#### BDD Workflow (Given-When-Then):
```bash
# 1. Write BDD scenario in E2E test
# Given a user wants to [scenario]
# When they [action]
# Then they should [expected outcome]

# 2. Run E2E test to see it fail
npm run test:e2e

# 3. Implement feature to make scenario pass
# 4. Verify E2E test passes
npm run test:e2e
```

#### Daily Development Commands:
```bash
# Start development with live reloading
npm run dev

# Run tests in watch mode (separate terminals)
npm run test      # Unit tests
npm run test:e2e  # E2E tests (run as needed)

# Before committing changes
npm run build     # Verify TypeScript compilation
npm run test && npm run test:e2e  # Verify all tests pass
```

#### Adding New Components:
1. **Write failing unit test** in `tests/unit/components/ComponentName.spec.ts`
2. **Write failing E2E test** in `tests/e2e/features/feature-name.spec.ts` 
3. **Create component** in `components/ComponentName.vue`
4. **Implement to pass tests** (Red-Green-Refactor cycle)
5. **Verify coverage** with `npm run test -- --coverage`

#### Code Quality Standards:
- **TypeScript**: All components must be fully typed
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML
- **Testing**: >90% unit test coverage, comprehensive E2E scenarios
- **Styling**: Use Nuxt UI components consistently
- **Documentation**: JSDoc comments for complex logic

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎲 Play Philosophy

*"History is not a story of inevitability, but of contingency. Every message you send is a butterfly's wing—will it cause a hurricane, or will it disappear into the wind? The dice will decide."*
