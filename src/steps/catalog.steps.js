const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures');
const { parseMoney } = require('../utils/money');

const CARDS_PER_PAGE = 9;

Given('I am on the home page', async ({ homePage }) => {
  await homePage.open();
  await expect(homePage.cards.first()).toBeVisible();
});

// ---- Search ----------------------------------------------------------------

When('I search for {string}', async ({ homePage }, term) => {
  await homePage.search(term);
});

Then('I should see {int} product cards', async ({ homePage }, count) => {
  await expect(homePage.cards).toHaveCount(count);
});

Then('I should see at least {int} product(s)', async ({ homePage }, min) => {
  await expect(homePage.cards.nth(min - 1)).toBeVisible();
});

Then('I should see no products', async ({ homePage }) => {
  await expect(homePage.cards).toHaveCount(0);
});

Then('I should see the no-results message', async ({ homePage }) => {
  await expect(homePage.noResults).toHaveText('There are no products found.');
});

Then('every product card should show a name, a price and an image', async ({ homePage }) => {
  const count = await homePage.cards.count();
  for (let i = 0; i < count; i++) {
    const card = homePage.cards.nth(i);
    await expect(card.getByTestId('product-name')).toHaveText(/\S/);
    await expect(card.getByTestId('product-price')).toHaveText(/^\$\d+\.\d{2}$/);
    await expect(card.locator('img')).toBeVisible();
  }
});

Then('every product should match {string}', async ({ homePage }, term) => {
  // The list refreshes asynchronously after the search, so retry until the old cards are gone.
  await expect(async () => {
    const names = await homePage.productNames();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) expect(name.toLowerCase()).toContain(term.toLowerCase());
  }).toPass();
});

// ---- Filters: checked against the full catalog from the API ------------------

When('I filter by category {string}', async ({ homePage }, category) => {
  await homePage.filterBy(category);
});

When('I filter by brand {string}', async ({ homePage }, brand) => {
  await homePage.filterBy(brand);
});

async function expectOnlyProductsWhere({ homePage, productsApi, ctx }, matches) {
  ctx.catalog ??= await productsApi.all();
  const allowed = new Set(ctx.catalog.filter(matches).map((p) => p.name));
  expect(allowed.size, 'the catalog has no product for this filter').toBeGreaterThan(0);
  await expect(async () => {
    const names = await homePage.productNames();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) expect(allowed, `"${name}" is not allowed`).toContain(name);
  }).toPass();
  return allowed;
}

Then(
  'every product should belong to category {string}',
  async ({ homePage, productsApi, ctx }, category) => {
    await expectOnlyProductsWhere(
      { homePage, productsApi, ctx },
      (p) => p.category.name === category,
    );
  },
);

Then(
  'every product should belong to brand {string}',
  async ({ homePage, productsApi, ctx }, brand) => {
    await expectOnlyProductsWhere({ homePage, productsApi, ctx }, (p) => p.brand.name === brand);
  },
);

Then(
  'the number of products should match the API for category {string}',
  async ({ homePage, productsApi, ctx }, category) => {
    const allowed = await expectOnlyProductsWhere(
      { homePage, productsApi, ctx },
      (p) => p.category.name === category,
    );
    await expect(homePage.cards).toHaveCount(Math.min(allowed.size, CARDS_PER_PAGE));
  },
);

// ---- Sorting ---------------------------------------------------------------

When('I sort the products by {string}', async ({ homePage }, option) => {
  await homePage.sortBy(option);
});

Then('the products should be ordered by {word} {word}', async ({ homePage }, field, direction) => {
  const factor = direction === 'ascending' ? 1 : -1;
  await expect(async () => {
    const values =
      field === 'price'
        ? (await homePage.productPrices()).map(parseMoney)
        : await homePage.productNames();
    expect(values.length).toBeGreaterThan(1);
    for (let i = 1; i < values.length; i++) {
      const order =
        field === 'price'
          ? values[i - 1] - values[i]
          : values[i - 1].localeCompare(values[i], 'en', { sensitivity: 'base' });
      expect(order * factor, `${values[i - 1]} before ${values[i]}`).toBeLessThanOrEqual(0);
    }
  }).toPass();
});

// ---- Pagination ------------------------------------------------------------

Given('I note the product names on page 1', async ({ homePage, ctx }) => {
  ctx.firstPage = await homePage.productNames();
  expect(ctx.firstPage).toHaveLength(CARDS_PER_PAGE);
});

When('I go to the next page', async ({ homePage }) => {
  await homePage.goToNextPage();
});

When('I go to the previous page', async ({ homePage }) => {
  await homePage.goToPreviousPage();
});

Then('I should see different products from page 1', async ({ homePage, ctx }) => {
  await expect(async () => {
    ctx.secondPage = await homePage.productNames();
    expect(ctx.secondPage.length).toBeGreaterThan(0);
    expect(ctx.secondPage[0]).not.toBe(ctx.firstPage[0]);
  }).toPass();
});

Then('no product should appear on both pages', async ({ ctx }) => {
  const overlap = ctx.secondPage.filter((name) => ctx.firstPage.includes(name));
  expect(overlap).toEqual([]);
});

Then('I should see the same products as the first visit to page 1', async ({ homePage, ctx }) => {
  await expect(async () => {
    expect(await homePage.productNames()).toEqual(ctx.firstPage);
  }).toPass();
});

// ---- Language --------------------------------------------------------------

// Nav labels verified on the live site for the two languages the scenario uses.
const NAV_LABELS = {
  EN: { home: 'Home', contact: 'Contact' },
  DE: { home: 'Start', contact: 'Kontakt' },
};

When('I switch the language to {string}', async ({ homePage }, code) => {
  await homePage.switchLanguage(code);
});

Then('the navigation labels should be shown in {string}', async ({ homePage }, code) => {
  const labels = NAV_LABELS[code];
  if (!labels) throw new Error(`No expected labels for language "${code}"`);
  await expect(homePage.navHome).toHaveText(labels.home);
  await expect(homePage.navContact).toHaveText(labels.contact);
});

// ---- Hybrid: UI versus API -------------------------------------------------

Given('the API returns products for page {int}', async ({ productsApi, ctx }, page) => {
  ctx.apiProducts = (await (await productsApi.list(page)).json()).data;
});

Then(
  'the product names and prices shown should equal the API data in the same order',
  async ({ homePage, ctx }) => {
    await expect(async () => {
      expect(await homePage.productNames()).toEqual(ctx.apiProducts.map((p) => p.name));
      expect((await homePage.productPrices()).map(parseMoney)).toEqual(
        ctx.apiProducts.map((p) => p.price),
      );
    }).toPass();
  },
);
