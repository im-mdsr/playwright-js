const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/** Steps 2 to 4 of the single-page checkout: sign-in confirmation, billing address, payment. */
class CheckoutPage extends BasePage {
  path = '/checkout';

  constructor(page) {
    super(page);
    this.proceedFromCart = page.getByTestId('proceed-1');
    this.proceedFromSignIn = page.getByTestId('proceed-2');
    this.proceedFromAddress = page.getByTestId('proceed-3');
    this.country = page.getByTestId('country');
    this.postalCode = page.getByTestId('postal_code');
    this.houseNumber = page.getByTestId('house_number');
    this.street = page.getByTestId('street');
    this.city = page.getByTestId('city');
    this.state = page.getByTestId('state');
    this.lookupLoading = page.getByTestId('postcode-lookup-loading');
    this.paymentMethod = page.getByTestId('payment-method');
    this.finish = page.getByTestId('finish');
    this.paymentSuccess = page.getByTestId('payment-success-message');
    this.confirmation = page.getByText(/Your invoice number is/);
    // Counts order submissions, so "no order was placed" can be asserted rather than assumed.
    this.ordersSubmitted = 0;
    page.on('request', (r) => {
      if (r.method() === 'POST' && r.url().endsWith('/invoices')) this.ordersSubmitted++;
    });
  }

  /** Cart (step 1) to billing address (step 3) for a logged-in customer. */
  async goToAddress() {
    await this.proceedFromCart.click();
    await this.proceedFromSignIn.click();
    await this.proceedFromAddress.waitFor();
    // The customer's saved address is loaded asynchronously and would overwrite anything typed
    // before it arrives. Street is the one part every saved address has (the demo customer has
    // no postal code), so its arrival marks the end of the load.
    await expect(this.street).not.toBeEmpty();
  }

  /**
   * Fills the part of the address the customer types. The site then looks up street, city and
   * state itself (not always with the same answer for the same input), so we read the response to
   * its own lookup for our postal code and house number and require the form to show exactly that.
   *
   * The demo site sometimes loses what was typed (its saved-address load lands late and empties
   * the postal code or house number, or the lookup never fires), so the whole fill is retried
   * until the values stick. Callers must use a postal code that differs from the saved one,
   * otherwise no lookup runs.
   */
  async fillAddress({ country, postalCode, houseNumber }) {
    await expect(async () => {
      const lookup = this.page.waitForResponse(
        (r) =>
          r.url().includes('/postcode-lookup') &&
          r.url().includes(`postcode=${postalCode}`) &&
          r.url().includes(`house_number=${houseNumber}`),
        { timeout: 5_000 },
      );
      lookup.catch(() => {}); // a failed attempt must not leave an unhandled rejection behind
      await this.country.selectOption(country);
      await this.postalCode.fill(postalCode);
      await this.houseNumber.fill(houseNumber);
      const found = await (await lookup).json();
      await this.lookupLoading.waitFor({ state: 'hidden' });
      const short = { timeout: 3_000 };
      await expect(this.street).toHaveValue(found.street, short);
      await expect(this.city).toHaveValue(found.city, short);
      await expect(this.state).toHaveValue(found.state, short);
      await expect(this.postalCode).toHaveValue(postalCode, short);
      await expect(this.houseNumber).toHaveValue(houseNumber, short);
    }).toPass({ timeout: 45_000 });
  }

  async goToPayment() {
    await this.proceedFromAddress.click();
    await this.paymentMethod.waitFor();
  }

  /**
   * Types the extra fields a payment method asks for. Keys are the fields' data-test ids; the
   * installments field is a dropdown, all others are text inputs. Each field is blurred so the
   * site shows its validation state.
   */
  async fillPaymentDetails(details) {
    for (const [testId, value] of Object.entries(details)) {
      const field = this.page.getByTestId(testId);
      if (testId === 'monthly_installments') await field.selectOption(value);
      else await field.fill(value);
      await field.blur();
    }
  }

  async selectPaymentMethod(methodLabel) {
    await this.paymentMethod.selectOption({ label: methodLabel });
  }

  /** Clears a billing address field the way a customer would, then leaves it. */
  async clearAddressField(field) {
    await field.fill('');
    await field.blur();
  }

  /** Clicks the final button only if the site allows it; an invalid form keeps it disabled. */
  async tryConfirm() {
    if (await this.finish.isEnabled()) await this.finish.click();
  }

  /** Selects a payment method by its visible label and submits it for checking. */
  async pay(methodLabel) {
    await this.paymentMethod.selectOption({ label: methodLabel });
    await this.finish.click();
  }

  /** Places the order and fails with the API status if the site rejects it. */
  async confirmOrder() {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().endsWith('/invoices') && r.request().method() === 'POST',
      ),
      this.finish.click(),
    ]);
    if (!response.ok()) {
      throw new Error(
        `Placing the order failed: HTTP ${response.status()} ${await response.text()}`,
      );
    }
  }
}

module.exports = { CheckoutPage };
