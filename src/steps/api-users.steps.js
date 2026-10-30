const { expect } = require('@playwright/test');
const { When, Then } = require('../fixtures');
const { buildUser } = require('../utils/dataFactory');
const { toApiPayload } = require('../api/UsersApi');

// ---- Registration ----------------------------------------------------------

When(
  /^I register through the API with (a valid unique user|the same email again|a payload without the email|a payload without the password)$/,
  async ({ api, usersApi, ctx }, kind) => {
    const user = buildUser();
    switch (kind) {
      case 'a valid unique user':
        ctx.response = await usersApi.register(user);
        break;
      case 'the same email again':
        // Scenario outline rows run in isolation, so create the first account here.
        await usersApi.create(user);
        ctx.response = await usersApi.register(buildUser({ email: user.email }));
        break;
      default: {
        const field = kind === 'a payload without the email' ? 'email' : 'password';
        const payload = toApiPayload(user);
        delete payload[field];
        ctx.response = await api.post('/users/register', { data: payload });
      }
    }
  },
);

// ---- Response time ---------------------------------------------------------

When('I request {string}', async ({ api, ctx }, endpoint) => {
  const started = Date.now();
  ctx.response = await api.get(endpoint);
  ctx.elapsedMs = Date.now() - started;
});

Then('the response time should be under {int} ms', async ({ ctx }, budget) => {
  expect(ctx.response.ok(), `HTTP ${ctx.response.status()}`).toBe(true);
  expect(ctx.elapsedMs).toBeLessThan(budget);
});
