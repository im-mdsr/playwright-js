# ADR 0003: Allure 3 reports published to GitHub Pages

**Status:** accepted

## Context

A pass/fail line in CI is not enough to see trends or to inspect a failure without cloning the repo. The nightly run is split into many shards across three browsers, so results must be merged.

## Decision

- Tests write Allure results (`allure-playwright`) in addition to the Playwright HTML report.
- The nightly workflow runs `browser × shard` jobs, uploads each job's `allure-results`, then a report job merges them and runs `allure generate` with [allurerc.mjs](../../allurerc.mjs).
- The report is deployed with the official Pages actions. The **history file is published inside the report** (`history.jsonl`) and downloaded again at the start of the next run, so the trend graph grows without a separate branch or cache.
- The report job and the deploy job run even when tests fail, because a red night is when the report matters most.
- Tests run in the Playwright Docker image in CI so Linux visual baselines match.

## Consequences

- Anyone can open the latest report from the README without cloning.
- If the published site is unreachable once, that night's run starts a new history.
- GitHub Actions sets `CI=true`, which enables 2 retries; flaky tests show up as "flaky" in Allure instead of failing the run. Flake rates are therefore measured locally with retries off (see the README metrics).
