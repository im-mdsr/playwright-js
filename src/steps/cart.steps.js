const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures');
const { createCart } = require('../utils/cartSeed');
const { seedCart } = require('../utils/session');
const { parseMoney, cents } = require('../utils/money');

// ---- Building the cart -----------------------------------------------------

When(
  'I add {int} unit(s) of {string} to the cart',
  async ({ homePage, productPage, ctx }, quantity, name) => {
    await homePage.open();
    await homePage.openProduct(name);
    await expect(productPage.name).toHaveText(name);
    await productPage.setQuantity(quantity);
    await productPage.addToCart();
    // The cart badge shows the running total, so waiting for it also waits for the add to finish.
    ctx.cartUnits = (ctx.cartUnits || 0) + quantity;
    await expect(productPage.header.cartQuantity).toHaveText(String(ctx.cartUnits));
  },
);

/** Gives the browser a cart that was built through the API and opens the cart page. */
async function seedBrowserCart({ cartsApi, productsApi, page, cartPage, ctx }, items) {
  ctx.cartId = await createCart({ cartsApi, productsApi }, items);
  ctx.cartUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  await seedCart(page, ctx.cartId, ctx.cartUnits);
  await cartPage.open();
}

Given(
  'the cart contains {int} unit(s) of {string}',
  async ({ cartsApi, productsApi, page, cartPage, ctx }, quantity, name) => {
    await seedBrowserCart({ cartsApi, productsApi, page, cartPage, ctx }, [{ name, quantity }]);
  },
);

Given(
  'the cart contains {int} unit(s) of {string} and {int} unit(s) of {string}',
  async ({ cartsApi, productsApi, page, cartPage, ctx }, quantity1, name1, quantity2, name2) => {
    await seedBrowserCart({ cartsApi, productsApi, page, cartPage, ctx }, [
      { name: name1, quantity: quantity1 },
      { name: name2, quantity: quantity2 },
    ]);
  },
);

Given(
  'the cart contains the following products:',
  async ({ cartsApi, productsApi, page, cartPage, ctx }, table) => {
    const items = table
      .hashes()
      .map((row) => ({ name: row.product, quantity: Number(row.quantity) }));
    await seedBrowserCart({ cartsApi, productsApi, page, cartPage, ctx }, items);
  },
);

Given('the cart is empty', async ({ homePage }) => {
  await homePage.open();
});

// ---- Using the cart --------------------------------------------------------

When('I open the cart', async ({ cartPage }) => {
  await cartPage.openFromHeader();
});

When('I change the quantity of {string} to {int}', async ({ cartPage }, name, quantity) => {
  await cartPage.setQuantity(name, quantity);
});

When('I remove {string} from the cart', async ({ cartPage }, name) => {
  await cartPage.remove(name);
});

When('I reload the page', async ({ page }) => {
  await page.reload();
});

// ---- Checking the cart -----------------------------------------------------

Then('the cart should list {string} with quantity {int}', async ({ cartPage }, name, quantity) => {
  await expect(cartPage.row(name)).toBeVisible();
  await expect(cartPage.quantityInput(name)).toHaveValue(String(quantity));
});

Then('the cart should not list {string}', async ({ cartPage }, name) => {
  await expect(cartPage.row(name)).toHaveCount(0);
});

Then('the line price should be the unit price times {int}', async ({ cartPage }, quantity) => {
  // Only one line is changed in the scenarios that use this step; check every line it applies to.
  await expect(async () => {
    const [line] = await cartPage.lines();
    expect(cents(parseMoney(line.linePrice))).toBe(cents(parseMoney(line.unitPrice) * quantity));
  }).toPass();
});

Then('the cart total should equal the sum of the line prices', async ({ cartPage }) => {
  await expect(async () => {
    const lines = await cartPage.lines();
    const sum = lines.reduce((total, line) => total + cents(parseMoney(line.linePrice)), 0);
    expect(cents(parseMoney(await cartPage.total.innerText()))).toBe(sum);
  }).toPass();
});

Then(
  'the cart total should equal the sum of price times quantity within 0.01',
  async ({ cartPage }) => {
    await expect(async () => {
      const lines = await cartPage.lines();
      expect(lines.length).toBeGreaterThan(0);
      const expected = lines.reduce(
        (total, line) => total + parseMoney(line.unitPrice) * line.quantity,
        0,
      );
      const shown = parseMoney(await cartPage.total.innerText());
      expect(Math.abs(shown - expected)).toBeLessThanOrEqual(0.01);
    }).toPass();
  },
);

// The site shows no message for an empty cart: only the step header remains, with no rows.
Then('I should see an empty cart', async ({ cartPage, page }) => {
  await expect(page).toHaveURL(/\/checkout/);
  await expect(cartPage.rows).toHaveCount(0);
});

Then('I should not be able to proceed to checkout', async ({ cartPage }) => {
  await expect(cartPage.proceed).toBeHidden();
});
