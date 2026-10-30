/* global document */
const { BasePage } = require('./BasePage');

class ProfilePage extends BasePage {
  path = '/account/profile';

  constructor(page) {
    super(page);
    this.firstName = page.getByTestId('first-name');
    this.phone = page.getByTestId('phone');
    this.city = page.getByTestId('city');
    this.saveProfile = page.getByTestId('update-profile-submit');
    this.currentPassword = page.getByTestId('current-password');
    this.newPassword = page.getByTestId('new-password');
    this.confirmPassword = page.getByTestId('new-password-confirm');
    this.changePassword = page.getByTestId('change-password-submit');
    this.alert = page.getByRole('alert');
  }

  /** The form is filled from the API after load; wait for that before typing over it. */
  async waitUntilLoaded() {
    await this.firstName.waitFor();
    await this.page.waitForFunction(
      () => document.querySelector('[data-test="first-name"]')?.value !== '',
    );
  }

  async open() {
    await super.open();
    await this.waitUntilLoaded();
  }

  async reload() {
    await this.page.reload();
    await this.waitUntilLoaded();
  }

  async updatePhoneAndCity(phone, city) {
    await this.phone.fill(phone);
    await this.city.fill(city);
    await this.saveProfile.click();
  }

  async updatePassword(current, next) {
    await this.currentPassword.fill(current);
    await this.newPassword.fill(next);
    await this.confirmPassword.fill(next);
    await this.changePassword.click();
  }
}

module.exports = { ProfilePage };
