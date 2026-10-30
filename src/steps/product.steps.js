const { expect, test } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures');
const { parseMoney } = require('../utils/money');

Given('I am on the page of the product {string}', async ({ productPage, homePage }, name) => {
  await productPage.openByName(homePage, name);
});

// ---- Detail ----------------------------------------------------------------

When('I open the product {string}', async ({ homePage, productPage, ctx }, name) => {
  // Remember what the list card showed, to compare with the detail page afterwards.
  const card = homePage.card(name);
  ctx.card = {
    name,
    price: (await card.getByTestId('product-price').innerText()).trim(),
  };
  await homePage.openProduct(name);
  await productPage.name.waitFor();
});

Then('the product detail should match the list card', async ({ productPage, ctx }) => {
  await expect(productPage.name).toHaveText(ctx.card.name);
  expect(parseMoney(await productPage.unitPrice.innerText())).toBe(parseMoney(ctx.card.price));
});

Then('the product detail should match the API data', async ({ productPage, productsApi, ctx }) => {
  const product = await productsApi.findByName(ctx.card.name);
  await expect(productPage.name).toHaveText(product.name);
  expect(parseMoney(await productPage.unitPrice.innerText())).toBe(product.price);
  await expect(productPage.description).toHaveText(product.description);
});

// ---- Quantity --------------------------------------------------------------

When('I increase the quantity {int} time(s)', async ({ productPage }, times) => {
  for (let i = 0; i < times; i++) await productPage.increase.click();
});

When('I decrease the quantity {int} time(s)', async ({ productPage }, times) => {
  for (let i = 0; i < times; i++) await productPage.decrease.click();
});

Then('the quantity should be {int}', async ({ productPage }, quantity) => {
  await expect(productPage.quantity).toHaveValue(String(quantity));
});

// ---- Cart and favorites ----------------------------------------------------

When('I add the product to the cart', async ({ productPage }) => {
  await productPage.addToCart();
});

Then('I should see the toast {string}', async ({ productPage }, message) => {
  await expect(productPage.toast).toContainText(message);
});

Then('the cart count should be {int}', async ({ productPage }, count) => {
  await expect(productPage.header.cartQuantity).toHaveText(String(count));
});

When('I add the product to favorites', async ({ productPage }) => {
  await productPage.addToFavorites();
});

Then('I should see a favorite confirmation', async ({ productPage }) => {
  await expect(productPage.toast).toContainText('Product added to your favorites list.');
});

Then('{string} should be listed in my favorites', async ({ favoritesPage }, name) => {
  await favoritesPage.open();
  await expect(favoritesPage.item(name)).toBeVisible();
});

// ---- Out of stock ----------------------------------------------------------

Given('an out-of-stock product exists', async ({ productsApi, ctx }) => {
  const product = (await productsApi.all()).find((p) => !p.in_stock);
  // The catalog is shared and changes; with no such product the scenario cannot run, which is not
  // a failure of the application.
  // eslint-disable-next-line playwright/no-skipped-test -- data-dependent precondition
  test.skip(!product, 'No out-of-stock product in the catalog right now');
  ctx.outOfStock = product;
});

Given('I am on the page of that product', async ({ productPage, ctx }) => {
  await productPage.openById(ctx.outOfStock.id);
});

Then('I should see the out-of-stock marker', async ({ productPage }) => {
  await expect(productPage.outOfStock).toBeVisible();
});

Then('I should not be able to add it to the cart', async ({ productPage }) => {
  await expect(productPage.addToCartButton).toBeDisabled();
});
