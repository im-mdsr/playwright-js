const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures');

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.open();
});

Given('I am on the registration page', async ({ registerPage }) => {
  await registerPage.open();
});

When('I open the {string} page directly', async ({ page }, path) => {
  await page.goto(path);
});

Then(/^I should (?:be on|be redirected to|remain on) the login page$/, async ({ page }) => {
  await expect(page).toHaveURL(/\/auth\/login/);
});

Then('I should remain on the registration page', async ({ page }) => {
  await expect(page).toHaveURL(/\/auth\/register/);
});

const NAMED_PAGES = {
  'My account': { url: /\/account$/, title: 'My account' },
};

Then('I should be on the {string} page', async ({ page, accountPage }, name) => {
  const target = NAMED_PAGES[name];
  if (!target) throw new Error(`Unknown page "${name}". Add it to NAMED_PAGES in common.steps.js`);
  await expect(page).toHaveURL(target.url);
  await expect(accountPage.title).toHaveText(target.title);
});

// Messages verified against the live site (see DISCOVERY_FINDINGS.md).
const REQUIRED = {
  email: 'Email is required',
  password: 'Password is required',
};

Then('I should see a required-field error for {string}', async ({ page }, fields) => {
  for (const field of fields.split(' and ')) {
    await expect(page.getByTestId(`${field}-error`)).toContainText(REQUIRED[field]);
  }
});
