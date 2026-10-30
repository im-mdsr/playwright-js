const { BasePage } = require('./BasePage');

class InvoicesPage extends BasePage {
  path = '/account/invoices';

  constructor(page) {
    super(page);
    this.title = page.getByTestId('page-title');
    this.rows = page.locator('tbody tr');
  }

  rowFor(invoiceNumber) {
    return this.rows.filter({ hasText: invoiceNumber });
  }
}

module.exports = { InvoicesPage };
