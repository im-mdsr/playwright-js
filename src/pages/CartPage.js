const { BasePage } = require('./BasePage');

/** Step 1 of the single-page checkout at /checkout. */
class CartPage extends BasePage {
  path = '/checkout';

  constructor(page) {
    super(page);
    this.rows = page.locator('tbody tr').filter({ has: page.getByTestId('product-title') });
    this.total = page.getByTestId('cart-total');
    this.proceed = page.getByTestId('proceed-1');
  }

  /**
   * Opens the cart the way a shopper does, through the header link. The link only exists while the
   * cart has items, so an empty cart is reached by URL, as a shopper with a bookmark would.
   */
  async openFromHeader() {
    if (await this.header.cartLink.isVisible()) {
      await this.header.cartLink.click();
      await this.page.waitForURL(/\/checkout/);
    } else {
      await this.open();
    }
  }

  row(productName) {
    return this.rows.filter({
      has: this.page.getByTestId('product-title').getByText(productName, { exact: true }),
    });
  }

  quantityInput(productName) {
    return this.row(productName).getByTestId('product-quantity');
  }

  unitPrice(productName) {
    return this.row(productName).getByTestId('product-price');
  }

  linePrice(productName) {
    return this.row(productName).getByTestId('line-price');
  }

  async setQuantity(productName, quantity) {
    const input = this.quantityInput(productName);
    await input.fill(String(quantity));
    await input.blur();
  }

  async remove(productName) {
    await this.row(productName).locator('a.btn-danger').click();
  }

  /** Snapshot of every cart line: name, unit price, quantity and line price (as shown on screen). */
  async lines() {
    const lines = [];
    const count = await this.rows.count();
    for (let i = 0; i < count; i++) {
      const row = this.rows.nth(i);
      lines.push({
        name: (await row.getByTestId('product-title').innerText()).trim(),
        unitPrice: await row.getByTestId('product-price').innerText(),
        quantity: Number(await row.getByTestId('product-quantity').inputValue()),
        linePrice: await row.getByTestId('line-price').innerText(),
      });
    }
    return lines;
  }
}

module.exports = { CartPage };
