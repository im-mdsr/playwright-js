# Project Status and Roadmap

**Last updated:** 2026-10-29
**Working folder:** `D:\SDET\playwright-js` (clone of https://github.com/im-mdsr/playwright-js.git)
**Detailed plan:** [TEST_AUTOMATION_PLAN.md](TEST_AUTOMATION_PLAN.md) | **Verified facts about the site:** [DISCOVERY_FINDINGS.md](DISCOVERY_FINDINGS.md)

## 1. Where we are

Phases 0 to 7 are complete (Phase 4 still needs its first green GitHub run, see section 3). The next phase to work on is **Phase 8**.

| Phase | Name                                      | Status      | Notes                                                                                                  |
| ----- | ----------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| 0     | Plan and review                           | **Done**    | Toolshop chosen, Cucumber BDD via `playwright-bdd`, Allure, 3 browsers, Docker, demo GIF agreed        |
| 1     | Discovery                                 | **Done**    | UI locators and API behaviour verified live                                                            |
| 2     | Foundation                                | **Done**    | Project, config, lint, format, hooks, Allure, Dockerfile                                               |
| 3     | Core framework + auth features            | **Done**    | Page objects, API clients, fixtures, 9 auth UI scenarios, 2 auth API scenarios                         |
| 4     | Smoke suite + first CI workflow           | **Done**    | 11 smoke scenarios, failure evidence verified, `ci-pr.yml` written (not yet run on GitHub)             |
| 5     | UI regression                             | **Done**    | All 61 UI and hybrid scenarios except the API-only ones; 196 of 198 passed on 3 browsers               |
| 6     | API suite, schemas, hybrid tests          | **Done**    | All 10 API scenarios, JSON schemas for product, category and brand, hybrid scenarios (done in Phase 5) |
| 7     | Quality suites (a11y, visual, resilience) | **Done**    | 4 axe scans, 3 visual baselines (Chromium), 3 resilience, 5 `@known-bug` scenarios; 4 defects logged   |
| 8     | Nightly pipeline, Allure on GitHub Pages  | **Next**    |                                                                                                        |
| 9     | Polish: README, docs, demo GIF, release   | Not started |                                                                                                        |
| 10    | Hardening: flake rate measurement         | Not started |                                                                                                        |

## 2. What is implemented

**Last full run (Phase 6):** 235 passed, 2 failed, 0 skipped (10.3 min, no retries). Both failures were timeouts against the slow demo site (a product-page click in A11Y-02 and an API POST in CHK-07). API and visual scenarios now run on Chromium only; the other browsers run the UI scenarios.

### Framework (Phases 2 to 4)

| Area                | Where                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Runner and projects | `playwright.config.js` (Chromium, Firefox, WebKit; Allure + HTML reporters)                                      |
| Config and defaults | `src/config/env.js` (defaults to the public site and its demo customer; `.env` overrides)                        |
| Page objects        | `src/pages/` (Base, Login, Register, ForgotPassword, Account, Home, Product, Cart, Checkout, Header component)   |
| API clients         | `src/api/` (ApiClient, AuthApi, UsersApi, ProductsApi, CartsApi)                                                 |
| Fixtures            | `src/fixtures/index.js` (pages, API clients, `newUser`, per-scenario `ctx`)                                      |
| Sign-in shortcut    | `src/utils/session.js` (plants the JWT in localStorage and an API-built cart id in sessionStorage, once per tab) |
| Schemas             | `src/schemas/product.schema.js`, validated with Ajv in `src/utils/schema.js`                                     |
| Test data           | `src/utils/dataFactory.js` (unique faker users)                                                                  |
| Step definitions    | `src/steps/` (`common`, `auth`, `api`, `sanity`, `catalog`, `product`, `cart`, `checkout`)                       |
| Quality tooling     | ESLint, Prettier, Husky + lint-staged, Dockerfile (not yet built or run)                                         |

### Test cases (all 61 are automated, plus 5 known-bug scenarios)

The scenarios live in `features/` and in `docs/test-cases/Toolshop_Test_Cases_Xray.xlsx` (Jira Xray Cucumber format).

| Status                 | Count | IDs                                                                               |
| ---------------------- | ----- | --------------------------------------------------------------------------------- |
| Automated              | 61    | Everything: AUTH, CAT, PRD, CRT, CHK, ACC, FAV, CON, API-01 to 10, A11Y, VIS, RES |
| Written, not automated | 0     |                                                                                   |

The config runs every feature file (`features/**/*.feature`, override with `FEATURES=...`). `missingSteps` is no longer relaxed, so a scenario without steps now fails generation.

## 3. What to do next, phase by phase

### Phase 4: Smoke suite and first CI workflow (done)

Also automated beyond the plan: CHK-01 (smoke, e2e). PRD-01 is tagged `@smoke` but needs the product-detail-versus-API steps, so it is left for Phase 5.
**Remaining for the exit criterion:** commit, push and open a pull request so `.github/workflows/ci-pr.yml` runs once; fix anything that differs on the runner.

### Phase 5: UI regression (done)

Differences between the written scenarios and the live site, now reflected in the `.feature` files:

- **CRT-04:** the site shows no message for an empty cart (only the step header), so the step is "I should see an empty cart".
- **CHK-02:** the address step shows no per-field error text; it only disables the next button, so the "required-field error" line was removed.
- The product list is fetched with the HTTP `QUERY` method (criteria in the body), not GET; `HomePage` waits on that.
- The re-export of the Excel test cases (Phase 9) must pick up these two wording changes.

### Phase 6: API suite, schemas, hybrid tests (done)

API-02, 03, 04, 06, 08, 09, 10 added on top of API-01, 05, 07. JSON schemas live in `src/schemas/` (product, category, brand) and are checked with Ajv. The hybrid scenarios were already covered in Phase 5. API-08 uses the 2000 ms budget from the feature file; the demo site is sometimes slower than that, so expect an occasional miss (Phase 10 measures it). The registration scenarios create their own users; "the same email again" registers a user first, because outline rows run in isolation.

### Phase 7: Quality suites (done)

- **Accessibility:** axe scans of home, product, login and cart. They fail on any critical or serious violation that is not in `src/data/knownDefects.js`.
- **Known defects:** four real defects are in [docs/known-defects.md](docs/known-defects.md), each with a `@known-bug` scenario in `features/known-bugs/` that asserts the correct behaviour and is expected to fail (`src/steps/hooks.js`). When the site is fixed the scenario "unexpectedly passes" and the tag should be removed.
- **Visual:** baselines in `snapshots/`, Chromium only (`grepInvert` on the other projects). **Only `chromium-win32` baselines exist.** Linux baselines for CI must be generated once: run `npx playwright test --grep @visual --update-snapshots` inside the Docker image or a CI job, then commit them. Until then `@visual` would fail on Linux.
- **Resilience:** requests to `/products` are mocked with `page.route`. RES-01 was changed to assert "no products and no uncaught errors" because the site shows no error message when the products API fails (that is defect D-04, scenario KB-05). RES-02 step text lost its leading "then".
- The Excel test cases need re-exporting in Phase 9 for the RES-01 and RES-02 wording changes and the new KB scenarios.

### Phase 8: Nightly pipeline and Allure on GitHub Pages

Add `nightly.yml` (matrix over three browsers, sharding, merged results). Publish the Allure report to GitHub Pages with history so the trend graph builds up.

### Phase 9: Polish

Full README (badges, live Allure link, architecture diagram, metrics, skills section), short design-decision notes, CONTRIBUTING, CHANGELOG, demo GIF, Docker verified, tagged `v1.0.0`.

### Phase 10: Hardening

Run with `--repeat-each` to measure the real flake rate, fix flakiness, and report the numbers in the README.

## 4. Things to know before continuing

- **Checkout address flake (mostly CHK-03, occasionally CHK-01 and CHK-06):** the demo customer has a saved street but no postal code. The site loads it late and sometimes empties the typed postal code or house number, or never runs its lookup, which leaves "Proceed" disabled. `goToAddress` waits for the saved street, and `fillAddress` uses a random postal code (the lookup only runs when it changes) and retries the whole fill until the values stick. Checkout runs still failed about 1 in 10 on Chromium afterwards (41 of 45 in the last run, which was also disturbed by the laptop suspending the network). Not solved; Phase 10 should measure it and decide whether to quarantine CHK-03 or use API-created users instead of the demo customer.
- **Gift card and bank formats** (from the site's own validators): gift card is 16 letters or digits plus a 4-character code; credit card is `dddd-dddd-dddd-dddd`, a future `MM/YYYY` date and a 3 or 4 digit CVV; bank account number is digits only.
- **Out-of-stock (PRD-05)** skips itself when the shared catalog has no out-of-stock product.

- **Checkout addresses come from the site's postcode lookup.** After the postal code and house number are entered, the SPA fills street, city and state itself, and `POST /invoices` returns 422 if typed values disagree ("city does not belong to the selected country"). `CheckoutPage.fillAddress` therefore types only country, postal code and house number, then waits for the matching lookup response.
- **Cart seeding.** The SPA keeps the cart in `sessionStorage` (`cart_id`, `cart_quantity`); `seedCart()` plants an API-built cart. The order confirmation text is "Thanks for your order! Your invoice number is INV-...".
- **Known intermittent failures:** CHK-01 and CHK-06 failed about 1 run in 8 (postcode lookup not firing, click timeouts on the slow site). Not yet fixed; measure in Phase 10.
- **Failure evidence verified:** a deliberately broken scenario produced screenshot, video and trace (trace on the retry) in `allure-results`.

- **The demo site is slow at times** (page loads from under 1 second to about 20 seconds). Timeouts are set generously for that reason. A few intermittent failures are expected; Phase 10 measures them.
- **Login tokens last only 5 minutes.** Always get a token per scenario; never cache one for the whole run.
- **The test cases came from a generator script** that lives outside this repo (in a temporary folder). The `.feature` files in `features/` are now the master. If you change a scenario, edit the `.feature` file; the Excel will be re-exported from the feature files later (a small script to do that is a good Phase 9 task).
- **`LICENSE`** still contains the placeholder `<YOUR NAME>`.
- **`npm audit`** reports an issue in a package inside the Allure report tooling (`dompurify`). It affects only report generation from our own output. Revisit when Allure publishes a fixed release.
- **The Dockerfile has never been built.** Verify it in Phase 9, or earlier if Docker is running.
- **Nothing is committed yet.** Suggested commit order for readable history: scaffold, docs and test cases, framework core, auth features, then one commit per phase after that.

## 5. How to resume

```bash
cd D:\SDET\playwright-js
npm ci
npx playwright install
npm test                      # generates specs from features and runs all three browsers
npm run report:allure && npm run report:allure:open
```

Then tell Claude: "Continue with Phase 8 in D:\SDET\playwright-js, following PROJECT_STATUS.md."
