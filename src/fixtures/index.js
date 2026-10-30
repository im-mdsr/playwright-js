const { test: base, createBdd } = require('playwright-bdd');
const { ApiClient } = require('../api/ApiClient');
const { AuthApi } = require('../api/AuthApi');
const { UsersApi } = require('../api/UsersApi');
const { ProductsApi } = require('../api/ProductsApi');
const { CartsApi } = require('../api/CartsApi');
const { CatalogApi } = require('../api/CatalogApi');
const { FavoritesApi } = require('../api/FavoritesApi');
const { InvoicesApi } = require('../api/InvoicesApi');
const { LoginPage } = require('../pages/LoginPage');
const { RegisterPage } = require('../pages/RegisterPage');
const { ForgotPasswordPage } = require('../pages/ForgotPasswordPage');
const { AccountPage } = require('../pages/AccountPage');
const { HomePage } = require('../pages/HomePage');
const { ProductPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { FavoritesPage } = require('../pages/FavoritesPage');
const { InvoicesPage } = require('../pages/InvoicesPage');
const { ProfilePage } = require('../pages/ProfilePage');
const { ContactPage } = require('../pages/ContactPage');
const { buildUser } = require('../utils/dataFactory');

// Fixtures are lazy: a scenario only pays for the ones its steps actually use.
const test = base.extend({
  // Per-scenario scratch space for values shared between steps (fresh for every scenario).
  ctx: async ({}, use) => {
    await use({});
  },

  // API layer
  api: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
  authApi: async ({ api }, use) => {
    await use(new AuthApi(api));
  },
  usersApi: async ({ api }, use) => {
    await use(new UsersApi(api));
  },

  productsApi: async ({ api }, use) => {
    await use(new ProductsApi(api));
  },
  catalogApi: async ({ api }, use) => {
    await use(new CatalogApi(api));
  },
  cartsApi: async ({ api }, use) => {
    await use(new CartsApi(api));
  },

  favoritesApi: async ({ api }, use) => {
    await use(new FavoritesApi(api));
  },
  invoicesApi: async ({ api }, use) => {
    await use(new InvoicesApi(api));
  },

  // A brand-new customer created through the API, unique to the scenario.
  newUser: async ({ usersApi }, use) => {
    await use(await usersApi.create(buildUser()));
  },

  // Page objects
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  favoritesPage: async ({ page }, use) => {
    await use(new FavoritesPage(page));
  },
  invoicesPage: async ({ page }, use) => {
    await use(new InvoicesPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
});

const { Given, When, Then, Before } = createBdd(test);

module.exports = { test, Given, When, Then, Before };
