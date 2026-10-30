# Project Status and Roadmap

**Last updated:** 2026-10-30
**Working folder:** `D:\SDET\playwright_demo_JS\playwright-js` (clone of https://github.com/im-mdsr/playwright-js.git)
**Detailed plan:** [TEST_AUTOMATION_PLAN.md](TEST_AUTOMATION_PLAN.md) | **Verified facts about the site:** [DISCOVERY_FINDINGS.md](DISCOVERY_FINDINGS.md)

## 1. Where we are

All phases are implemented. Three things can only be closed by you on GitHub: the first green `ci-pr.yml` run (Phase 4), the first nightly run with GitHub Pages enabled (Phase 8), and the demo GIF plus the `v1.0.0` tag (Phase 9). See section 6.

| Phase | Name                                      | Status      | Notes                                                                                                  |
| ----- | ----------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| 0     | Plan and review                           | **Done**    | Toolshop chosen, Cucumber BDD via `playwright-bdd`, Allure, 3 browsers, Docker, demo GIF agreed        |
| 1     | Discovery                                 | **Done**    | UI locators and API behaviour verified live                                                            |
| 2     | Foundation                                | **Done**    | Project, config, lint, format, hooks, Allure, Dockerfile                                               |
| 3     | Core framework + auth features            | **Done**    | Page objects, API clients, fixtures, 9 auth UI scenarios, 2 auth API scenarios                         |
| 4     | Smoke suite + first CI workflow           | **Done**    | 11 smoke scenarios, failure evidence verified, `ci-pr.yml` written (first GitHub result not confirmed) |
| 5     | UI regression                             | **Done**    | All 61 UI and hybrid scenarios except the API-only ones; 196 of 198 passed on 3 browsers               |
| 6     | API suite, schemas, hybrid tests          | **Done**    | All 10 API scenarios, JSON schemas for product, category and brand, hybrid scenarios (done in Phase 5) |
| 7     | Quality suites (a11y, visual, resilience) | **Done**    | 4 axe scans, 3 visual baselines (Chromium), 3 resilience, 5 `@known-bug` scenarios; 4 defects logged   |
| 8     | Nightly pipeline, Allure on GitHub Pages  | **Written** | `nightly.yml` + `allurerc.mjs`; needs Pages enabled and a first run to verify                          |
| 9     | Polish: README, docs, demo GIF, release   | **Mostly**  | README, CONTRIBUTING, CHANGELOG, ADRs, strategy, matrix done; demo GIF and `v1.0.0` tag are yours      |
| 10    | Hardening: flake rate measurement         | **Done**    | Measured; Chromium under 3x load 1.8%, Firefox and WebKit 0%; API retries added (see README)           |

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
| Quality tooling     | ESLint, Prettier, Husky + lint-staged, Dockerfile (built and verified)                                           |

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
**Remaining for the exit criterion:** confirm `.github/workflows/ci-pr.yml` is green on GitHub; fix anything that differs on the runner.

### Phase 5: UI regression (done)

Differences between the written scenarios and the live site, now reflected in the `.feature` files:

- **CRT-04:** the site shows no message for an empty cart (only the step header), so the step is "I should see an empty cart".
- **CHK-02:** the address step shows no per-field error text; it only disables the next button, so the "required-field error" line was removed.
- The product list is fetched with the HTTP `QUERY` method (criteria in the body), not GET; `HomePage` waits on that.
- The Excel test cases were re-exported on 2026-10-30 with `npm run export:testcases` and include these wording changes.

### Phase 6: API suite, schemas, hybrid tests (done)

API-02, 03, 04, 06, 08, 09, 10 added on top of API-01, 05, 07. JSON schemas live in `src/schemas/` (product, category, brand) and are checked with Ajv. The hybrid scenarios were already covered in Phase 5. API-08 uses the 2000 ms budget from the feature file; the demo site is sometimes slower than that, so expect an occasional miss (Phase 10 measures it). The registration scenarios create their own users; "the same email again" registers a user first, because outline rows run in isolation.

### Phase 7: Quality suites (done)

- **Accessibility:** axe scans of home, product, login and cart. They fail on any critical or serious violation that is not in `src/data/knownDefects.js`.
- **Known defects:** four real defects are in [docs/known-defects.md](docs/known-defects.md), each with a `@known-bug` scenario in `features/known-bugs/` that asserts the correct behaviour and is expected to fail (`src/steps/hooks.js`). When the site is fixed the scenario "unexpectedly passes" and the tag should be removed.
- **Visual:** baselines in `snapshots/`, Chromium only (`grepInvert` on the other projects). `chromium-win32` and `chromium-linux` baselines exist. The Linux ones were generated in the Docker image (`docker run -v <repo>/snapshots:/app/snapshots toolshop-tests sh -c "npx bddgen && npx playwright test --project=chromium --grep @visual --update-snapshots"`) and re-run green. The first-product-card baseline depends on the first product in the shared catalog, so regenerate it if the site data changes.
- **Resilience:** requests to `/products` are mocked with `page.route`. RES-01 was changed to assert "no products and no uncaught errors" because the site shows no error message when the products API fails (that is defect D-04, scenario KB-05). RES-02 step text lost its leading "then".
- The Excel test cases were re-exported on 2026-10-30 and include the RES-01/RES-02 wording and the KB scenarios.

### Phase 8: Nightly pipeline and Allure on GitHub Pages

`nightly.yml` runs 3 browsers x 3 shards in the Playwright Docker image, merges the Allure results, restores `history.jsonl` from the last published report, builds the report with `allurerc.mjs` and deploys it to GitHub Pages. Written and syntax-checked; the Allure generation was run locally. **Not yet run on GitHub.** To close it: Settings > Pages > Source = GitHub Actions, merge to `main`, run the workflow once from the Actions tab (try `grep` = `@smoke` first), then confirm <https://im-mdsr.github.io/playwright-js/> shows the report and that the next run extends the trend.

### Phase 9: Polish

README (badges, live report link, diagram, measured results, skills), CONTRIBUTING, CHANGELOG, three ADRs, test strategy, generated test-case matrix, Docker verified, local/Docker run scripts: **done**. Still open and not doable from here: a demo GIF (record it or take a screenshot of the published Allure dashboard and add it to the README), and tagging `v1.0.0` after the first green CI and nightly runs.

### Phase 10: Hardening

Done on 2026-10-30, retries off: Firefox and WebKit 71/71 each; Chromium 3 passes at once 273/285 (4.2% failed) before and 280/285 (1.8%) after adding retries to API `GET` requests and cart item adds. The remaining failures are different tests each time and all are site timeouts or dropped connections. The under-1% target is **not met** on Chromium under that load; the nightly report will show the real trend. CHK-03 failed once in 285 runs and the 60-run checkout-only check passed 60/60, so the earlier 1-in-10 checkout flake did not reproduce; no quarantine was needed.

## 4. Things to know before continuing

- **Checkout address flake (historical, mostly CHK-03, occasionally CHK-01 and CHK-06):** the demo customer has a saved street but no postal code, and the site loads it late and can empty typed values. `goToAddress` waits for the saved street and `fillAddress` retries the fill until the values stick. In the 2026-10-30 measurements it did not reproduce (checkout-only 60/60; one CHK-03 timeout in 285 full-suite runs). If it returns, use API-created users instead of the demo customer or quarantine CHK-03.
- **Gift card and bank formats** (from the site's own validators): gift card is 16 letters or digits plus a 4-character code; credit card is `dddd-dddd-dddd-dddd`, a future `MM/YYYY` date and a 3 or 4 digit CVV; bank account number is digits only.
- **Out-of-stock (PRD-05)** skips itself when the shared catalog has no out-of-stock product.

- **Checkout addresses come from the site's postcode lookup.** After the postal code and house number are entered, the SPA fills street, city and state itself, and `POST /invoices` returns 422 if typed values disagree ("city does not belong to the selected country"). `CheckoutPage.fillAddress` therefore types only country, postal code and house number, then waits for the matching lookup response.
- **Cart seeding.** The SPA keeps the cart in `sessionStorage` (`cart_id`, `cart_quantity`); `seedCart()` plants an API-built cart. The order confirmation text is "Thanks for your order! Your invoice number is INV-...".
- **Known intermittent failures:** now measured, see the Phase 10 section above and the README.
- **Failure evidence verified:** a deliberately broken scenario produced screenshot, video and trace (trace on the retry) in `allure-results`.

- **The demo site is slow at times** (page loads from under 1 second to about 20 seconds). Timeouts are set generously for that reason. A few intermittent failures are expected; Phase 10 measures them.
- **Login tokens last only 5 minutes.** Always get a token per scenario; never cache one for the whole run.
- **The `.feature` files in `features/` are the master.** Edit scenarios there, then run `npm run export:testcases` to regenerate the Excel workbook and `docs/test-case-matrix.md`.
- **`LICENSE`** has the owner name set (check the angle brackets around it are gone).
- **`npm audit`** reports an issue in a package inside the Allure report tooling (`dompurify`). It affects only report generation from our own output. Revisit when Allure publishes a fixed release.
- **The Dockerfile builds and runs** (verified 2026-10-30). If a pull from `mcr.microsoft.com` times out, just retry.
- **Everything is pushed to `main` as one commit ("initial code").** The user makes all commits; Claude edits files but does not commit. Work on branch `phase-8-prep` until the pre-Phase-8 items are done.

## 5. How to resume

```bash
cd D:\SDET\playwright_demo_JS\playwright-js
npm ci
npx playwright install
npm test                      # generates specs from features and runs all three browsers
npm run report:allure && npm run report:allure:open
```

Then tell Claude: "Continue with Phase 8 in D:\SDET\playwright_demo_JS\playwright-js, following PROJECT_STATUS.md."

## 6. What is left for you

1. Commit and push this branch (`phase-8-prep`), open a pull request, and confirm `PR smoke` is green.
2. Settings > Pages > Source = **GitHub Actions**; merge to `main`; run **Nightly regression** once by hand and open the published report.
3. Add a screenshot or GIF of the Allure dashboard to the README, then tag `v1.0.0`.
