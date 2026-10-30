const { expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const { Given, When, Then } = require('../fixtures');
const { signInWithToken } = require('../utils/session');

// ---- Sign-in shortcuts -----------------------------------------------------

Given('I am logged in as a new API-created user', async ({ newUser, authApi, page, ctx }) => {
  ctx.user = newUser;
  await signInWithToken(page, await authApi.token(newUser.email, newUser.password));
});

Given(
  'a new user with the favorite {string} exists through the API',
  async ({ newUser, authApi, productsApi, favoritesApi, ctx }, productName) => {
    ctx.user = newUser;
    const product = await productsApi.findByName(productName);
    await favoritesApi.add(await authApi.token(newUser.email, newUser.password), product.id);
  },
);

// ---- Profile ---------------------------------------------------------------

When('I open my profile', async ({ profilePage }) => {
  await profilePage.open();
});

When('I change my phone and city and save', async ({ profilePage, ctx }) => {
  ctx.newPhone = faker.string.numeric(10);
  ctx.newCity = `${faker.location.city()} ${faker.string.alpha({ length: 4 })}`;
  await profilePage.updatePhoneAndCity(ctx.newPhone, ctx.newCity);
});

Then('I should see the profile saved message', async ({ profilePage }) => {
  await expect(profilePage.alert).toContainText('Your profile is successfully updated!');
});

When('I reload my profile', async ({ profilePage }) => {
  await profilePage.reload();
});

Then('my profile should show the new phone and city', async ({ profilePage, ctx }) => {
  await expect(profilePage.phone).toHaveValue(ctx.newPhone);
  await expect(profilePage.city).toHaveValue(ctx.newCity);
});

// ---- Password --------------------------------------------------------------

When('I change my password to a new strong password', async ({ profilePage, ctx }) => {
  // Upper and lower case, a digit and a symbol: the rules the profile page lists.
  ctx.newPassword = `Zz9#${faker.string.alphanumeric(10)}`;
  await profilePage.open();
  await profilePage.updatePassword(ctx.user.password, ctx.newPassword);
});

Then('I should see the password changed message', async ({ profilePage }) => {
  await expect(profilePage.alert).toContainText('Your password is successfully updated!');
});

When('I log in with the new password', async ({ loginPage, ctx }) => {
  await loginPage.login(ctx.user.email, ctx.newPassword);
});

When('I log in with the old password', async ({ loginPage, ctx }) => {
  await loginPage.login(ctx.user.email, ctx.user.password);
});

// ---- Favorites -------------------------------------------------------------

When('I open my favorites', async ({ favoritesPage }) => {
  await favoritesPage.open();
});

Then('{string} should be listed', async ({ favoritesPage }, name) => {
  await expect(favoritesPage.item(name)).toBeVisible();
});

When('I remove {string} from my favorites', async ({ favoritesPage }, name) => {
  await favoritesPage.remove(name);
});

Then('my favorites list should be empty', async ({ favoritesPage }) => {
  await expect(favoritesPage.emptyMessage).toBeVisible();
  await expect(favoritesPage.items).toHaveCount(0);
});
