const { BasePage } = require('./BasePage');

class FavoritesPage extends BasePage {
  path = '/account/favorites';

  constructor(page) {
    super(page);
    this.title = page.getByTestId('page-title');
    this.items = page.locator('[data-test^="favorite-"]');
    this.emptyMessage = page.getByText('There are no favorites yet.');
  }

  item(productName) {
    return this.items.filter({
      has: this.page.getByTestId('product-name').getByText(productName, { exact: true }),
    });
  }

  async remove(productName) {
    await this.item(productName).getByTestId('delete').click();
  }
}

module.exports = { FavoritesPage };
