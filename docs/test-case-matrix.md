# Test case matrix

Generated from the `.feature` files by `npm run export:testcases` (66 test cases). Do not edit by hand.

| ID | Scenario | Priority | Status | Tags | Feature file |
| -- | -------- | -------- | ------ | ---- | ------------ |
| AUTH-01 | Valid login lands on My account | Highest | Automated | `@smoke` `@regression` `@ui` `@auth` | [features/ui/auth/login.feature](../features/ui/auth/login.feature) |
| AUTH-02 | Login with wrong password shows error | Highest | Automated | `@smoke` `@regression` `@ui` `@auth` `@negative` | [features/ui/auth/login.feature](../features/ui/auth/login.feature) |
| AUTH-03 | Login with unknown email shows error | High | Automated | `@regression` `@ui` `@auth` `@negative` | [features/ui/auth/login.feature](../features/ui/auth/login.feature) |
| AUTH-04 | Login form validates empty fields | High | Automated | `@regression` `@ui` `@auth` `@data-driven` | [features/ui/auth/login.feature](../features/ui/auth/login.feature) |
| AUTH-05 | Logout clears the session and protects the account page | Highest | Automated | `@smoke` `@regression` `@ui` `@auth` | [features/ui/auth/logout.feature](../features/ui/auth/logout.feature) |
| AUTH-06 | Register a new user and log in with the new account | Highest | Automated | `@regression` `@ui` `@auth` | [features/ui/auth/register.feature](../features/ui/auth/register.feature) |
| AUTH-07 | Registration validates its fields | High | Automated | `@regression` `@ui` `@auth` `@data-driven` | [features/ui/auth/register.feature](../features/ui/auth/register.feature) |
| AUTH-08 | Registering with an already used email is rejected | High | Automated | `@regression` `@ui` `@auth` `@negative` | [features/ui/auth/register.feature](../features/ui/auth/register.feature) |
| AUTH-09 | Forgot password form validates the email | Low | Automated | `@regression` `@ui` `@auth` | [features/ui/auth/forgot-password.feature](../features/ui/auth/forgot-password.feature) |
| CAT-01 | Home page lists products with name, price and image | Highest | Automated | `@smoke` `@regression` `@ui` `@catalog` | [features/ui/catalog/product-list.feature](../features/ui/catalog/product-list.feature) |
| CAT-02 | Search by keyword returns matching products | Highest | Automated | `@smoke` `@regression` `@ui` `@catalog` | [features/ui/catalog/search.feature](../features/ui/catalog/search.feature) |
| CAT-03 | Search with no match shows the empty state | High | Automated | `@regression` `@ui` `@catalog` `@negative` | [features/ui/catalog/search.feature](../features/ui/catalog/search.feature) |
| CAT-04 | Filter products by category | High | Automated | `@regression` `@ui` `@catalog` | [features/ui/catalog/filters.feature](../features/ui/catalog/filters.feature) |
| CAT-05 | Filter products by brand | High | Automated | `@regression` `@ui` `@catalog` | [features/ui/catalog/filters.feature](../features/ui/catalog/filters.feature) |
| CAT-06 | Sort products | High | Automated | `@regression` `@ui` `@catalog` `@data-driven` | [features/ui/catalog/sort.feature](../features/ui/catalog/sort.feature) |
| CAT-07 | Pagination moves through pages without duplicates | High | Automated | `@regression` `@ui` `@catalog` | [features/ui/catalog/pagination.feature](../features/ui/catalog/pagination.feature) |
| CAT-08 | Search combined with a category filter | Low | Automated | `@regression` `@ui` `@catalog` | [features/ui/catalog/filters.feature](../features/ui/catalog/filters.feature) |
| CAT-09 | UI product list matches the API for page 1 | High | Automated | `@regression` `@hybrid` `@catalog` | [features/hybrid/catalog-vs-api.feature](../features/hybrid/catalog-vs-api.feature) |
| CAT-10 | Language switch changes the UI text | Low | Automated | `@regression` `@ui` `@i18n` | [features/ui/catalog/language.feature](../features/ui/catalog/language.feature) |
| PRD-01 | Product detail matches the card and the API | Highest | Automated | `@smoke` `@regression` `@ui` `@product` | [features/ui/product/detail.feature](../features/ui/product/detail.feature) |
| PRD-02 | Change quantity with the plus and minus controls | High | Automated | `@regression` `@ui` `@product` | [features/ui/product/detail.feature](../features/ui/product/detail.feature) |
| PRD-03 | Add a product to the cart shows a toast and the cart count | Highest | Automated | `@smoke` `@regression` `@ui` `@product` | [features/ui/product/add-to-cart.feature](../features/ui/product/add-to-cart.feature) |
| PRD-04 | Add a product to favorites when logged in | High | Automated | `@regression` `@ui` `@product` | [features/ui/product/favorites.feature](../features/ui/product/favorites.feature) |
| PRD-05 | An out-of-stock product cannot be added to the cart | Medium | Automated | `@regression` `@ui` `@product` `@edge` | [features/ui/product/out-of-stock.feature](../features/ui/product/out-of-stock.feature) |
| CRT-01 | Add multiple products and see them in the cart | Highest | Automated | `@smoke` `@regression` `@ui` `@cart` | [features/ui/cart/cart.feature](../features/ui/cart/cart.feature) |
| CRT-02 | Changing the quantity recalculates the totals | Highest | Automated | `@regression` `@ui` `@cart` | [features/ui/cart/cart.feature](../features/ui/cart/cart.feature) |
| CRT-03 | Remove an item from the cart | Highest | Automated | `@regression` `@ui` `@cart` | [features/ui/cart/cart.feature](../features/ui/cart/cart.feature) |
| CRT-04 | Empty cart state | Low | Automated | `@regression` `@ui` `@cart` | [features/ui/cart/cart.feature](../features/ui/cart/cart.feature) |
| CRT-05 | Cart persists after a page reload | High | Automated | `@regression` `@ui` `@cart` | [features/ui/cart/cart.feature](../features/ui/cart/cart.feature) |
| CHK-01 | End-to-end purchase as a logged-in customer | Highest | Automated | `@smoke` `@regression` `@e2e` `@checkout` | [features/ui/checkout/checkout-flow.feature](../features/ui/checkout/checkout-flow.feature) |
| CHK-02 | Billing address validation | High | Automated | `@regression` `@ui` `@checkout` `@data-driven` | [features/ui/checkout/address-validation.feature](../features/ui/checkout/address-validation.feature) |
| CHK-03 | Every payment method can complete an order | High | Automated | `@regression` `@ui` `@checkout` `@data-driven` | [features/ui/checkout/payment-methods.feature](../features/ui/checkout/payment-methods.feature) |
| CHK-04 | Invalid payment details are rejected | High | Automated | `@regression` `@ui` `@checkout` `@negative` | [features/ui/checkout/payment-validation.feature](../features/ui/checkout/payment-validation.feature) |
| CHK-05 | Order total equals the sum of price times quantity | Highest | Automated | `@regression` `@ui` `@checkout` | [features/ui/checkout/totals.feature](../features/ui/checkout/totals.feature) |
| CHK-06 | API-seeded user and cart, UI completes the checkout | Highest | Automated | `@smoke` `@regression` `@hybrid` `@checkout` | [features/hybrid/checkout-with-api-seed.feature](../features/hybrid/checkout-with-api-seed.feature) |
| CHK-07 | A completed order appears in My invoices | High | Automated | `@regression` `@hybrid` `@checkout` | [features/ui/checkout/invoices.feature](../features/ui/checkout/invoices.feature) |
| ACC-01 | Update profile details | High | Automated | `@regression` `@ui` `@account` | [features/ui/profile/profile.feature](../features/ui/profile/profile.feature) |
| ACC-02 | Change password and log in with the new one | High | Automated | `@regression` `@ui` `@account` | [features/ui/profile/password.feature](../features/ui/profile/password.feature) |
| FAV-01 | A favorite appears in the list and can be removed | High | Automated | `@regression` `@hybrid` `@favorites` | [features/ui/favorites/favorites.feature](../features/ui/favorites/favorites.feature) |
| CON-01 | Contact form submits successfully | High | Automated | `@regression` `@ui` `@contact` | [features/ui/contact/contact.feature](../features/ui/contact/contact.feature) |
| CON-02 | Contact form validation | Low | Automated | `@regression` `@ui` `@contact` `@data-driven` | [features/ui/contact/contact.feature](../features/ui/contact/contact.feature) |
| API-01 | List products returns a paginated, schema-valid response | Highest | Automated | `@smoke` `@regression` `@api` | [features/api/products.feature](../features/api/products.feature) |
| API-02 | Get a single product: found and not found | Highest | Automated | `@regression` `@api` | [features/api/products.feature](../features/api/products.feature) |
| API-03 | Sorting, price range and search parameters | High | Automated | `@regression` `@api` `@data-driven` | [features/api/products.feature](../features/api/products.feature) |
| API-10 | Product search endpoint | High | Automated | `@regression` `@api` `@data-driven` | [features/api/products.feature](../features/api/products.feature) |
| API-04 | Categories and brands endpoints | High | Automated | `@regression` `@api` | [features/api/catalog.feature](../features/api/catalog.feature) |
| API-05 | Login returns a token for valid credentials and 401 otherwise | Highest | Automated | `@smoke` `@regression` `@api` `@auth` | [features/api/auth.feature](../features/api/auth.feature) |
| API-06 | Register a user: success and rejection | Highest | Automated | `@regression` `@api` `@auth` `@data-driven` | [features/api/users.feature](../features/api/users.feature) |
| API-07 | Protected endpoints require a valid token | Highest | Automated | `@regression` `@api` `@auth` `@data-driven` | [features/api/auth.feature](../features/api/auth.feature) |
| API-08 | Responses stay within the time budget | Low | Automated | `@regression` `@api` `@performance` | [features/api/performance-budget.feature](../features/api/performance-budget.feature) |
| API-09 | Product contract: required fields and types | High | Automated | `@regression` `@api` `@contract` | [features/api/contract.feature](../features/api/contract.feature) |
| A11Y-01 | Accessibility scan of the home page | Medium | Automated | `@regression` `@a11y` | [features/a11y/accessibility.feature](../features/a11y/accessibility.feature) |
| A11Y-02 | Accessibility scan of the product detail page | Medium | Automated | `@regression` `@a11y` | [features/a11y/accessibility.feature](../features/a11y/accessibility.feature) |
| A11Y-03 | Accessibility scan of the login page | Medium | Automated | `@regression` `@a11y` | [features/a11y/accessibility.feature](../features/a11y/accessibility.feature) |
| A11Y-04 | Accessibility scan of the cart page | Medium | Automated | `@regression` `@a11y` | [features/a11y/accessibility.feature](../features/a11y/accessibility.feature) |
| VIS-01 | Visual snapshot of the header and navigation | Low | Automated | `@regression` `@visual` | [features/visual/visual.feature](../features/visual/visual.feature) |
| VIS-02 | Visual snapshot of the first product card | Low | Automated | `@regression` `@visual` | [features/visual/visual.feature](../features/visual/visual.feature) |
| VIS-03 | Visual snapshot of the footer | Low | Automated | `@regression` `@visual` | [features/visual/visual.feature](../features/visual/visual.feature) |
| RES-01 | Products API failure: the UI degrades gracefully | High | Automated | `@regression` `@resilience` | [features/resilience/network-failure.feature](../features/resilience/network-failure.feature) |
| RES-02 | Slow products response shows loading then content | Low | Automated | `@regression` `@resilience` | [features/resilience/network-failure.feature](../features/resilience/network-failure.feature) |
| RES-03 | Empty products list shows the empty state | Low | Automated | `@regression` `@resilience` | [features/resilience/network-failure.feature](../features/resilience/network-failure.feature) |
| KB-01 | Home page header controls have accessible names that contain their visible text | Medium | Known bug | `@known-bug` `@a11y` | [features/known-bugs/known-defects.feature](../features/known-bugs/known-defects.feature) |
| KB-02 | Cart page header controls have accessible names that contain their visible text | Medium | Known bug | `@known-bug` `@a11y` | [features/known-bugs/known-defects.feature](../features/known-bugs/known-defects.feature) |
| KB-03 | Home page filter lists only contain list items | Medium | Known bug | `@known-bug` `@a11y` | [features/known-bugs/known-defects.feature](../features/known-bugs/known-defects.feature) |
| KB-04 | Login page password visibility button has an accessible name | Medium | Known bug | `@known-bug` `@a11y` | [features/known-bugs/known-defects.feature](../features/known-bugs/known-defects.feature) |
| KB-05 | Products API failure shows the shopper an error message | Medium | Known bug | `@known-bug` `@resilience` | [features/known-bugs/known-defects.feature](../features/known-bugs/known-defects.feature) |
