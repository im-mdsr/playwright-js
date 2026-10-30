# Test Automation Plan v2: Playwright (JavaScript) Portfolio Framework

**Status:** DRAFT v2 – decisions from review round 1 applied; for final sign-off
**Goal:** A public GitHub repo that a recruiter or hiring manager can open for 3 minutes and conclude: _"This person builds production-grade automation."_

---

## 0. Decisions Locked from Review 1

| #   | Question              | Decision                                                                                                                   |
| --- | --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | Language              | Plain JavaScript (Node 20 LTS), CommonJS                                                                                   |
| 2   | Target site           | **Practice Software Testing – "Toolshop"** (UI + public REST API) as the primary AUT. See §1                               |
| 3   | Browsers              | Chromium, Firefox, WebKit                                                                                                  |
| 4   | Known-bug tests       | Included, isolated and documented (§7.8)                                                                                   |
| 5   | Failure evidence      | Screenshot + trace + video on failure, attached to Allure                                                                  |
| 6   | Reporting             | **Allure**, published to GitHub Pages on every main-branch run                                                             |
| 7   | Repo                  | You create a new GitHub repo; I scaffold locally                                                                           |
| 8   | Pre-commit hooks      | Yes, but lightweight (Husky + lint-staged: ESLint + Prettier). Cheap, and it signals engineering discipline to reviewers   |
| 9   | Test style (review 2) | **Cucumber BDD (Gherkin)**. Test cases are written as `.feature` files and the same Gherkin is in the Xray Excel. See §4.1 |
| 10  | Confirmed (review 2)  | Toolshop is the AUT; demo GIF in README; Dockerfile included; GitHub repo name supplied later                              |

---

## 1. Why Toolshop (and not just SauceDemo)

SauceDemo is the most common practice site, so it appears in thousands of portfolios and says little about the candidate. Toolshop is a better portfolio target:

| Criterion              | SauceDemo         | **Toolshop**                                                                                              |
| ---------------------- | ----------------- | --------------------------------------------------------------------------------------------------------- |
| UI complexity          | Small, 6 products | Real e-commerce: search, filters, pagination, categories, registration, favorites, invoices, contact form |
| Public API             | None              | Yes (REST + Swagger/OpenAPI) → enables **API + UI hybrid testing**                                        |
| Auth model             | Hardcoded users   | Real JWT login, registration                                                                              |
| Differentiation        | Low               | High                                                                                                      |
| Stability / maintained | Yes               | Yes (actively maintained open-source project)                                                             |

**Strategy:** Toolshop is the primary AUT. SauceDemo is _not_ used, to keep the repo focused. (Can be added later as a small `legacy-demo` project if you want.)

> **Verification gate:** URLs, credentials, endpoints and locators below are from public knowledge of the project and will be verified live in Phase 1 before any code is written. If Toolshop turns out to be unstable, the fallback is SauceDemo (UI) + a separate public API.

- UI: https://practicesoftwaretesting.com
- API: https://api.practicesoftwaretesting.com (docs at `/api/documentation`)
- Demo customer account is published on the site's login page (kept in `.env.example`, not hardcoded in specs).

---

## 2. The "Recruiters Can't Deny" Checklist

This is the acceptance bar for the repo as a _product_, not only as code. Each item is a deliverable.

### 2.1 First impression (README, the 3-minute test)

- [ ] Badges: CI status, Allure report (live), Node version, Playwright version, license
- [ ] One-paragraph pitch + **screenshot/GIF of the Allure dashboard**
- [ ] **Live Allure report link** (GitHub Pages) – recruiters can click without cloning
- [ ] Architecture diagram (Mermaid, rendered natively on GitHub)
- [ ] Key metrics table: # tests, browsers, pass rate, avg. run time, flaky rate
- [ ] "Run it in 3 commands" quick start
- [ ] "Skills demonstrated" section mapping directly to job-description keywords (Playwright, POM, API testing, CI/CD, Allure, a11y, data-driven, parallelization, sharding)
- [ ] "Design decisions" section linking to ADRs (why POM + fixtures, why API seeding, why storageState)

### 2.2 Engineering signals

- [ ] Page Object Model + custom fixtures (clean specs, zero raw selectors)
- [ ] **API + UI hybrid:** test data seeded/cleaned via API, UI tests only exercise UI behaviour → faster, less flaky
- [ ] Standalone **API test suite** (status, schema, negative, auth)
- [ ] **Schema validation** of API responses (Ajv)
- [ ] **Accessibility checks** (`@axe-core/playwright`) on key pages
- [ ] **Visual regression** on a few stable components (`toHaveScreenshot`)
- [ ] Network mocking/interception for resilience tests (500s, slow responses, empty states)
- [ ] Data-driven tests, tags (`@smoke @regression @api @a11y @visual @known-bug`)
- [ ] Parallel execution + **sharding in CI**
- [ ] Zero `waitForTimeout`, zero test interdependence (enforced by lint + `--repeat-each` job)
- [ ] ESLint (`eslint-plugin-playwright`) + Prettier + Husky pre-commit
- [ ] Optional Dockerfile (official Playwright image) for reproducible runs

### 2.3 Process signals

- [ ] CI on PR (smoke, fast) + nightly (full, 3 browsers, sharded) + manual dispatch
- [ ] Allure history preserved between runs (trend graph shows stability over time)
- [ ] Branch protection + PR template + conventional commits (visible commit history, not one giant commit)
- [ ] `docs/` folder: test strategy, test case matrix (CSV/MD traceability), ADRs, bug reports for known defects
- [ ] CONTRIBUTING.md (how to add a test), LICENSE (MIT)
- [ ] Tagged release `v1.0.0` with changelog

### 2.4 Honesty signals (these build trust)

- Known failing/defect tests are _declared_ (`test.fail()` with linked bug note), not hidden.
- README states what is out of scope and why.

---

## 3. Scope

### In scope

| Layer              | Coverage                                                                                                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **UI**             | Auth (login/logout/register), product catalog (search, filter, sort, pagination), product detail, cart, checkout (login → address → payment → confirmation), favorites, user profile, contact form, navigation |
| **API**            | Products, categories, brands, auth (token), users, cart/invoices where available; positive, negative, schema, auth-required                                                                                    |
| **Hybrid**         | API-created users/tokens injected into UI sessions; UI action verified via API                                                                                                                                 |
| **Non-functional** | Accessibility (axe), visual snapshots (select pages), basic resilience via network mocking                                                                                                                     |
| **Cross-browser**  | Chromium, Firefox, WebKit (full regression nightly; smoke on PR runs Chromium only)                                                                                                                            |

### Out of scope

- Load/performance and security testing; payment gateway real integrations; email delivery.

---

## 4. Tech Stack

| Concern    | Choice                                                                         |
| ---------- | ------------------------------------------------------------------------------ |
| Runner     | `@playwright/test` (latest stable at scaffold time, pinned)                    |
| BDD layer  | **`playwright-bdd`** (Gherkin features compiled to Playwright specs). See §4.1 |
| Language   | JavaScript, Node 20 LTS, CommonJS                                              |
| Patterns   | Page Object Model, fixtures, API client wrapper                                |
| Reporting  | `allure-playwright` + `allure-commandline`; Playwright HTML as secondary       |
| API schema | `ajv`                                                                          |
| A11y       | `@axe-core/playwright`                                                         |
| Data       | `@faker-js/faker` for unique users, JSON for static data                       |
| Config     | `dotenv`                                                                       |
| Quality    | ESLint, `eslint-plugin-playwright`, Prettier, Husky, lint-staged               |
| CI         | GitHub Actions + GitHub Pages (Allure)                                         |

---

### 4.1 BDD approach (Cucumber style)

**Choice: `playwright-bdd` rather than classic `@cucumber/cucumber` + Playwright library.**

|                                                                                                                           | `playwright-bdd` (chosen)       | `@cucumber/cucumber` + Playwright |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | --------------------------------- |
| Gherkin, `Given/When/Then`, Scenario Outline, tags                                                                        | Yes                             | Yes                               |
| Playwright test runner features (parallel, sharding, retries, traces, projects for 3 browsers, `request` fixture for API) | **Yes, native**                 | Must be rebuilt by hand           |
| Playwright fixtures in step definitions                                                                                   | Yes                             | No (uses World object)            |
| Allure                                                                                                                    | `allure-playwright` works as is | Separate cucumber formatter       |
| Same-repo plain Playwright tests (API, a11y, visual)                                                                      | Yes                             | Awkward                           |

If you specifically want the original `@cucumber/cucumber` runner, say so and I will switch; the Gherkin files do not change.

**How it works**

- `features/**/*.feature` hold the scenarios (already generated, 61 scenarios in 36 files, 11 of them Scenario Outlines).
- `src/steps/*.steps.js` hold step definitions, grouped by domain (`auth.steps.js`, `catalog.steps.js`, `cart.steps.js`, `checkout.steps.js`, `api.steps.js` ...). Steps call page objects and API clients; **no selectors and no business logic in steps**.
- `src/fixtures/` provides the Playwright fixtures that steps receive (pages, API client, `newUser`, cart seeding) via `createBdd(test)`.
- `npx bddgen` compiles features into specs under `.features-gen/` (git-ignored); `npx playwright test` runs them. One npm script does both.
- Tags in feature files (`@AUTH-01 @smoke @regression @ui`) drive suite selection (`--grep @smoke`) and appear in Allure; the `@ID` tag links each scenario to its Xray test.
- Step vocabulary is kept small and reusable (declarative, user-intent wording, no UI mechanics like "click the button with id…"). A reviewer can read a feature file with no coding knowledge.
- Where a check is not business-readable (accessibility, visual snapshot, network mocking), the Gherkin stays thin and the detail lives in the step implementation.

**Xray alignment:** the Excel uses Xray's _Cucumber_ test type (`Cucumber Type` + `Cucumber Scenario` columns); the same Gherkin is generated into `/features`. Long term the `.feature` files are the master and the Excel is re-exported from them.

## 5. Project Structure

```
playwright-javascript/
├── .github/
│   ├── workflows/ci-pr.yml  nightly.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── test-strategy.md
│   ├── test-case-matrix.md        # traceability: requirement → test ID → spec file
│   ├── adr/ 0001-pom-and-fixtures.md  0002-api-seeding.md  0003-allure.md
│   ├── known-defects.md           # backs the @known-bug tests
│   └── images/                    # allure screenshot, architecture
├── src/
│   ├── pages/        BasePage, HomePage, LoginPage, RegisterPage, ProductPage,
│   │                 CartPage, CheckoutPage, FavoritesPage, ProfilePage, ContactPage
│   │   └── components/  Header, ProductCard, Filters, Pagination
│   ├── api/          ApiClient.js, ProductsApi.js, UsersApi.js, AuthApi.js
│   ├── fixtures/     index.js  (pages, api clients, authedPage, newUser)
│   ├── schemas/      product.schema.json, user.schema.json ...
│   ├── data/         static JSON (checkout addresses, search terms)
│   └── utils/        dataFactory.js, price.js, logger.js
├── features/                  # Gherkin: THE test cases (already generated, 36 files)
│   ├── ui/ auth/ catalog/ product/ cart/ checkout/ favorites/ profile/ contact/
│   ├── api/  hybrid/  a11y/  visual/  resilience/  known-bugs/
├── src/steps/                 # step definitions by domain (auth, catalog, cart, checkout, api, quality)
├── .features-gen/             # generated by bddgen, git-ignored
├── tests/setup/               # auth.setup.js (non-BDD plumbing)
├── playwright.config.js
├── .env.example  .eslintrc / eslint.config.js  .prettierrc  .husky/
├── Dockerfile  package.json  README.md  CONTRIBUTING.md  LICENSE  CHANGELOG.md
```

---

## 6. Design Principles

0. **Features describe behaviour in business language; steps are thin; page objects own locators/actions; assertions live in `Then` steps.** (Applies wherever this plan says "specs".)
1. Page objects own locators/actions; **`Then` steps own assertions**.
2. Locator priority: `getByRole` → `getByLabel` → `getByTestId` → text → CSS (last resort).
3. Auto-waiting and web-first assertions only; no hard waits.
4. **Tests create their own data via API** (unique faker users), and never depend on another test.
5. Login via API token/`storageState`; only auth tests use the UI form.
6. Everything environment-specific lives in `.env`; no secrets in code.
7. Every scenario has a **tag with its ID (`@AUTH-01`), suite tags, and a single purpose**. Gherkin steps become Allure steps automatically.
8. Failures auto-attach screenshot, trace and (where useful) video to Allure.

---

## 7. Test Case Inventory

> **Authoritative source:** `features/**/*.feature` (Gherkin) and `docs/test-cases/Toolshop_Test_Cases_Xray.xlsx` (Xray Cucumber format): 61 scenarios, 11 of them Scenario Outlines. The tables below are the original outline (IDs/areas); where they differ, the feature files win. Notable additions: CAT-10 (language), PRD-05 (out-of-stock), API-10 (search endpoint).

P0 = release blocker, P1 = important, P2 = nice to have.
Exact assertion texts are confirmed against the live site in Phase 3.

### 7.1 Authentication & Registration (UI)

| ID      | Scenario                                                                         | Pri |
| ------- | -------------------------------------------------------------------------------- | --- |
| AUTH-01 | Valid login → lands on account page, name in header                              | P0  |
| AUTH-02 | Invalid password → error message                                                 | P0  |
| AUTH-03 | Unknown email → error message                                                    | P1  |
| AUTH-04 | Empty email / empty password validation (data-driven)                            | P1  |
| AUTH-05 | Logout clears session; protected page redirects to login                         | P0  |
| AUTH-06 | Register new user with valid data (faker) → can log in                           | P0  |
| AUTH-07 | Register validation: required fields, invalid email, weak password (data-driven) | P1  |
| AUTH-08 | Register with existing email → error                                             | P1  |
| AUTH-09 | Forgot-password page loads and validates email                                   | P2  |

### 7.2 Catalog (UI)

| ID     | Scenario                                                          | Pri |
| ------ | ----------------------------------------------------------------- | --- |
| CAT-01 | Home page shows products with name, price, image                  | P0  |
| CAT-02 | Search by keyword returns matching products                       | P0  |
| CAT-03 | Search with no match shows empty state                            | P1  |
| CAT-04 | Filter by category                                                | P1  |
| CAT-05 | Filter by brand                                                   | P1  |
| CAT-06 | Sort by price asc/desc, name asc/desc (data-driven, verify order) | P1  |
| CAT-07 | Pagination: next/prev, page content changes, no duplicates        | P1  |
| CAT-08 | Combined filter + search                                          | P2  |
| CAT-09 | UI product list equals API product list for page 1 (hybrid check) | P1  |

### 7.3 Product Detail

| ID     | Scenario                                                 | Pri |
| ------ | -------------------------------------------------------- | --- |
| PRD-01 | Open product → name/price/description match card and API | P0  |
| PRD-02 | Increase/decrease quantity                               | P1  |
| PRD-03 | Add to cart → toast and cart count                       | P0  |
| PRD-04 | Add to favorites (logged in)                             | P1  |
| PRD-05 | Related products section shown                           | P2  |

### 7.4 Cart

| ID     | Scenario                                                | Pri |
| ------ | ------------------------------------------------------- | --- |
| CRT-01 | Add multiple products; cart lists correct items         | P0  |
| CRT-02 | Update quantity → line total and cart total recalculate | P0  |
| CRT-03 | Remove item                                             | P0  |
| CRT-04 | Empty cart state                                        | P2  |
| CRT-05 | Cart persists across page reload                        | P1  |

### 7.5 Checkout (UI + hybrid)

| ID     | Scenario                                                              | Pri |
| ------ | --------------------------------------------------------------------- | --- |
| CHK-01 | End-to-end purchase (login → cart → address → payment → confirmation) | P0  |
| CHK-02 | Address form validation (data-driven)                                 | P1  |
| CHK-03 | Payment methods: credit card, bank transfer, etc. (data-driven)       | P1  |
| CHK-04 | Invalid card data validation                                          | P1  |
| CHK-05 | Order total = Σ(price × qty)                                          | P0  |
| CHK-06 | **Hybrid:** user + cart seeded via API; UI only completes checkout    | P0  |
| CHK-07 | Order appears in profile/invoices after purchase                      | P1  |

### 7.6 Account, Favorites, Contact

| ID     | Scenario                              | Pri |
| ------ | ------------------------------------- | --- |
| ACC-01 | Update profile details                | P1  |
| ACC-02 | Change password and re-login          | P1  |
| FAV-01 | Added favorite appears; remove it     | P1  |
| CON-01 | Contact form success                  | P1  |
| CON-02 | Contact form validation (data-driven) | P2  |

### 7.7 API Suite (`tests/api`)

| ID     | Scenario                                                                  | Pri |
| ------ | ------------------------------------------------------------------------- | --- |
| API-01 | `GET /products` → 200, pagination fields, **JSON schema valid**           | P0  |
| API-02 | `GET /products/{id}` → 200 and matches schema; unknown id → 404           | P0  |
| API-03 | `GET /products?between=price,…` / sort / category filters work            | P1  |
| API-04 | `GET /categories`, `GET /brands` → non-empty, schema valid                | P1  |
| API-05 | `POST /users/login` valid → token; invalid → 401                          | P0  |
| API-06 | `POST /users/register` valid → 201; duplicate/invalid → 4xx (data-driven) | P0  |
| API-07 | Protected endpoint without token → 401; with token → 200                  | P0  |
| API-08 | Response time budget (soft assertion, e.g. < 2s)                          | P2  |
| API-09 | Contract: required fields, data types, no unexpected nulls                | P1  |

### 7.8 Quality Suites

| ID          | Scenario                                                                                                                                                                                                                     | Pri |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| A11Y-01..04 | axe scan on Home, Product, Login, Cart (fail on `critical`/`serious`; log the rest)                                                                                                                                          | P1  |
| VIS-01..03  | Visual snapshot: header, product card, footer (masked dynamic content)                                                                                                                                                       | P2  |
| RES-01      | Mock `/products` 500 → UI shows graceful error/empty state                                                                                                                                                                   | P1  |
| RES-02      | Mock slow response → loading state then content                                                                                                                                                                              | P2  |
| RES-03      | Mock empty list → empty-state message                                                                                                                                                                                        | P2  |
| BUG-xx      | Genuine defects found on the site during exploration, written as `test.fail()` with a link to `docs/known-defects.md` entry (steps, expected, actual, screenshot). Count depends on what Phase 1 uncovers; none are invented | P2  |

**Smoke set (`@smoke`, ~8 tests):** AUTH-01, CAT-01, CAT-02, PRD-03, CRT-01, CHK-06, API-01, API-05.

---

## 8. Framework Implementation Details

### 8.1 `playwright.config.js`

- `fullyParallel: true`, `forbidOnly` on CI, `retries: 2` on CI, `workers` tuned per CI.
- `use`: `baseURL`, `testIdAttribute: 'data-test'` (verified in Phase 1), `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`.
- **Projects:** `setup` → `chromium` | `firefox` | `webkit` (UI), `api` (no browser), `mobile` (Pixel viewport, smoke only).
- Reporters: `list`, `html`, `allure-playwright` (+ `junit` on CI).

### 8.2 Fixtures

- `pages` fixtures (`loginPage`, `homePage`, …), `apiClient`, `newUser` (API-created, auto-deleted/ignored after), `authedPage` (token injected into storage), `cartWithItems(n)` (API seeded).
- Custom `test.afterEach` attaches page URL, console errors and failing request log to Allure.

### 8.3 Allure

- Epics/features/stories tags per spec (`allure.epic`, `allure.feature`) so the report groups like a real QA report.
- Environment info (browser, base URL, commit SHA) written to `environment.properties`.
- History retained via the `gh-pages` branch → trend graph.

### 8.4 Stability controls

- `--repeat-each=5` nightly job on smoke set to publish a **measured flaky rate**.
- Failed-retry tests flagged "flaky" in Allure.
- Test data uniqueness via faker + timestamp.

---

## 9. CI/CD

| Workflow      | Trigger       | What it does                                                                                                                                          |
| ------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci-pr.yml`   | Pull request  | Lint → `@smoke` on Chromium + API suite → upload Allure results/artifact                                                                              |
| `nightly.yml` | Cron + manual | Matrix `[chromium, firefox, webkit]` × shards → merge results → generate Allure with history → **publish to GitHub Pages** → post summary to job page |
| (optional)    | Tag push      | Create GitHub Release with changelog                                                                                                                  |

Cache npm and Playwright browsers. Concurrency control to cancel stale runs. `permissions` scoped minimally.

---

## 10. Delivery Phases

| Phase | Deliverable                                                                                                      | Exit criteria                                           |
| ----- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 0     | Plan approved                                                                                                    | This document signed off                                |
| 1     | **Discovery:** manual walk-through, `codegen`, Swagger review, confirm creds/locators/messages, log real defects | Verified locator + endpoint sheet; AUT confirmed stable |
| 2     | **Foundation:** `git init`, npm, Playwright, ESLint/Prettier/Husky, config, folder skeleton, Allure wired        | Placeholder test passes and appears in Allure           |
| 3     | **Core framework:** BasePage, API client, fixtures, auth setup, data factory                                     | Login + API smoke pass                                  |
| 4     | **Smoke suite + first CI workflow**                                                                              | PR pipeline green                                       |
| 5     | **UI regression** (§7.1–7.6)                                                                                     | All P0/P1 green on 3 browsers                           |
| 6     | **API suite + schemas + hybrid tests**                                                                           | §7.7 done                                               |
| 7     | **Quality suites:** a11y, visual, resilience, known-bugs                                                         | §7.8 done and documented                                |
| 8     | **Nightly pipeline + Allure on Pages + sharding**                                                                | Public report URL live, history growing                 |
| 9     | **Polish:** README with diagram, screenshots, metrics, ADRs, docs matrix, CONTRIBUTING, Docker, `v1.0.0` release | §2 checklist 100%                                       |
| 10    | **Hardening:** `--repeat-each` run, fix flakiness, measure stats                                                 | Flake rate < 1% reported in README                      |

Commit history should reflect these phases (small, conventional commits per phase), not a single dump.

---

## 11. Risks & Mitigations

| Risk                                    | Mitigation                                                                                    |
| --------------------------------------- | --------------------------------------------------------------------------------------------- |
| Public site is reset/changed/down       | API-seeded unique data, no reliance on fixed records; retries on CI; fallback AUT noted in §1 |
| Shared demo data mutated by other users | Always create own user/orders; assert only on own data                                        |
| Rate limiting on public API             | Limit workers on CI, reuse tokens, small shard count                                          |
| Visual tests flaky across OS            | Snapshots generated in CI Docker image only; mask dynamic regions                             |
| Scope creep delays polish               | Phase 9 (presentation) is mandatory; cut P2 tests before cutting docs                         |
| Genuine site defects fail the build     | Isolated in `known-bugs` project, non-blocking                                                |

---

## 12. Definition of Done

- All P0/P1 cases automated, green on Chromium, Firefox, WebKit; API suite green.
- Live Allure report on GitHub Pages with ≥ 5 historical runs.
- CI badges green on README; lint clean; no `waitForTimeout`; no raw selectors in specs.
- §2 recruiter checklist fully ticked.
- `v1.0.0` released.

---

## 13. Remaining Items for Final Sign-off

1. **Confirm Toolshop as the AUT** (recommended), or choose a fallback.
2. GitHub username/repo name for badge and Pages URLs (e.g. `github.com/<you>/playwright-javascript-portfolio`).
3. Do you want a short **demo video/GIF** of a test run in the README? (Recommended; I can script it.)
4. Is a `Dockerfile` desirable, or too much for v1? (Recommended: include, small.)

On approval I'll start **Phase 1 (discovery)** and report verified findings before scaffolding.
