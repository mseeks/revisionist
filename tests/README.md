# Testing Documentation - TDD/BDD Approach

## Overview

The Revisionist game project follows a comprehensive Test-Driven Development (TDD) and Behavior-Driven Development (BDD) approach to ensure code quality, maintainability, and user experience alignment.

## TDD/BDD Philosophy

This project implements a **test-first methodology** where:
- **Unit tests** are written before component implementation (TDD)
- **E2E tests** are written as BDD scenarios before feature development
- All code follows the Red-Green-Refactor cycle
- Tests serve as living documentation of expected behavior

## Testing Stack

- **Unit Testing**: Vitest + @vue/test-utils + happy-dom
- **E2E Testing**: Playwright + @nuxt/test-utils
- **Coverage**: Vitest coverage reports
- **Framework**: Nuxt 3 + TypeScript integration

## Red-Green-Refactor Cycles Followed

### 1. Red Phase (Write Failing Tests)
Every component development started with failing tests:

```typescript
// Example: GameTitle component TDD cycle
describe('GameTitle', () => {
  it('should render "Revisionist" title', () => {
    // This test FAILED initially (Red phase)
    const wrapper = mount(GameTitle)
    expect(wrapper.find('h1').text()).toBe('Revisionist')
  })
})
```

### 2. Green Phase (Minimal Implementation)
Write the simplest code to make tests pass:

```vue
<!-- Minimal implementation to pass the test -->
<template>
  <h1>Revisionist</h1>
</template>
```

### 3. Refactor Phase (Improve Without Breaking)
Enhanced implementation while keeping tests green:

```vue
<!-- Refactored with styling and proper structure -->
<template>
  <div class="text-center mb-8">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
      Revisionist
    </h1>
  </div>
</template>
```

## BDD Scenario Structure and Given/When/Then Patterns

### BDD Scenario Framework
All E2E tests follow the Given/When/Then structure:

```typescript
test('Complete game interface renders correctly', async ({ page }) => {
  // Given a user visits the game page
  await page.goto('/')
  
  // When the page loads
  await page.waitForLoadState('networkidle')
  
  // Then they should see all game interface elements
  await expect(page.locator('h1')).toContainText('Revisionist')
  await expect(page.locator('[data-testid="objective-display"]')).toBeVisible()
  await expect(page.locator('[data-testid="message-input"]')).toBeVisible()
  // ... additional assertions
})
```

### BDD Pattern Categories

#### 1. Interface Structure Scenarios
```typescript
// Given a user visits the game for the first time
// When the page loads completely  
// Then they should see all components in logical order
```

#### 2. User Interaction Scenarios
```typescript
// Given a user wants to send a message
// When they type in the message input
// Then they should see a real-time character counter
```

#### 3. Accessibility Scenarios
```typescript  
// Given a user navigates with keyboard only
// When they tab through interface elements
// Then all interactive elements should be accessible
```

## How to Run Different Test Types in Development

### Unit Tests (TDD)
```bash
# Run all unit tests
npm test

# Run unit tests in watch mode during development
npm test -- --watch

# Run specific component tests
npm test -- GameTitle

# Run tests with coverage
npm test -- --coverage
```

### E2E Tests (BDD)
```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific E2E test file
npm run test:e2e -- tests/e2e/features/game-interface.spec.ts

# Debug E2E tests
npm run test:e2e -- --debug
```

### Combined Test Runs
```bash
# Run all tests (unit + E2E)
npm test && npm run test:e2e

# Pre-commit test verification
npm run build && npm test && npm run test:e2e
```

## Test Coverage Requirements and Verification Process

### Coverage Targets
- **Unit Test Coverage**: >90% line coverage required
- **Component Coverage**: 100% of components must have unit tests
- **E2E Coverage**: All user journeys must have BDD scenarios

### Verification Commands
```bash
# Generate coverage report
npm test -- --coverage

# View coverage in browser
open coverage/index.html

# Check coverage meets requirements
npm test -- --coverage --reporter=verbose
```

### Coverage Verification Process
1. **Pre-implementation**: Write failing tests first
2. **During development**: Monitor coverage in watch mode
3. **Pre-commit**: Verify >90% coverage maintained
4. **CI/CD**: Automated coverage checks prevent regressions

### Coverage Exclusions
- Configuration files (`*.config.*`)
- Type definitions (`*.d.ts`)
- Test files themselves
- Build output directories

## TDD/BDD Workflow to Development Guidelines

### Component Development Workflow

#### 1. BDD Scenario Definition
```typescript
// Step 1: Define user scenario in E2E test
test('User can input message with character limit', async ({ page }) => {
  // Given a user wants to send a message
  // When they type in the message input
  // Then they should see character counter update
})
```

#### 2. TDD Unit Test Creation
```typescript
// Step 2: Write failing unit tests
describe('MessageInput', () => {
  it('should show character counter', () => {
    // Test fails - component doesn't exist yet
  })
})
```

#### 3. Red-Green-Refactor Implementation
```typescript
// Step 3: Implement to make tests pass
// Red: Tests fail
// Green: Minimal implementation
// Refactor: Improve while keeping tests green
```

#### 4. Integration Verification
```bash
# Step 4: Verify E2E scenario passes
npm run test:e2e -- --grep "character limit"
```

### Development Rules

1. **Never write production code without a failing test**
2. **Write only enough test to make it compile and fail**
3. **Write only enough production code to make the test pass**
4. **Always refactor after tests are green**
5. **E2E tests define user value, unit tests drive implementation**

### Git Workflow Integration
```bash
# Pre-commit hooks should run:
npm test -- --run         # Unit tests
npm run test:e2e          # E2E tests  
npm run build             # TypeScript compilation
```

## Testing File Structure

```
tests/
├── README.md                 # This documentation
├── unit/                     # TDD unit tests
│   ├── components/           # Component-specific tests
│   │   ├── GameTitle.nuxt.test.ts
│   │   ├── MessageInput.spec.ts
│   │   └── ...
│   └── setup-verification.nuxt.test.ts
├── e2e/                      # BDD E2E tests
│   └── features/             # Feature scenarios
│       └── game-interface.spec.ts
└── utils/                    # Test utilities
    └── test-helpers.ts
```

## Test Naming Conventions

### Unit Tests
- `*.nuxt.test.ts` - Nuxt-specific component tests
- `*.spec.ts` - Standard component/function tests
- `*.test.ts` - General unit tests

### E2E Tests  
- `*.spec.ts` - All E2E tests use spec extension
- Located in `features/` subdirectory
- Named after feature area (e.g., `game-interface.spec.ts`)

## Best Practices Learned

### TDD Best Practices
1. **Start with the simplest failing test**
2. **Make tests as specific as possible**
3. **Test behavior, not implementation details**
4. **Keep test setup minimal and focused**
5. **Use descriptive test names that explain expected behavior**

### BDD Best Practices
1. **Write scenarios from user perspective**
2. **Use Given/When/Then structure consistently**
3. **Focus on user value and outcomes**
4. **Test complete user journeys, not just technical functions**
5. **Use data-testid attributes for stable selectors**

### Integration Best Practices
1. **Unit tests drive component API design**
2. **E2E tests validate user experience**
3. **Both types of tests should be maintained together**
4. **Refactor tests along with production code**
5. **Use tests as documentation for future developers**

## Troubleshooting Common Issues

### Unit Test Issues
```bash
# Clear Nuxt cache if tests fail unexpectedly
rm -rf .nuxt

# Restart test runner if hot reload breaks
npm test -- --run
```

### E2E Test Issues
```bash
# Update Playwright browsers
npx playwright install

# Run with debug to see what's happening
npm run test:e2e -- --debug --headed
```

### Coverage Issues
```bash
# Generate detailed coverage report
npm test -- --coverage --reporter=lcov --reporter=text
```

This testing approach ensures that the Revisionist game maintains high quality, user-focused features, and sustainable development practices throughout all phases of the project.
