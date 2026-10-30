const { BasePage } = require('./BasePage');

class RegisterPage extends BasePage {
  path = '/auth/register';

  constructor(page) {
    super(page);
    this.form = page.getByTestId('register-form');
    this.firstName = page.getByTestId('first-name');
    this.lastName = page.getByTestId('last-name');
    this.dob = page.getByTestId('dob');
    this.street = page.getByTestId('street');
    this.postalCode = page.getByTestId('postal_code');
    this.houseNumber = page.getByTestId('house_number');
    this.city = page.getByTestId('city');
    this.state = page.getByTestId('state');
    this.country = page.getByTestId('country');
    this.phone = page.getByTestId('phone');
    this.email = page.getByTestId('email');
    this.password = page.getByTestId('password');
    this.submitButton = page.getByTestId('register-submit');
    this.alert = page.locator('.alert-danger');
  }

  /** Error element for a field, e.g. errorFor('first-name') -> data-test="first-name-error". */
  errorFor(field) {
    return this.page.getByTestId(`${field}-error`);
  }

  async fill(user) {
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.dob.fill(user.dob);
    await this.street.fill(user.street);
    await this.postalCode.fill(user.postalCode);
    await this.houseNumber.fill(user.houseNumber);
    await this.city.fill(user.city);
    await this.state.fill(user.state);
    await this.country.selectOption(user.country);
    await this.phone.fill(user.phone);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async register(user) {
    await this.fill(user);
    await this.submit();
  }
}

module.exports = { RegisterPage };
