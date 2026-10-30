const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  path = '/auth/login';

  constructor(page) {
    super(page);
    this.email = page.getByTestId('email');
    this.password = page.getByTestId('password');
    this.submitButton = page.getByTestId('login-submit');
    this.loginError = page.getByTestId('login-error');
    this.emailError = page.getByTestId('email-error');
    this.passwordError = page.getByTestId('password-error');
    this.forgotPasswordLink = page.getByTestId('forgot-password-link');
    this.registerLink = page.getByTestId('register-link');
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submitButton.click();
  }
}

module.exports = { LoginPage };
