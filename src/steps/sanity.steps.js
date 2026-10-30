const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures');

Given('I open the home page', async ({ page }) => {
  await page.goto('/');
});

Then('the page title should contain {string}', async ({ page }, text) => {
  await expect(page).toHaveTitle(new RegExp(text));
});

Then('I should see the product list', async ({ page }) => {
  await expect(page.getByTestId('product-name').first()).toBeVisible();
});

When('I request {string} from the API', async ({ api, ctx }, path) => {
  ctx.response = await api.get(path);
});

Then('the API response status should be {int}', async ({ ctx }, status) => {
  expect(ctx.response.status()).toBe(status);
});
