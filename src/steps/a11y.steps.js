const { expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { Given, When, Then } = require('../fixtures');
const { createCart } = require('../utils/cartSeed');
const { seedCart } = require('../utils/session');
const { knownA11yDefects } = require('../data/knownDefects');

const BLOCKING = ['critical', 'serious'];

// Each "opened" step also records which page it is, for the known-defects lookup.
Given('I have opened the home page', async ({ homePage, ctx }) => {
  ctx.pageName = 'home';
  await homePage.open();
  await expect(homePage.cards.first()).toBeVisible();
});

Given('I have opened the product detail page', async ({ homePage, productPage, ctx }) => {
  ctx.pageName = 'product';
  await productPage.openByName(homePage, 'Combination Pliers');
  await expect(productPage.addToCartButton).toBeVisible();
});

Given('I have opened the login page', async ({ loginPage, ctx }) => {
  ctx.pageName = 'login';
  await loginPage.open();
  await expect(loginPage.submitButton).toBeVisible();
});

Given('I have opened the cart page', async ({ cartsApi, productsApi, page, cartPage, ctx }) => {
  ctx.pageName = 'cart';
  const cartId = await createCart({ cartsApi, productsApi }, [
    { name: 'Combination Pliers', quantity: 1 },
  ]);
  await seedCart(page, cartId, 1);
  // The site occasionally fails to show a cart it holds (badge says 1, body empty); reload then.
  await expect(async () => {
    await cartPage.open();
    await expect(cartPage.rows).toHaveCount(1, { timeout: 8_000 });
  }).toPass({ timeout: 40_000 });
});

When('I scan the page for accessibility violations', async ({ page, ctx }) => {
  ctx.violations = (await new AxeBuilder({ page }).analyze()).violations;
});

function summarize(violations) {
  return violations
    .map(
      (v) =>
        `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} elements, e.g. ${v.nodes[0].target.join(' ')})`,
    )
    .join('\n');
}

Then('there should be no critical or serious violations', async ({ ctx }) => {
  const known = knownA11yDefects.filter((d) => d.page === ctx.pageName).map((d) => d.rule);
  const blocking = ctx.violations.filter(
    (v) => BLOCKING.includes(v.impact) && !known.includes(v.id),
  );
  expect(blocking, `New accessibility violations:\n${summarize(blocking)}`).toEqual([]);
});

// Used by the @known-bug scenarios: asserts the correct behaviour, so it fails while the defect exists.
Then('there should be no {string} violations', async ({ ctx }, rule) => {
  const found = ctx.violations.filter((v) => v.id === rule);
  expect(found, `Violations of "${rule}":\n${summarize(found)}`).toEqual([]);
});
