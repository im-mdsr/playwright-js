const { expect } = require('@playwright/test');
const { When, Then } = require('../fixtures');
const { demo } = require('../config/env');
const { schemaErrors } = require('../utils/schema');
const { productSchema, paginationFields } = require('../schemas/product.schema');

const JWT = /^[\w-]+\.[\w-]+\.[\w-]+$/;

When('I log in through the API with the demo customer credentials', async ({ authApi, ctx }) => {
  ctx.response = await authApi.login(demo.email, demo.password);
});

When('I log in through the API with a wrong password', async ({ authApi, ctx }) => {
  ctx.response = await authApi.login(demo.email, 'Wrong#123');
});

When(
  /^I request "([^"]+)" with (no token|a valid token|a tampered one)$/,
  async ({ api, authApi, ctx }, endpoint, tokenKind) => {
    let token;
    if (tokenKind !== 'no token') {
      token = await authApi.token(demo.email, demo.password);
      if (tokenKind === 'a tampered one') token = `${token.slice(0, -4)}XXXX`;
    }
    ctx.response = await api.get(endpoint, { token });
  },
);

Then('the response status should be {int}', async ({ ctx }, status) => {
  expect(ctx.response.status()).toBe(status);
});

Then('the response should contain a JWT access token', async ({ ctx }) => {
  const body = await ctx.response.json();
  expect(body.access_token).toMatch(JWT);
});

Then('the error should be {string}', async ({ ctx }, message) => {
  const body = await ctx.response.json();
  expect(body.error).toBe(message);
});

// ---- Products --------------------------------------------------------------

When('I request the products list for page {int}', async ({ productsApi, ctx }, page) => {
  ctx.response = await productsApi.list(page);
});

Then('the response should contain the pagination fields', async ({ ctx }) => {
  const body = await ctx.response.json();
  expect(Object.keys(body)).toEqual(expect.arrayContaining(paginationFields));
});

Then('the page should contain {int} products', async ({ ctx }, count) => {
  const body = await ctx.response.json();
  expect(body.data).toHaveLength(count);
});

Then('every product should match the product schema', async ({ ctx }) => {
  const { data } = await ctx.response.json();
  for (const product of data) {
    expect(schemaErrors(productSchema, product), `product "${product.name}"`).toEqual([]);
  }
});
