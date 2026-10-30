# ADR 0001: Page objects, API clients and fixtures behind Gherkin steps

**Status:** accepted

## Context

The scenarios are written in Gherkin and run through `playwright-bdd`, so step definitions are the only code a feature file touches. If steps held selectors and HTTP calls, every UI change would mean editing many steps and the steps would be hard to read.

## Decision

- **Page objects** (`src/pages/`) own locators and page-level actions. They use `getByTestId` with the site's `data-test` attribute (`testIdAttribute` is set in `playwright.config.js`).
- **API clients** (`src/api/`) own endpoints and request shapes.
- **Fixtures** (`src/fixtures/index.js`) hand both to steps. They are lazy: a scenario only creates the page objects and clients its steps use.
- **Steps** (`src/steps/`) are thin: call a page object or client, then assert.
- A per-scenario `ctx` fixture carries values between steps instead of module-level state.

## Consequences

- A changed locator is fixed in one place.
- Steps stay readable and reusable across features.
- Parallel scenarios cannot share state by accident.
- The cost is one more layer to learn; [CONTRIBUTING.md](../../CONTRIBUTING.md) describes where each thing goes.
