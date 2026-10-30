# Toolshop Test Automation: Playwright + Cucumber BDD (Gherkin)

> **Status: work in progress (Phase 3 of 10 complete).** Full README with live Allure report link, badges, architecture diagram and metrics arrives in Phase 9.

UI, API and hybrid test automation for [Practice Software Testing (Toolshop)](https://practicesoftwaretesting.com) written as Gherkin features and executed with Playwright through `playwright-bdd`. Reports are built with Allure.

## Quick start

```bash
npm install
npx playwright install
cp .env.example .env     # on Windows: copy .env.example .env
npm test                 # generates specs from features, runs on Chromium, Firefox, WebKit
npm run report:allure && npm run report:allure:open
```

Requires Node.js 22 or newer.

## Planning documents

- [TEST_AUTOMATION_PLAN.md](TEST_AUTOMATION_PLAN.md): strategy, scope, framework design, phases
- [DISCOVERY_FINDINGS.md](DISCOVERY_FINDINGS.md): verified facts about the application under test
- [docs/test-cases/Toolshop_Test_Cases_Xray.xlsx](docs/test-cases/Toolshop_Test_Cases_Xray.xlsx): test cases in Jira Xray (Cucumber) format
- [features/](features/): the same scenarios as Gherkin feature files

## Current state

Implemented and passing on Chromium, Firefox and WebKit (63 runs): framework sanity, all 9 authentication scenarios (login, logout, registration, forgot password) and the authentication API scenarios. The remaining feature files are written; their step definitions arrive phase by phase.

| Layer            | Where           |
| ---------------- | --------------- |
| Gherkin features | `features/`     |
| Step definitions | `src/steps/`    |
| Page objects     | `src/pages/`    |
| API clients      | `src/api/`      |
| Fixtures         | `src/fixtures/` |
