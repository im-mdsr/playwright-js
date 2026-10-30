const { BasePage } = require('./BasePage');

class ContactPage extends BasePage {
  path = '/contact';

  constructor(page) {
    super(page);
    this.firstName = page.getByTestId('first-name');
    this.lastName = page.getByTestId('last-name');
    this.email = page.getByTestId('email');
    this.subject = page.getByTestId('subject');
    this.message = page.getByTestId('message');
    this.submit = page.getByTestId('contact-submit');
    this.alert = page.getByRole('alert');
  }

  errorFor(field) {
    return this.page.getByTestId(`${field}-error`);
  }

  /** Sends the form as an anonymous visitor. An empty subject leaves the dropdown untouched. */
  async send({ subject, message, firstName, lastName, email }) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.email.fill(email);
    if (subject) await this.subject.selectOption({ label: subject });
    await this.message.fill(message);
    await this.submit.click();
  }
}

module.exports = { ContactPage };
