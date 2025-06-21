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

**Current Phase**: Phase 1 - Foundation Setup ✅

- ✅ **Nuxt 3 + TypeScript** foundation
- ✅ **Nuxt UI** component library integration  
- ✅ **Comprehensive test suite** (Vitest + Playwright)
- ✅ **Core UI components** with TDD/BDD approach
- ✅ **Game interface layout** fully implemented

**Next Phase**: Phase 2 - Core Game State (Pinia store, message flow, validation)

See [POC Implementation Plan](docs/POC_IMPLEMENTATION_PLAN.md) for the complete 5-phase roadmap.

## 🛠️ Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) with TypeScript
- **UI Library**: [Nuxt UI](https://ui.nuxt.com/) (Tailwind CSS + Headless UI)
- **Testing**: [Vitest](https://vitest.dev/) (unit) + [Playwright](https://playwright.dev/) (E2E)
- **AI Integration**: OpenAI API (planned for Phase 3)
- **State Management**: Pinia (planned for Phase 2)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, pnpm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/revisionist.git
cd revisionist

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the game interface.

### Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run unit tests (Vitest)
npm run test:e2e         # Run E2E tests (Playwright)
```

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

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎲 Play Philosophy

*"History is not a story of inevitability, but of contingency. Every message you send is a butterfly's wing—will it cause a hurricane, or will it disappear into the wind? The dice will decide."*
