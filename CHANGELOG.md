# Changelog

All notable changes to this project. Format follows [Keep a Changelog](https://keepachangelog.com/).

## [1.0.0] - 2026-10-30

First complete release.

### Added

- Gherkin features for the Toolshop demo site, run with Playwright through `playwright-bdd`: 61 test cases (authentication, catalog, product, cart, checkout, account, favorites, contact, API, accessibility, visual, resilience) plus 5 declared known-defect scenarios.
- Page objects, API clients, lazy fixtures and API-seeded sign-in (see [docs/adr/](docs/adr/)).
- API suite with JSON schema checks (Ajv), axe accessibility scans, visual baselines (Chromium; Windows and Linux) and network-failure resilience scenarios.
- Known site defects documented in [docs/known-defects.md](docs/known-defects.md), each with a `@known-bug` scenario.
- `PR smoke` workflow for pull requests and pushes to `main`.
- `Nightly regression` workflow: three browsers, three shards each, merged Allure report with history published to GitHub Pages.
- Dockerfile and `docker-compose.yml`, plus `npm run docker:*` scripts, so the suite runs locally or in the official Playwright image.
- `npm run export:testcases`: regenerates the Xray Excel workbook and [docs/test-case-matrix.md](docs/test-case-matrix.md) from the feature files.
- README, CONTRIBUTING, test strategy, architecture decision records, pull request template.

### Changed

- API `GET` requests retry on dropped connections and gateway errors; adding an item to a freshly created cart retries on HTTP 404. Both guard against the shared demo site's occasional transient failures.
- The `LICENSE` names the project owner.
- CRT-04, CHK-02, RES-01 and RES-02 wording follows what the live site actually does (see [PROJECT_STATUS.md](PROJECT_STATUS.md)).

### Known limitations

- The demo site is shared and sometimes slow, so a small share of runs fail on timeouts; the measured rate is in the README.
- Visual tests run on Chromium only.
- The `dompurify` advisory in the Allure tooling affects report generation only.
