# Contributing

## Set up

```bash
npm ci
npx playwright install
cp .env.example .env     # on Windows: copy .env.example .env
```

Git hooks (Husky + lint-staged) run ESLint and Prettier on staged files. CI runs `npm run lint` and `npm run format:check` too.

## Run the tests

| Goal                    | Local                                                   | Docker                                           |
| ----------------------- | ------------------------------------------------------- | ------------------------------------------------ |
| Everything              | `npm test`                                              | `npm run docker:test`                            |
| Smoke (Chromium)        | `npm run test:smoke`                                    | `npm run docker:smoke`                           |
| One browser             | `npm run test:chromium` / `:firefox` / `:webkit`        | —                                                |
| One feature             | `FEATURES=features/ui/cart/*.feature npm test`          | `FEATURES=... docker compose run --rm tests ...` |
| Update visual baselines | `npx playwright test --grep @visual --update-snapshots` | `npm run docker:visual:update`                   |

Visual baselines are rendering specific. **Commit the Linux ones generated in Docker**; CI renders in the same image. The `win32` ones are for local runs on Windows.

## Add a test

1. **Write the scenario** in the right file under `features/`. Start the file with `Test repository path: Toolshop/...` and tag every scenario with a unique ID (`@CHK-08`) plus `@smoke` or `@regression` and an area tag (`@ui`, `@api`, `@hybrid`, `@a11y`, `@visual`).
2. **Reuse steps** from `src/steps/` where you can. Add new ones in the file for that area. A scenario without steps fails generation on purpose.
3. **Keep selectors out of steps.** Locators live in page objects (`src/pages/`), HTTP calls in API clients (`src/api/`). Steps only call those and assert.
4. **Seed through the API**, not the UI, when something is a precondition (`newUser`, `seedCart`, `signInWithToken`). Drive the UI only for the behaviour under test.
5. **No `waitForTimeout`.** Wait for a condition (`expect(...)`, `waitForResponse`). The demo site is sometimes slow; timeouts are already generous.
6. **Each scenario must stand alone.** It creates its own data and must pass in any order and in parallel.
7. Run `npm run export:testcases` to refresh the Excel sheet and `docs/test-case-matrix.md`.

## Known site defects

If you find a real defect on the demo site, add it to [docs/known-defects.md](docs/known-defects.md) and write a `@known-bug` scenario that asserts the **correct** behaviour. It is expected to fail; when the site is fixed, the suite reports an unexpected pass and the tag is removed.

## Commits and pull requests

- Conventional commit prefixes: `feat:`, `fix:`, `test:`, `docs:`, `ci:`, `chore:`, `refactor:`.
- Open a pull request against `main`. The `PR smoke` workflow must be green.
- Describe what changed and how you ran it (browser, local or Docker).
