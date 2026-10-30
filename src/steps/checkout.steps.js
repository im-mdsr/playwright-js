const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures');
const { buildAddress } = require('../utils/dataFactory');
const { signInWithToken, seedCart } = require('../utils/session');
const { createCart } = require('../utils/cartSeed');
const { parseMoney } = require('../utils/money');

// ---- API seeding -----------------------------------------------------------

const SEED_PRODUCTS = ['Combination Pliers', 'Pliers'];

Given(
  'a new user and a cart with {int} products are created through the API',
  async ({ newUser, cartsApi, productsApi, ctx }, count) => {
    ctx.user = newUser;
    const items = SEED_PRODUCTS.slice(0, count).map((name) => ({ name, quantity: 1 }));
    ctx.cartId = await createCart({ cartsApi, productsApi }, items);
    ctx.cartUnits = items.length;
  },
);

Given(
  'a new user places an order through the API',
  async ({ newUser, authApi, cartsApi, productsApi, invoicesApi, ctx }) => {
    ctx.user = newUser;
    // The cart is consumed by the order, so it is deliberately not kept in ctx for the browser.
    const cartId = await createCart({ cartsApi, productsApi }, [
      { name: 'Combination Pliers', quantity: 2 },
    ]);
    const token = await authApi.token(newUser.email, newUser.password);
    ctx.invoice = await invoicesApi.place(token, cartId);
  },
);

Given('I am logged in as that user in the browser', async ({ authApi, page, ctx, homePage }) => {
  const token = await authApi.token(ctx.user.email, ctx.user.password);
  await signInWithToken(page, token);
  if (ctx.cartId) await seedCart(page, ctx.cartId, ctx.cartUnits);
  await homePage.open();
  await expect(homePage.header.userMenu).toBeVisible();
});

// ---- Invoices --------------------------------------------------------------

When('I open my invoices', async ({ invoicesPage }) => {
  await invoicesPage.open();
});

Then(
  'my invoices should list the new invoice number with the correct total',
  async ({ invoicesPage, ctx }) => {
    const row = invoicesPage.rowFor(ctx.invoice.invoice_number);
    await expect(row).toBeVisible();
    expect(parseMoney(await row.innerText())).toBeGreaterThan(0);
    await expect(row).toContainText(`$${ctx.invoice.total.toFixed(2)}`);
  },
);

// ---- Cart to address to payment -------------------------------------------

When('I proceed from the cart to the address step', async ({ checkoutPage, cartPage, page }) => {
  // Entered directly when the cart was seeded behind the scenes; otherwise we are already there.
  if (!page.url().includes('/checkout')) await cartPage.openFromHeader();
  await checkoutPage.goToAddress();
});

When('I fill in a valid billing address', async ({ checkoutPage }) => {
  await checkoutPage.fillAddress(buildAddress());
});

When('I proceed to the payment step', async ({ checkoutPage }) => {
  await checkoutPage.goToPayment();
});

Given('I am on the address step', async ({ checkoutPage }) => {
  await checkoutPage.goToAddress();
  // Let the profile address and the postcode lookup settle before a scenario edits the fields.
  await expect(checkoutPage.street).not.toBeEmpty();
});

Given('I am on the payment step with a valid billing address', async ({ checkoutPage }) => {
  await checkoutPage.goToAddress();
  await checkoutPage.fillAddress(buildAddress());
  await checkoutPage.goToPayment();
});

// ---- Address validation ----------------------------------------------------

const ADDRESS_FIELDS = {
  street: 'street',
  city: 'city',
  state: 'state',
  'postal code': 'postal_code',
  'house number': 'house_number',
};

When('I leave the {string} field empty', async ({ checkoutPage }, field) => {
  const testId = ADDRESS_FIELDS[field];
  if (!testId) throw new Error(`Unknown address field "${field}"`);
  await checkoutPage.clearAddressField(checkoutPage.page.getByTestId(testId));
});

// The site shows no error text for these fields; it keeps the button disabled instead.
Then('I should not be able to proceed to payment', async ({ checkoutPage }) => {
  await expect(checkoutPage.proceedFromAddress).toBeDisabled();
});

// ---- Payment ---------------------------------------------------------------

/** Valid extra details for each payment method (formats taken from the site's own validators). */
function validPaymentDetails(method) {
  const expiry = `12/${new Date().getFullYear() + 3}`;
  const details = {
    'Bank Transfer': {
      bank_name: 'ING Bank',
      account_name: 'Test Customer',
      account_number: '12345678',
    },
    'Cash on Delivery': {},
    'Credit Card': {
      credit_card_number: '1111-1111-1111-1111',
      expiration_date: expiry,
      cvv: '123',
      card_holder_name: 'Test Customer',
    },
    'Buy Now Pay Later': { monthly_installments: '6' },
    'Gift Card': { gift_card_number: 'ABCD1234EFGH5678', validation_code: 'AB12' },
  }[method];
  if (!details) throw new Error(`Unknown payment method "${method}"`);
  return details;
}

When('I pay with {string}', async ({ checkoutPage }, method) => {
  await checkoutPage.pay(method);
  await expect(checkoutPage.paymentSuccess).toHaveText('Payment was successful');
});

When('I pay with {string} using valid details', async ({ checkoutPage }, method) => {
  await checkoutPage.selectPaymentMethod(method);
  await checkoutPage.fillPaymentDetails(validPaymentDetails(method));
  await checkoutPage.finish.click();
  await expect(checkoutPage.paymentSuccess).toHaveText('Payment was successful');
});

When(
  'I pay with {string} using card number {string} and an expired date',
  async ({ checkoutPage }, method, cardNumber) => {
    await checkoutPage.selectPaymentMethod(method);
    await checkoutPage.fillPaymentDetails({
      credit_card_number: cardNumber,
      expiration_date: '01/2020',
      cvv: '123',
      card_holder_name: 'Test Customer',
    });
  },
);

When('I confirm the order', async ({ checkoutPage }) => {
  await checkoutPage.confirmOrder();
});

When('I try to confirm the order', async ({ checkoutPage }) => {
  await checkoutPage.tryConfirm();
});

Then('I should see the order confirmation with an invoice number', async ({ checkoutPage }) => {
  await expect(checkoutPage.confirmation).toContainText(/INV-\d+/);
});

Then('I should see payment validation errors', async ({ page }) => {
  await expect(page.getByText('Invalid card number format.')).toBeVisible();
  await expect(page.getByText('Expiration date must be in the future.')).toBeVisible();
});

Then('no order should be placed', async ({ checkoutPage }) => {
  await expect(checkoutPage.finish).toBeDisabled();
  await expect(checkoutPage.confirmation).toHaveCount(0);
  expect(checkoutPage.ordersSubmitted).toBe(0);
});
