const { expect } = require('@playwright/test');
const { When, Then, Given } = require('../fixtures');
const { schemaErrors } = require('../utils/schema');
const { productSchema } = require('../schemas/product.schema');
const { categorySchema, brandSchema } = require('../schemas/catalog.schema');

// Sorting of text follows the API's own collation; compare ignoring case and accents.
const byName = (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' });

function isSorted(values, compare, direction) {
  const factor = direction === 'ascending' ? 1 : -1;
  return values.every((value, i) => i === 0 || compare(values[i - 1], value) * factor <= 0);
}

// ---- Single product --------------------------------------------------------

Given('an existing product id taken from the product list', async ({ productsApi, ctx }) => {
  const { data } = await (await productsApi.list(1)).json();
  ctx.productId = data[0].id;
});

When('I request that product', async ({ productsApi, ctx }) => {
  ctx.response = await productsApi.get(ctx.productId);
});

When('I request the product with id {string}', async ({ productsApi, ctx }, id) => {
  ctx.response = await productsApi.get(id);
});

Then('the product should match the product schema', async ({ ctx }) => {
  expect(schemaErrors(productSchema, await ctx.response.json())).toEqual([]);
});

Then('the message should be {string}', async ({ ctx }, message) => {
  expect((await ctx.response.json()).message).toBe(message);
});

// ---- Query parameters and search -------------------------------------------

When('I request products with query {string}', async ({ productsApi, ctx }, query) => {
  ctx.response = await productsApi.query(query);
});

Then('prices are in ascending order', async ({ ctx }) => {
  const prices = (await ctx.response.json()).data.map((p) => p.price);
  expect(prices.length).toBeGreaterThan(1);
  expect(
    isSorted(prices, (a, b) => a - b, 'ascending'),
    prices.join(', '),
  ).toBe(true);
});

Then('names are in descending order', async ({ ctx }) => {
  const names = (await ctx.response.json()).data.map((p) => p.name);
  expect(names.length).toBeGreaterThan(1);
  expect(isSorted(names, byName, 'descending'), names.join(' | ')).toBe(true);
});

Then(/^every price is between (\d+) and (\d+)$/, async ({ ctx }, min, max) => {
  const { data } = await ctx.response.json();
  expect(data.length).toBeGreaterThan(0);
  for (const product of data) {
    expect(product.price, product.name).toBeGreaterThanOrEqual(Number(min));
    expect(product.price, product.name).toBeLessThanOrEqual(Number(max));
  }
});

When('I search products for {string}', async ({ productsApi, ctx }, term) => {
  ctx.response = await productsApi.search(term);
});

Then(/^the total of results should be (greater than zero|zero)$/, async ({ ctx }, outcome) => {
  const { total } = await ctx.response.json();
  if (outcome === 'zero') expect(total).toBe(0);
  else expect(total).toBeGreaterThan(0);
});

// ---- Categories and brands -------------------------------------------------

When('I request the categories', async ({ catalogApi, ctx }) => {
  ctx.response = await catalogApi.categories();
});

When('I request the brands', async ({ catalogApi, ctx }) => {
  ctx.response = await catalogApi.brands();
});

When('I request the category tree', async ({ catalogApi, ctx }) => {
  ctx.response = await catalogApi.categoryTree();
});

Then('the list should not be empty', async ({ ctx }) => {
  const list = await ctx.response.json();
  expect(Array.isArray(list)).toBe(true);
  expect(list.length).toBeGreaterThan(0);
  const schema = ctx.response.url().endsWith('/brands') ? brandSchema : categorySchema;
  for (const item of list) expect(schemaErrors(schema, item), item.name).toEqual([]);
});

Then(
  'the response should contain the brands {string} and {string}',
  async ({ ctx }, first, second) => {
    const names = (await ctx.response.json()).map((brand) => brand.name);
    expect(names).toEqual(expect.arrayContaining([first, second]));
  },
);

// ---- Contract --------------------------------------------------------------

Then(
  'every product should have a string {string}, a string {string} and a numeric {string}',
  async ({ ctx }, stringField1, stringField2, numberField) => {
    const { data } = await ctx.response.json();
    expect(data.length).toBeGreaterThan(0);
    for (const product of data) {
      expect(typeof product[stringField1], `${product.name}.${stringField1}`).toBe('string');
      expect(typeof product[stringField2], `${product.name}.${stringField2}`).toBe('string');
      expect(typeof product[numberField], `${product.name}.${numberField}`).toBe('number');
    }
  },
);

Then('every product should have a category name and a brand name', async ({ ctx }) => {
  const { data } = await ctx.response.json();
  for (const product of data) {
    expect(product.category?.name, `${product.name} category`).toEqual(expect.any(String));
    expect(product.brand?.name, `${product.name} brand`).toEqual(expect.any(String));
  }
});

Then('{string} and {string} should be booleans', async ({ ctx }, field1, field2) => {
  const { data } = await ctx.response.json();
  for (const product of data) {
    expect(typeof product[field1], `${product.name}.${field1}`).toBe('boolean');
    expect(typeof product[field2], `${product.name}.${field2}`).toBe('boolean');
  }
});
