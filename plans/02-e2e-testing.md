# Implementation Plan: Phase 4 - Cucumber JS + Playwright E2E Testing

## Overview

Add end-to-end testing to the TypeScript Next.js starter using Cucumber JS for BDD-style Gherkin scenarios and Playwright for browser automation. This phase builds on the completed Phase 1-3 (initial setup with Vitest).

## Context

**Completed in Phase 1-3:**
- Next.js 16 with TypeScript, Tailwind CSS, App Router
- Vitest + React Testing Library for unit/integration tests
- Simple home page with welcome heading and project description
- 6 atomic commits following CLAUDE.md principles

**Current State:**
- Home page at `app/page.tsx` displays:
  - H1: "Welcome to Next.js"
  - Paragraph: "A TypeScript Next.js starter with Vitest and Tailwind CSS"
- Package manager: pnpm
- No E2E testing infrastructure yet

## Key Architectural Decisions

### 1. Cucumber JS + Playwright Integration

**Rationale**:
- **Cucumber JS**: Business-readable Gherkin scenarios make tests accessible to non-developers
- **Playwright**: Modern, reliable browser automation with built-in waiting and cross-browser support
- **Integration**: Use `@cucumber/cucumber` with custom Playwright world/context

### 2. Directory Structure

```
features/
├── home.feature              # Gherkin scenarios
├── page_objects/
│   ├── BasePage.ts          # Base page object with common methods
│   └── HomePage.ts          # Home page object with page-specific methods
├── step_definitions/
│   ├── common.steps.ts      # Reusable steps (Given, When, Then)
│   └── home.steps.ts        # Home page-specific steps using page objects
└── support/
    ├── world.ts             # Custom Cucumber World with Playwright
    └── hooks.ts             # Before/After hooks for browser lifecycle
```

### 3. Page Object Model (POM) Pattern

**Rationale**:
- **Encapsulation**: Page-specific selectors and actions are encapsulated in page classes
- **Maintainability**: Changes to UI only require updates to page objects, not step definitions
- **Reusability**: Page methods can be reused across multiple step definitions
- **Readability**: Step definitions become more readable and expressive

### 4. Configuration Strategy

- **cucumber.config.js**: ESM format for compatibility with TypeScript
- **Playwright browsers**: Chromium only initially (can add Firefox/WebKit later)
- **Base URL**: `http://localhost:3000` (Next.js dev server)
- **Parallel execution**: Support via Cucumber's `--parallel` flag

### 5. BDD Testing Pattern with POM

Every E2E scenario follows:
1. **Feature file** (`.feature`) with Gherkin scenarios
2. **Page objects** (`.ts`) encapsulating page structure and interactions
3. **Step definitions** (`.steps.ts`) using page objects to implement Gherkin steps
4. **Support files** for shared setup (World, hooks)

## Implementation Phases (6 Commits)

### Phase 1: Playwright Setup (2 commits)

1. **`test: add Playwright dependencies`**
   - Install: `pnpm add -D @playwright/test`
   - Run: `pnpm exec playwright install chromium`
   - Installs Chromium browser binaries

2. **`test: add Cucumber JS dependencies`**
   - Install: `pnpm add -D @cucumber/cucumber @cucumber/pretty-formatter ts-node`
   - Cucumber core, formatters, and TypeScript support

### Phase 2: Cucumber Configuration (2 commits)

3. **`test: configure Cucumber with Playwright integration`**
   - File: `cucumber.config.js` - Configure feature paths, step definitions, formatters
   - File: `features/support/world.ts` - Custom World class with Playwright browser/page
   - File: `features/support/hooks.ts` - Before/After hooks for browser lifecycle
   - File: `features/page_objects/BasePage.ts` - Base page object with common methods
   - Create directory structure: `features/`, `features/step_definitions/`, `features/support/`, `features/page_objects/`

4. **`test: add E2E test scripts to package.json`**
   - Add: `"test:e2e": "cucumber-js"`
   - Add: `"test:e2e:parallel": "cucumber-js --parallel 2"`
   - Update README to document E2E testing

### Phase 3: E2E Test Implementation (2 commits)

5. **`test(e2e): add pending feature for home page`**
   - File: `features/home.feature` - Gherkin scenario with `@skip` tag
   - Scenario: User visits home page and sees welcome message
   - Documents expected E2E behavior

6. **`test(e2e): implement page objects and step definitions for home page`**
   - File: `features/page_objects/HomePage.ts` - Home page object with selectors and methods
   - File: `features/step_definitions/home.steps.ts` - Step definitions using HomePage
   - File: `features/step_definitions/common.steps.ts` - Reusable navigation steps
   - Remove `@skip` tag from feature file
   - Verify E2E test passes

## Detailed Implementation

### Commit 1: Playwright Dependencies

**Install Playwright:**
```bash
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

**Verification**: Chromium browser downloaded to `~/.cache/ms-playwright`

---

### Commit 2: Cucumber Dependencies

**Install Cucumber:**
```bash
pnpm add -D @cucumber/cucumber @cucumber/pretty-formatter ts-node
```

**Dependencies:**
- `@cucumber/cucumber`: Core Cucumber framework
- `@cucumber/pretty-formatter`: Readable test output
- `ts-node`: Run TypeScript step definitions directly

---

### Commit 3: Cucumber Configuration

**File: `cucumber.config.js`**
```javascript
export default {
  require: ['features/**/*.ts'],
  requireModule: ['ts-node/register'],
  format: [
    'progress-bar',
    '@cucumber/pretty-formatter',
    'html:cucumber-report.html'
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  },
  publishQuiet: true
};
```

**File: `features/support/world.ts`**
```typescript
import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async cleanup() {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
```

**File: `features/support/hooks.ts`**
```typescript
import { Before, After } from '@cucumber/cucumber';
import { CustomWorld } from './world';

Before(async function (this: CustomWorld) {
  await this.init();
});

After(async function (this: CustomWorld) {
  await this.cleanup();
});
```

**File: `features/page_objects/BasePage.ts`**
```typescript
import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}
```

**Directory structure created:**
- `features/`
- `features/step_definitions/`
- `features/support/`
- `features/page_objects/`

---

### Commit 4: E2E Scripts

**Update `package.json`:**
```json
{
  "scripts": {
    "test:e2e": "cucumber-js",
    "test:e2e:parallel": "cucumber-js --parallel 2"
  }
}
```

**Update `README.md`:**
Add E2E testing section with usage instructions.

---

### Commit 5: Pending Feature

**File: `features/home.feature`**
```gherkin
@skip
Feature: Home Page
  As a user
  I want to visit the home page
  So that I can see the welcome message

  Scenario: User sees welcome message
    Given I am on the home page
    Then I should see the heading "Welcome to Next.js"
    And I should see the text "A TypeScript Next.js starter with Vitest and Tailwind CSS"
```

**Verification**: Running `pnpm test:e2e` shows skipped scenario

---

### Commit 6: Implement Page Objects and Step Definitions

**File: `features/page_objects/HomePage.ts`**
```typescript
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private readonly heading = this.page.locator('h1');
  private readonly description = this.page.locator('p');

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.goto('http://localhost:3000');
    await this.waitForPageLoad();
  }

  async getHeadingText(): Promise<string> {
    return await this.heading.textContent() || '';
  }

  async verifyHeading(expectedText: string) {
    await expect(this.heading).toHaveText(expectedText);
  }

  async verifyTextVisible(text: string) {
    await expect(this.page.locator(`text=${text}`)).toBeVisible();
  }
}
```

**File: `features/step_definitions/common.steps.ts`**
```typescript
import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { HomePage } from '../page_objects/HomePage';

Given('I am on the home page', async function (this: CustomWorld) {
  const homePage = new HomePage(this.page!);
  await homePage.navigate();
});
```

**File: `features/step_definitions/home.steps.ts`**
```typescript
import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { HomePage } from '../page_objects/HomePage';

Then('I should see the heading {string}', async function (this: CustomWorld, text: string) {
  const homePage = new HomePage(this.page!);
  await homePage.verifyHeading(text);
});

Then('I should see the text {string}', async function (this: CustomWorld, text: string) {
  const homePage = new HomePage(this.page!);
  await homePage.verifyTextVisible(text);
});
```

**Update `features/home.feature`:** Remove `@skip` tag

**Verification**:
```bash
pnpm dev & # Start Next.js dev server
pnpm test:e2e # Run E2E tests - should pass
```

## Critical Files

1. **`cucumber.config.js`** - Cucumber configuration
2. **`features/support/world.ts`** - Custom World with Playwright integration
3. **`features/support/hooks.ts`** - Browser lifecycle management
4. **`features/page_objects/BasePage.ts`** - Base page object class
5. **`features/page_objects/HomePage.ts`** - Home page object with selectors and methods
6. **`features/home.feature`** - Gherkin scenarios
7. **`features/step_definitions/common.steps.ts`** - Reusable steps using page objects
8. **`features/step_definitions/home.steps.ts`** - Home page steps using HomePage

## Verification at Each Commit

- [ ] Code compiles (TypeScript check)
- [ ] Dependencies install successfully
- [ ] Cucumber can discover feature files
- [ ] E2E tests pass (skipped tests don't break suite)
- [ ] Commit represents one logical change
- [ ] Commit message follows CLAUDE.md conventions

## Commit Message Format

```
<type>(scope): <short summary>

<optional body explaining what and why>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

Types: `test`, `chore`, `docs`

## Testing Strategy

### BDD with Page Object Model

**Feature files** (`.feature`):
- Written in business language
- Describe user behaviors, not implementation
- Use Given/When/Then structure

**Page objects** (`.ts`):
- Encapsulate page structure (selectors)
- Provide high-level methods for page interactions
- Inherit from BasePage for common functionality
- One page object per page/component

**Step definitions** (`.steps.ts`):
- Use page objects to interact with the application
- Keep step definitions thin - delegate to page objects
- Focus on test flow, not implementation details
- Reuse page objects across multiple steps

**Example Architecture**:
```typescript
// Page Object - encapsulates "how"
class HomePage {
  async verifyHeading(text: string) {
    await expect(this.heading).toHaveText(text);
  }
}

// Step Definition - describes "what"
Then('I should see the heading {string}', async function(text: string) {
  const homePage = new HomePage(this.page);
  await homePage.verifyHeading(text);
});

// Feature - describes "why" in business language
Scenario: User sees welcome message
  Then I should see the heading "Welcome to Next.js"
```

## Key Benefits

1. **BDD Approach**: Business-readable test specifications with Gherkin
2. **Page Object Model**: Maintainable, reusable page abstractions
3. **Separation of Concerns**: Test logic separated from page structure
4. **Reliable E2E**: Playwright's auto-waiting reduces flakiness
5. **Reusable Components**: Page objects and steps shared across features
6. **Parallel Execution**: Cucumber supports parallel test runs
7. **Cross-browser**: Easy to add Firefox/WebKit later

## Dependencies

### New Dependencies (Commit-by-Commit)

**Commit 1:**
- `@playwright/test` - Playwright testing library
- Chromium browser binaries

**Commit 2:**
- `@cucumber/cucumber` - Cucumber core
- `@cucumber/pretty-formatter` - Better test output
- `ts-node` - TypeScript execution

**Total new devDependencies**: 3

## Next Steps After Completion

After Phase 4, the project will have:
- Full E2E testing with Cucumber + Playwright
- BDD workflow for writing user scenarios
- Foundation for adding more complex E2E tests

Ready for **Phase 5: CI/CD Setup** which will:
- Add GitHub Actions workflows for parallel testing
- Separate workflows for build, unit tests, and E2E tests
- Run E2E tests in CI with Playwright browsers

## Estimated Completion

**Total**: 6 commits
**Time**: 45-60 minutes for careful implementation

## Prerequisites

- Next.js dev server must be running for E2E tests (`pnpm dev`)
- Or use Playwright's `webServer` config to auto-start (can add in Phase 5)

---

*This plan strictly follows the atomic commit philosophy from CLAUDE.md, ensuring every commit is a checkpoint where code builds and tests pass.*
