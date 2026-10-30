# Known site defects

Defects found on the Toolshop demo site while building the quality suites. Every entry has evidence
from a real run and a `@known-bug` scenario in
[`features/known-bugs/known-defects.feature`](../features/known-bugs/known-defects.feature) that
asserts the **correct** behaviour. Those scenarios are expected to fail while the defect exists.
Playwright reports an expected failure as a pass and an unexpected pass as a failure, so when the
site is fixed the suite tells us to remove the tag and the entry in
[`src/data/knownDefects.js`](../src/data/knownDefects.js).

**Found:** 2026-10-29, `https://practicesoftwaretesting.com` (v2.5), Chromium, axe-core 4.14.
The accessibility findings are from automated scanning only; they have not been confirmed with a
screen reader.

| ID   | Severity            | Where                         | Problem                                                                                              | Scenario    |
| ---- | ------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------- | ----------- |
| D-01 | Serious (axe)       | Header, all pages             | Language selector and cart link have an accessible name that does not contain their visible text    | KB-01, KB-02 |
| D-02 | Serious (axe)       | Home page filters             | The category lists put elements other than `<li>` directly inside `<ul>`/`<ol>`                      | KB-03       |
| D-03 | Critical (axe)      | Login page                    | The password visibility button has no accessible name                                                | KB-04       |
| D-04 | Functional / UX     | Home page, products API fails | When the products request fails (HTTP 500) the page shows nothing: no error, no empty-state message  | KB-05       |

## Details

### D-01 Accessible name does not contain the visible text (`label-content-name-mismatch`)

The language button is `<button id="language" aria-label="Select language">` while its visible text
is "EN". On the cart page the cart link (`a[data-test="nav-cart"]`) is flagged too. Speech-input
users who say what they see ("click EN") cannot activate the control.
Rule: <https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch>

### D-02 List markup (`list`)

Three `<ul>` elements in the home page filter sidebar (for example `.checkbox:nth-child(2) > ul`)
directly contain something other than `<li>`, `<script>` or `<template>`. Screen readers may
announce the lists incorrectly.
Rule: <https://dequeuniversity.com/rules/axe/4.14/list>

### D-03 Button without a name (`button-name`)

On `/auth/login` the button `<button type="button" class="btn btn-outline-secondary">` next to the
password field has no text and no label, so assistive technology announces just "button".
Rule: <https://dequeuniversity.com/rules/axe/4.14/button-name>

### D-04 No feedback when the product list cannot load

Reproduced by answering the products request with HTTP 500 (see RES-01). The page does not crash
and raises no uncaught errors, but the product area stays blank: no message, no retry hint. A
shopper cannot tell a server problem from an empty catalog. An empty result (HTTP 200, no products)
does show "There are no products found." (RES-03), so the error case is the only silent one.

## Observed but not tracked

Moderate or minor axe findings, below the "critical or serious" bar used by the A11Y scenarios:
`heading-order` (home, product), `landmark-one-main` and `region` (all pages), `landmark-unique`
(home), `page-has-heading-one` (login, cart) and `empty-table-header` (cart).

## How the suites use this list

- **A11Y-01 to A11Y-04** fail on any critical or serious violation that is _not_ listed in
  `src/data/knownDefects.js`, so a new regression is caught while the known ones do not hide it.
- **KB-01 to KB-05** assert the correct behaviour and are expected to fail.
