# Test strategy

## Application under test

[Practice Software Testing (Toolshop)](https://practicesoftwaretesting.com), a public demo shop with a single-page UI and a REST API at `https://api.practicesoftwaretesting.com`. It is shared and sometimes slow (page loads from under 1 s to about 20 s), so timeouts are generous and a few intermittent failures are expected and measured. Verified facts about the site are in [DISCOVERY_FINDINGS.md](../DISCOVERY_FINDINGS.md).

## What is covered

| Layer          | Examples                                                             | Tags                  |
| -------------- | -------------------------------------------------------------------- | --------------------- |
| UI end to end  | login, registration, catalog filters, product page, cart, checkout   | `@ui` `@e2e`          |
| API            | auth, products, categories, brands, users, status codes, schemas     | `@api`                |
| Hybrid         | data created through the API, verified in the UI (and the reverse)   | `@hybrid`             |
| Accessibility  | axe scans of home, product, login and cart pages                     | `@a11y`               |
| Visual         | header, footer and first product card, Chromium only                 | `@visual`             |
| Resilience     | the products request is mocked to fail or return nothing             | `@resilience`         |
| Known defects  | real site defects, asserted as correct behaviour and expected to fail | `@known-bug`          |

Every scenario has an ID (`AUTH-01`, `CHK-03`, ...). See [test-case-matrix.md](test-case-matrix.md) and the Xray workbook in `docs/test-cases/`. Both are generated from the `.feature` files, which are the master.

## Suites and when they run

| Suite   | Selection                      | Where                         | When                    |
| ------- | ------------------------------ | ----------------------------- | ----------------------- |
| Smoke   | `@smoke`, Chromium             | `ci-pr.yml`                   | every pull request, push to `main` |
| Full    | everything, 3 browsers, 3 shards each | `nightly.yml`          | nightly and on demand   |
| Local   | any selection                  | `npm test`, `npm run docker:test` | on demand           |

Firefox and WebKit run the UI scenarios; API and visual scenarios run on Chromium only, since they do not depend on the browser or are rendering specific.

## Principles

- Scenarios are independent and create their own data, so they run in parallel and in any order.
- Preconditions are seeded through the API; the UI is driven only for the behaviour under test ([ADR 0002](adr/0002-api-seeding-and-token-sign-in.md)).
- No fixed sleeps. Waits are on conditions.
- Defects are declared, not hidden: see [known-defects.md](known-defects.md).

## Out of scope

- Load and security testing; the target is a shared public demo.
- Mobile viewports and non-English locales beyond what the scenarios touch.
- Visual regression on Firefox and WebKit (rendering differs by engine).
- Accessibility results are automated scans only; they have not been confirmed with a screen reader.
