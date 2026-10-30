const { faker } = require('@faker-js/faker');

/** Builds a unique, valid customer. Emails are unique per call so parallel workers never collide. */
function buildUser(overrides = {}) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName,
    lastName,
    dob: faker.date.birthdate({ mode: 'age', min: 21, max: 60 }).toISOString().slice(0, 10),
    phone: faker.string.numeric(10),
    email: `qa.${Date.now()}.${faker.string.alphanumeric({ length: 6, casing: 'lower' })}@example.com`,
    password: `Pw!${faker.string.alphanumeric(10)}9`,
    street: faker.location.street(),
    houseNumber: String(faker.number.int({ min: 1, max: 200 })),
    city: faker.location.city(),
    state: faker.location.state(),
    country: 'NL',
    postalCode: '1234AB',
    ...overrides,
  };
}

/**
 * A billing address in the shape CheckoutPage.fillAddress expects. Street, city and state are not
 * included on purpose: the site's postcode lookup fills them from the postal code and house number,
 * and the API rejects hand-typed values that disagree with that lookup (HTTP 422).
 */
function buildAddress(overrides = {}) {
  // The site only runs its lookup when the postal code changes, so a random one guarantees it
  // differs from any saved address. The lookup answers for any Dutch postcode.
  return {
    country: 'NL',
    postalCode: `${faker.number.int({ min: 1000, max: 9999 })}${faker.string.alpha({ length: 2, casing: 'upper' })}`,
    houseNumber: String(faker.number.int({ min: 1, max: 999 })),
    ...overrides,
  };
}

module.exports = { buildUser, buildAddress };
