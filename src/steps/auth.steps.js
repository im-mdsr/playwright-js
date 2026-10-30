const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures');
const { demo } = require('../config/env');
const { buildUser } = require('../utils/dataFactory');
const { signInWithToken } = require('../utils/session');

// ---- Login -----------------------------------------------------------------

Given('I am logged in as the demo customer', async ({ authApi, accountPage, page }) => {
  const token = await authApi.token(demo.email, demo.password);
  await signInWithToken(page, token);
  await accountPage.open();
  await expect(accountPage.header.userMenu).toBeVisible();
});

When('I log in with the demo customer credentials', async ({ loginPage }) => {
  await loginPage.login(demo.email, demo.password);
});

When(
  'I log in with the demo customer email and password {string}',
  async ({ loginPage }, password) => {
    await loginPage.login(demo.email, password);
  },
);

When(
  'I log in with an unregistered email and password {string}',
  async ({ loginPage }, password) => {
    await loginPage.login(buildUser().email, password);
  },
);

// In scenario tables the word "valid" stands for the demo customer's real value.
When(
  'I log in with email {string} and password {string}',
  async ({ loginPage }, email, password) => {
    await loginPage.login(
      email === 'valid' ? demo.email : email,
      password === 'valid' ? demo.password : password,
    );
  },
);

When("I log in with the new user's credentials", async ({ loginPage, ctx }) => {
  await loginPage.login(ctx.user.email, ctx.user.password);
});

Then('I should see the invalid credentials error', async ({ loginPage }) => {
  await expect(loginPage.loginError).toHaveText('Invalid email or password');
});

Then('my name should be shown in the header menu', async ({ accountPage }) => {
  await expect(accountPage.header.userMenu).toHaveText(/\S/);
});

// ---- Logout ----------------------------------------------------------------

When('I sign out from the user menu', async ({ accountPage }) => {
  await accountPage.header.signOut();
});

// ---- Registration ----------------------------------------------------------

When('I register a new user with valid unique details', async ({ registerPage, ctx }) => {
  ctx.user = buildUser();
  await registerPage.register(ctx.user);
});

Given('a registered user exists', async ({ newUser, ctx }) => {
  ctx.user = newUser;
});

When("I register using that user's email", async ({ registerPage, ctx }) => {
  await registerPage.register(buildUser({ email: ctx.user.email }));
});

When('I submit the registration form with {string}', async ({ registerPage }, scenario) => {
  if (scenario === 'a malformed email') await registerPage.email.fill('abc@');
  if (scenario === 'a weak password') await registerPage.password.fill('123');
  await registerPage.submit();
});

// Messages verified against the live site (see DISCOVERY_FINDINGS.md).
const REGISTRATION_ERRORS = {
  'all fields empty': {
    'first-name': 'First name is required',
    'last-name': 'Last name is required',
    email: 'Email is required',
    password: 'Password is required',
  },
  'a malformed email': { email: 'Email format is invalid' },
  'a weak password': { password: 'Password must be minimal 6 characters long' },
};

Then('I should see the validation error for {string}', async ({ registerPage }, scenario) => {
  const expected = REGISTRATION_ERRORS[scenario];
  if (!expected) throw new Error(`Unknown registration case "${scenario}"`);
  for (const [field, message] of Object.entries(expected)) {
    await expect(registerPage.errorFor(field)).toContainText(message);
  }
});

Then('I should see the "email already registered" error', async ({ registerPage }) => {
  await expect(registerPage.alert).toContainText(/already exists/i);
});

// ---- Forgot password -------------------------------------------------------

When('I click the forgot password link', async ({ loginPage }) => {
  await loginPage.forgotPasswordLink.click();
});

Then('I should see the forgot password form', async ({ forgotPasswordPage }) => {
  await expect(forgotPasswordPage.form).toBeVisible();
});

When('I submit the forgot password form without an email', async ({ forgotPasswordPage }) => {
  await forgotPasswordPage.submit();
});
