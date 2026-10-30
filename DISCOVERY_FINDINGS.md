# Phase 1: Discovery Findings (Toolshop)

**Verified on:** 2026-10-26, live probe of https://practicesoftwaretesting.com (UI, "v5.0") and https://api.practicesoftwaretesting.com using curl and a headless Chromium script. No project code has been written yet.

**Verdict:** Toolshop is reachable, stable and suitable. Go ahead with Phase 2.

---

## 1. API (verified)

| Endpoint                                                            | Observed                                                                                                                                                                                |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /products?page=1`                                              | 200. Envelope: `current_page, data, from, last_page, per_page, to, total`. **50 products, 9 per page, 6 pages**                                                                         |
| Product fields                                                      | `id` (ULID string, not integer), `name, description, price, is_location_offer, is_rental, co2_rating, in_stock, is_eco_friendly, product_image, category{id,name,slug}, brand{id,name}` |
| `GET /products?sort=price,asc` / `name,desc` / `between=price,1,20` | 200                                                                                                                                                                                     |
| `GET /products/search?q=pliers`                                     | 200. No match returns `data: []`, `total: 0` (still 200)                                                                                                                                |
| `GET /products/doesnotexist`                                        | 404 `{"message":"Requested item not found"}`                                                                                                                                            |
| `GET /categories`, `/categories/tree`, `/brands`                    | 200. Two brands: ForgeFlex Tools, MightyCraft Hardware                                                                                                                                  |
| `POST /users/login` valid                                           | 200 with `access_token` (JWT)                                                                                                                                                           |
| `POST /users/login` invalid                                         | **401** `{"error":"Unauthorized"}`                                                                                                                                                      |
| `GET /users/me`, `/favorites`, `/invoices` without token            | **401** `{"message":"Unauthorized"}`                                                                                                                                                    |
| `/docs.json`                                                        | 404, so the OpenAPI path differs. Still to locate (`/api/documentation`, per the plan)                                                                                                  |

### Implications for the framework

1. **Token lifetime is only 300 seconds** (JWT `exp - iat = 300`). A saved `storageState` or token will expire mid-run. The auth fixture must log in per worker or refresh the token on demand, and must not share one login for the whole suite.
2. Product ids are ULIDs and the catalog is shared, so tests must look products up by name or by API query, never by a hardcoded id.
3. "Search with no match" is a 200 with an empty list, so the API assertion is `total === 0`, not a 404.
4. Error bodies differ (`error` on login, `message` elsewhere). The API client should not assume one shape.

## 2. UI (verified)

- `data-test` attribute is the test id, so `testIdAttribute: 'data-test'` is confirmed.
- Routes: `/`, `/product/{id}`, `/checkout` (cart is step 1), `/auth/login`, `/auth/register`, `/account`, `/contact`.
- Home page: 9 cards per page. Sort `<select data-test="sort">` options: _(blank), Name (A - Z), Name (Z - A), Price (High - Low), Price (Low - High), CO₂ Rating (A - E), CO₂ Rating (E - A)_. Filters are checkboxes by category, brand and "eco friendly". Pagination via `pagination-prev` / `pagination-next`.
- Product page: quantity controls, add to cart (toast **"Product added to shopping cart."**), add to favorites, add to compare, spec table.
- Checkout steps: cart (`proceed-1`) → sign-in or guest (`guest-*`) → address (`country, postal_code, house_number, street, city, state`, `proceed-3`) → payment (`payment-method`, `finish`).
- Login: `email`, `password`, `login-submit`. The published demo customer (`customer@practicesoftwaretesting.com`) logs in and lands on `/account` titled "My account".
- Register: 12 fields (`first-name, last-name, dob, country, postal_code, house_number, street, city, state, phone, email, password`) and `register-submit`.
- Contact: `subject` select, `message` textarea, `attachment`, `contact-submit`.

### Locator notes

- Product links are `data-test="product-{ULID}"`, so select cards by `product-name` text, not by that test id.
- Category and brand checkboxes also contain ULIDs, so filter by label text.
- Some items show an `out-of-stock` marker (an extra edge case for the catalog tests).
- The site has things my v2 plan did not list: language switcher (en, de, es, fr, nl, tr, el), a rentals category, compare feature, a chat widget, and a notification bar. I'll keep these out of scope except for one language-switch smoke test, and make sure the chat widget and notification bar never intercept clicks.

## 3. Open items still to verify (done in Phase 3, when writing page objects)

1. Registration validation messages and password rules.
2. Payment method options and their extra fields (credit card, bank transfer, and others).
3. Favorites, profile and invoices pages after login. The `account` page showed no inner `data-test` ids, probably because it hadn't finished rendering.
4. API register response and duplicate-email behaviour. I did **not** create any users during discovery, to avoid polluting the shared site.
5. Swagger/OpenAPI location.
6. Real defects, to be logged for the `known-bugs` suite. None have been confirmed yet, and I will not invent any.

## 4. Plan changes proposed

| Change                                                                       | Reason                |
| ---------------------------------------------------------------------------- | --------------------- |
| Per-worker API login with token refresh instead of one shared `storageState` | 300 s token expiry    |
| Look up products by name or API query, never by id                           | ULIDs and shared data |
| Add one language-switch smoke test                                           | Feature exists        |
| Handle chat widget and notification bar in `BasePage`                        | Could overlap clicks  |

Environment is ready for Phase 2: Node v24.18.0, npm 11.16.0, git 2.55 and Docker 29.7 are installed. Node 24 is newer than the Node 20 LTS in the plan. I propose targeting **Node 22 LTS or newer** in `engines` and CI.

---

## 5. Phase 3 verification (2026-10-26)

Items from section 3 resolved against the live site.

### UI messages and test ids

| Where                  | Observed                                                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Wrong password         | `login-error`: "Invalid email or password" (user stays on `/auth/login`)                                                            |
| Empty login            | `email-error`: "Email is required", `password-error`: "Password is required"                                                        |
| Empty registration     | Per-field `*-error` ids: "First name is required", "Last name is required", "Email is required", "Password is required", and others |
| Malformed email        | `email-error`: "Email format is invalid"                                                                                            |
| Weak password (`123`)  | `password-error`: "Password must be minimal 6 characters long. Password can not include invalid characters."                        |
| Forgot password, empty | `email-error`: "Email is required" (test ids `forgot-password-form`, `email`, `forgot-password-submit`)                             |
| Search with no match   | `no-results`: "There are no products found."                                                                                        |
| Header user menu       | `nav-menu` shows the user's name; items: My account, My favorites, My profile, My invoices, My messages, Sign out                   |

### Checkout (single page, steps are stacked sections)

- Steps: cart (`proceed-1`), sign-in confirmation (`proceed-2`), billing address (`proceed-3`), payment.
- The address fields start **empty** and `proceed-3` is disabled until they are valid.
- Payment methods (`payment-method` select values): `bank-transfer`, `cash-on-delivery`, `credit-card`, `buy-now-pay-later`, `gift-card`.
- Extra fields per method: bank transfer (`bank_name`, `account_name`, `account_number`); credit card (`credit_card_number`, `expiration_date`, `cvv`, `card_holder_name`); buy now pay later (`monthly_installments`); gift card (`gift_card_number`, `validation_code`); cash on delivery has none.
- Paying with cash on delivery shows `payment-success-message`: "Payment was successful". The text with the invoice number comes after a further confirmation step, still to be captured in Phase 5.

### API

| Call                         | Observed                                                                                                                            |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `POST /users/register` valid | **201**, body has `id` and `created_at`, no password                                                                                |
| Same email again             | **409** `{"email":["A customer with this email address already exists."]}`                                                          |
| Missing fields               | **422** with per-field arrays, e.g. `{"last_name":["The last name field is required."], ...}`                                       |
| Register payload             | `first_name, last_name, dob (YYYY-MM-DD), phone, email, password, address{street, house_number, city, state, country, postal_code}` |

### Session

- The SPA stores its JWT in `localStorage` key `auth-token`. Planting it before page load signs the browser in (used by the "logged in" steps).
- Signing out clears it, and opening `/account` afterwards redirects to `/auth/login`.

### Reliability finding

The demo site's latency varies a lot (page loads from under 1 s to about 20 s were seen). With 4 parallel browsers a 7 s assertion timeout produced about 50% failures on the login scenario even though the API answers in about 0.7 s. The framework now uses a 15 s assertion timeout and a 60 s test timeout. After that change, 24 of 24 repeated login runs passed across the three browsers, and the full suite passed 63 of 63.
