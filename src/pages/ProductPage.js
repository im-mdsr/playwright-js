const { BasePage } = require('./BasePage');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.name = page.getByTestId('product-name');
    this.unitPrice = page.getByTestId('unit-price');
    this.description = page.getByTestId('product-description');
    this.quantity = page.getByTestId('quantity');
    this.increase = page.getByTestId('increase-quantity');
    this.decrease = page.getByTestId('decrease-quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.addToFavoritesButton = page.getByTestId('add-to-favorites');
    this.outOfStock = page.getByTestId('out-of-stock');
    // Toasts are rendered as role="alert" elements.
    this.toast = page.getByRole('alert');
  }

  /** Opens a product by name through the catalog, since product ids are not stable. */
  async openByName(homePage, name) {
    await homePage.open();
    await homePage.openProduct(name);
    await this.name.waitFor();
  }

  async openById(id) {
    await this.page.goto(`/product/${id}`);
    await this.name.waitFor();
  }

  async setQuantity(quantity) {
    await this.quantity.fill(String(quantity));
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async addToFavorites() {
    await this.addToFavoritesButton.click();
  }
}

module.exports = { ProductPage };
