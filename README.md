# learn-claude-code

A TypeScript Next.js starter project for learning Claude Code, built with modern best practices and comprehensive testing setup.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Linting**: [ESLint](https://eslint.org/) with Next.js config
- **Testing**: Vitest + React Testing Library (unit/integration), Cucumber + Playwright (E2E) - _Coming soon_

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm 8.x or higher

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Create optimized production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run unit tests with Vitest
- `pnpm test:ui` - Run tests with Vitest UI
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:e2e` - Run E2E tests with Cucumber + Playwright
- `pnpm test:e2e:parallel` - Run E2E tests in parallel (2 workers)

## Project Structure

```
learn-claude-code/
├── app/                  # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # React components
│   └── __tests__/      # Component tests
├── lib/                 # Shared utilities
│   └── __tests__/      # Utility tests
├── features/            # Cucumber E2E tests (coming soon)
├── public/              # Static assets
├── .github/workflows/   # CI/CD workflows (coming soon)
└── ...config files
```

## Testing

### Unit & Integration Tests

Tests are written using Vitest and React Testing Library. Tests are co-located with source files in `__tests__` directories.

```bash
# Run tests (coming soon)
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### E2E Tests

End-to-end tests use **Cucumber.js** with **Playwright** for BDD-style testing with Gherkin syntax. Tests are organized using the Page Object Model (POM) pattern.

**Prerequisites**: Start the Next.js dev server before running E2E tests.

```bash
# Start dev server in one terminal
pnpm dev

# Run E2E tests in another terminal
pnpm test:e2e

# Run E2E tests in parallel
pnpm test:e2e:parallel
```

**Directory structure**:
- `features/*.feature` - Gherkin scenarios (business-readable test specs)
- `features/page_objects/` - Page Object Model classes
- `features/step_definitions/` - Step implementations using page objects
- `features/support/` - Test configuration and hooks

## Development Workflow

This project follows atomic commit principles as defined in `CLAUDE.md`:

- Small, logically-scoped commits
- Test-driven development (TDD)
- Each commit keeps the project buildable and tests passing
- Clear separation of concerns (no mixing of refactoring, features, tests)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)

## License

This project is created for learning purposes.
