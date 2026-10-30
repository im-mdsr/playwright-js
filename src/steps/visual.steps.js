const { expect } = require('@playwright/test');
const { Given, Then } = require('../fixtures');

Given('I am on the home page with dynamic content masked', async ({ homePage, page, ctx }) => {
  await homePage.open();
  await expect(homePage.cards.first()).toBeVisible();
  // Product images load lazily; compare only once the first card's image has really loaded.
  await expect(homePage.cards.first().locator('img')).toHaveJSProperty('complete', true);
  // Floating widgets that can change between runs.
  ctx.masks = [page.getByTestId('chat-toggle'), page.getByTestId('live-activity-toggle')];
});

Then('the header and navigation should match its visual baseline', async ({ page, ctx }) => {
  await expect(page.getByRole('navigation').first()).toHaveScreenshot('header.png', {
    mask: ctx.masks,
  });
});

Then('the first product card should match its visual baseline', async ({ homePage, ctx }) => {
  await expect(homePage.cards.first()).toHaveScreenshot('first-product-card.png', {
    mask: ctx.masks,
  });
});

Then('the footer should match its visual baseline', async ({ page, ctx }) => {
  await expect(page.getByRole('contentinfo')).toHaveScreenshot('footer.png', { mask: ctx.masks });
});
