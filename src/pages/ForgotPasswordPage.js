const { BasePage } = require('./BasePage');

class ForgotPasswordPage extends BasePage {
  path = '/auth/forgot-password';

  constructor(page) {
    super(page);
    this.form = page.getByTestId('forgot-password-form');
    this.email = page.getByTestId('email');
    this.submitButton = page.getByTestId('forgot-password-submit');
    this.emailError = page.getByTestId('email-error');
  }

  async submit() {
    await this.submitButton.click();
  }
}

module.exports = { ForgotPasswordPage };
