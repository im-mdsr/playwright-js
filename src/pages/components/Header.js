class Header {
  constructor(page) {
    this.page = page;
    this.signInLink = page.getByTestId('nav-sign-in');
    this.userMenu = page.getByTestId('nav-menu');
    this.signOutLink = page.getByTestId('nav-sign-out');
    this.cartLink = page.getByTestId('nav-cart');
    this.cartQuantity = page.getByTestId('cart-quantity');
  }

  async signOut() {
    await this.userMenu.click();
    await this.signOutLink.click();
  }
}

module.exports = { Header };
