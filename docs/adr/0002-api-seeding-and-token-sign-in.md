# ADR 0002: Seed data through the API and sign in with a token

**Status:** accepted (replaces the original plan to use Playwright `storageState`)

## Context

Most UI scenarios need a signed-in customer, and some need a cart or an existing order. Doing that through the UI is slow and makes unrelated scenarios fail when the login or cart UI breaks. Two facts from discovery shape the solution:

- Login tokens last **5 minutes**, so a token cached for the whole run (what `storageState` would do) expires mid-run.
- The single-page app keeps its JWT in `localStorage` (`auth-token`) and the cart id and count in `sessionStorage`.

## Decision

- Every scenario that needs a user gets a **fresh token from the API** (`AuthApi`) and plants it before any page script runs (`signInWithToken` in `src/utils/session.js`).
- Carts are built through the API and handed to the browser with `seedCart`. Both helpers seed **once per tab**, so a later sign-out or a cart emptied by a finished order is not silently undone by a reload.
- New customers come from `usersApi.create(buildUser())` with a unique email, so parallel workers never collide.
- The login form is exercised only by the authentication scenarios, where it is the behaviour under test.

## Consequences

- Faster and less coupled scenarios; a login bug fails only the login scenarios.
- The helpers depend on the app's storage keys. If the site changes them, `session.js` is the one file to update.
- The shared demo customer is still used by some checkout scenarios; see the flake notes in [PROJECT_STATUS.md](../../PROJECT_STATUS.md).
