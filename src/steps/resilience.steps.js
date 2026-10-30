const { expect } = require('@playwright/test');
const { Given, Then } = require('../fixtures');

// The home page lists products through /products and /products/search (not the detail pages).
const PRODUCT_LIST = /\/products(\/search)?(\?.*)?$/;

const EMPTY_LIST = {
  current_page: 1,
  data: [],
  from: null,
  last_page: 1,
  per_page: 9,
  to: null,
  total: 0,
};

/** Collects uncaught page errors from now on; read them later from ctx.pageErrors. */
function recordPageErrors(page, ctx) {
  ctx.pageErrors = [];
  page.on('pageerror', (error) => ctx.pageErrors.push(error.message));
}

Given('the products API responds with status {int}', async ({ page, ctx }, status) => {
  recordPageErrors(page, ctx);
  await page.route(PRODUCT_LIST, (route) =>
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Simulated failure' }),
    }),
  );
});

Given('the products API responds after {int} seconds', async ({ page }, seconds) => {
  await page.route(PRODUCT_LIST, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    await route.continue();
  });
});

Given('the products API returns an empty list', async ({ page }) => {
  await page.route(PRODUCT_LIST, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(EMPTY_LIST),
    }),
  );
});

// "I open the home page" is defined in sanity.steps.js: it navigates without waiting for products.

Then('there should be no uncaught page errors', async ({ ctx }) => {
  expect(ctx.pageErrors).toEqual([]);
});

// The site shows skeleton placeholder cards while the list loads.
Then('I should see the loading state', async ({ page }) => {
  await expect(page.locator('.card.skeleton').first()).toBeVisible();
});

Then('I should see {int} product cards after loading', async ({ homePage }, count) => {
  await expect(homePage.cards).toHaveCount(count);
});

Then('I should see an error or empty state', async ({ page }) => {
  await expect(
    page
      .getByTestId('no-results')
      .or(page.getByRole('alert'))
      .or(page.getByText(/something went wrong|try again|could not load|error/i)),
  ).toBeVisible();
});
