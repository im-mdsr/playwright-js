const { expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const { Given, When, Then } = require('../fixtures');

// The site asks for at least 50 characters; this is comfortably above it.
const VALID_MESSAGE =
  'I would like some help with my order, please get back to me soon. Thank you.';

// Messages verified against the live site (see DISCOVERY_FINDINGS.md).
const CONTACT_ERRORS = {
  subject: 'Subject is required',
  message: 'Message must be minimal 50 characters',
};

Given('I am on the contact page', async ({ contactPage }) => {
  await contactPage.open();
});

function visitor() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email({ provider: 'example.com' }).toLowerCase(),
  };
}

When(
  'I send a message with subject {string} and a valid message',
  async ({ contactPage }, subject) => {
    await contactPage.send({ ...visitor(), subject, message: VALID_MESSAGE });
  },
);

When(
  'I send a message with subject {string} and message {string}',
  async ({ contactPage }, subject, message) => {
    await contactPage.send({ ...visitor(), subject, message });
  },
);

Then('I should see the message sent confirmation', async ({ contactPage }) => {
  await expect(contactPage.alert).toContainText(
    'Thanks for your message! We will contact you shortly.',
  );
});

Then('I should see a validation error for {string}', async ({ contactPage }, field) => {
  const expected = CONTACT_ERRORS[field];
  if (!expected) throw new Error(`Unknown contact field "${field}"`);
  await expect(contactPage.errorFor(field)).toContainText(expected);
});
