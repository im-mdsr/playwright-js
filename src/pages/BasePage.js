const { Header } = require('./components/Header');

class BasePage {
  /** Route of the page, relative to baseURL. Set by subclasses. */
  path = '/';

  constructor(page) {
    this.page = page;
    this.header = new Header(page);
  }

  async open() {
    await this.page.goto(this.path);
  }
}

module.exports = { BasePage };
