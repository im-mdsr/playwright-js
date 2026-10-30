const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  path = '/';

  constructor(page) {
    super(page);
    // Card links carry data-test="product-{ULID}"; "product-name" etc. are inner elements.
    this.cards = page.locator('a[data-test^="product-01"]');
    this.names = page.getByTestId('product-name');
    this.prices = page.getByTestId('product-price');
    this.searchInput = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.sortSelect = page.getByTestId('sort');
    this.noResults = page.getByTestId('no-results');
    this.previousButton = page.getByTestId('pagination-prev');
    this.nextButton = page.getByTestId('pagination-next');
    this.languageMenu = page.getByTestId('language-select');
    this.navHome = page.getByTestId('nav-home');
    this.navContact = page.getByTestId('nav-contact');
  }

  card(name) {
    return this.cards.filter({
      has: this.page.getByTestId('product-name').getByText(name, { exact: true }),
    });
  }

  /**
   * Runs an action that makes the SPA reload the product list and waits for that response. The
   * list is fetched with the HTTP QUERY method (criteria in the body), not GET.
   */
  async #refreshing(action) {
    await Promise.all([
      this.page.waitForResponse(
        (r) =>
          ['GET', 'QUERY'].includes(r.request().method()) &&
          /\/products(\/search)?(\?|$)/.test(r.url()),
      ),
      action(),
    ]);
  }

  async search(term) {
    await this.searchInput.fill(term);
    await this.#refreshing(() => this.searchButton.click());
  }

  /** Ticks a category or brand checkbox by its label ("Pliers", "ForgeFlex Tools"). */
  async filterBy(label) {
    await this.#refreshing(() => this.page.getByLabel(label, { exact: true }).check());
  }

  async sortBy(optionLabel) {
    await this.#refreshing(() => this.sortSelect.selectOption({ label: optionLabel }));
  }

  async goToNextPage() {
    await this.#refreshing(() => this.nextButton.click());
  }

  async goToPreviousPage() {
    await this.#refreshing(() => this.previousButton.click());
  }

  async switchLanguage(code) {
    await this.languageMenu.click();
    await this.page.getByTestId(`lang-${code.toLowerCase()}`).click();
  }

  async openProduct(name) {
    await this.card(name).click();
  }

  async productNames() {
    return (await this.names.allTextContents()).map((n) => n.trim());
  }

  async productPrices() {
    return (await this.prices.allTextContents()).map((p) => p.trim());
  }
}

module.exports = { HomePage };
