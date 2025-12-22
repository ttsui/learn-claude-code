# Implementation Plan: TypeScript Next.js Starter Application

## Overview

Create a production-ready TypeScript Next.js boilerplate with App Router, comprehensive testing setup (Vitest + Playwright), starting from create-next-app and building out with atomic commits per CLAUDE.md guidelines.

## Key Architectural Decisions

### 1. Start with create-next-app

**Rationale**: Standard Next.js initialization provides a solid foundation. After the initial scaffold, all subsequent changes follow atomic commit principles.

### 2. Project Structure

```
/Users/tony.tsui/workspace/learning/learn-claude-code/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout (required)
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles + Tailwind
├── components/            # React components
│   └── __tests__/        # Component tests (co-located)
├── lib/                   # Shared utilities
│   └── __tests__/        # Utility tests
├── features/              # Cucumber E2E tests
│   ├── step_definitions/ # Playwright step implementations
│   ├── support/          # Cucumber support files
│   └── *.feature         # Gherkin feature files
├── public/                # Static assets
├── .github/workflows/     # CI/CD
├── package.json
├── pnpm-lock.yaml         # pnpm lockfile
├── tsconfig.json
├── next.config.ts
├── vitest.config.ts
├── vitest.setup.ts
└── cucumber.config.js
```

### 3. Testing Strategy (2-Tier)

- **Unit/Integration Tests**: Vitest + React Testing Library (component logic, utilities, multi-component interactions)
- **E2E Tests**: Cucumber JS + Playwright (BDD-style full user workflows with Gherkin syntax)

**Why Vitest**: Faster than Jest, better ESM support, native TypeScript, Vite-powered with instant HMR for tests.

**Why Cucumber JS**: Behavior-driven development with Gherkin scenarios, business-readable test specs, clear separation of test steps and implementation.

### 4. TDD Workflow

Every feature follows: **Pending Test → Implementation → Refactoring** (3 separate commits)

## Implementation Phases (6 Commits - Initial Setup)

**Note**: This plan covers the initial project setup and unit testing. Phase 4 (E2E Testing) and Phase 5 (CI/CD) will be implemented in separate follow-up plans.

### Phase 1: Project Initialization (1 commit)

1. **`chore: initialize Next.js project with create-next-app`**
   - Run: `pnpm create next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"`
   - Creates complete scaffold: `app/`, `public/`, config files
   - Initial files: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
   - Generates `pnpm-lock.yaml`
   - **App is immediately runnable**: `pnpm dev` works

### Phase 2: Clean Up Scaffold (2 commits)

2. **`refactor(app): simplify home page to minimal starter`**
   - File: `app/page.tsx`
   - Remove boilerplate content, create clean starting point

3. **`docs: update README with project information`**
   - File: `README.md`
   - Replace default create-next-app README with custom docs

### Phase 3: Vitest Testing Setup (3 commits)

4. **`test: setup Vitest with React Testing Library`**
   - Install: `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
   - File: `vitest.config.ts` - Configure path aliases, jsdom environment, React plugin
   - File: `vitest.setup.ts` - Import `@testing-library/jest-dom` for custom matchers
   - Update `package.json` scripts: `"test": "vitest"`, `"test:ui": "vitest --ui"`, `"test:coverage": "vitest --coverage"`

5. **`test(app): add pending test for home page component`**
   - File: `app/__tests__/page.test.tsx`
   - Test that home page renders correctly

6. **`refactor(app): update home page to pass tests`**
   - Update `app/page.tsx` if needed
   - Enable test from commit #5

---

## Future Plans

### Phase 4: Cucumber JS + Playwright E2E Setup (Separate Plan)

This will be implemented in a follow-up plan and will include:

- Installing Playwright and Cucumber JS dependencies
- Configuring Cucumber with Playwright integration
- Creating feature file directory structure
- Writing Gherkin scenarios for home page
- Implementing step definitions with Playwright
- Adding E2E test scripts to package.json

**Estimated commits**: 6

### Phase 5: CI/CD Setup (Separate Plan)

This will be implemented in a follow-up plan and will include:

- Creating `.github/workflows/build.yml` for build validation
- Creating `.github/workflows/test.yml` for unit/integration tests
- Creating `.github/workflows/e2e.yml` for E2E tests
- All workflows will run in parallel with pnpm caching
- Triggers: push to main, pull_request synchronize

**Estimated commits**: 3

## Critical Files (This Plan)

1. **`package.json`** - Created by create-next-app, modified for test scripts
2. **`vitest.config.ts`** - Vitest configuration for Next.js compatibility
3. **`vitest.setup.ts`** - Vitest setup file with testing-library matchers
4. **`app/page.tsx`** - Home page component (tested with Vitest)
5. **`app/__tests__/page.test.tsx`** - Home page unit tests

## Critical Files (Future Plans)

**Phase 4 - E2E Testing:**

- `cucumber.config.js` - Cucumber JS configuration
- `features/home.feature` - Gherkin feature file for home page
- `features/step_definitions/home.steps.ts` - Playwright-based step implementations

**Phase 5 - CI/CD:**

- `.github/workflows/build.yml` - Build workflow (runs in parallel)
- `.github/workflows/test.yml` - Unit/integration test workflow (runs in parallel)
- `.github/workflows/e2e.yml`\*\* - E2E test workflow (runs in parallel)

## TDD Example Pattern

For each feature:

```
1. test(scope): add pending test for [feature]
   - Create test with .skip() or .todo()
   - Commit

2. feat(scope): implement [feature]
   - Write code to pass test
   - Enable test
   - Commit

3. refactor(scope): [improvement]
   - Refactor while tests stay green
   - Commit (if changes made)
```

## Verification at Each Commit

- [ ] Code compiles (or gracefully doesn't with clear reason)
- [ ] Tests pass (including pending tests not breaking suite)
- [ ] Commit represents one logical change
- [ ] Commit message follows CLAUDE.md conventions

## Commit Message Format

```
<type>(<scope>): <short summary>

<optional body explaining what and why>
```

Types: `feat`, `fix`, `test`, `refactor`, `docs`, `chore`, `ci`, `style`

## Key Benefits

1. **Educational**: Each commit teaches one concept
2. **Reviewable**: Small, focused changes
3. **Reversible**: Independent commits can be reverted
4. **Debuggable**: `git bisect` friendly
5. **Exemplary**: Demonstrates CLAUDE.md philosophy

## Next Steps After Completion

The boilerplate will be ready for:

- Feature development (auth, database, API routes)
- Advanced testing (visual regression, a11y)
- Production readiness (env vars, error boundaries, monitoring)

## Estimated Completion (This Plan)

**Total**: 6 commits
**Time**: 30-45 minutes for careful implementation

## Future Plan Estimates

- **Phase 4 (E2E Testing)**: 6 commits, ~45-60 minutes
- **Phase 5 (CI/CD)**: 3 commits, ~30 minutes

**Overall Total**: 15 commits across 3 plans

---

_This plan strictly follows the atomic commit philosophy from CLAUDE.md, ensuring every commit is a checkpoint where code builds and tests pass._
