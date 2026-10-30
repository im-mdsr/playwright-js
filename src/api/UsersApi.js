class UsersApi {
  constructor(client) {
    this.client = client;
  }

  /** Raw register call (201 created, 409 duplicate email, 422 validation errors). */
  register(user) {
    return this.client.post('/users/register', { data: toApiPayload(user) });
  }

  me(token) {
    return this.client.get('/users/me', { token });
  }

  /** Registers a user and fails loudly if the API refuses, for use in test setup. */
  async create(user) {
    const response = await this.register(user);
    if (response.status() !== 201) {
      throw new Error(
        `Could not create test user: HTTP ${response.status()} ${await response.text()}`,
      );
    }
    return { ...user, id: (await response.json()).id };
  }
}

/** Maps the flat test-user shape used across the framework to the API's nested payload. */
function toApiPayload(user) {
  const { street, houseNumber, city, state, country, postalCode, ...rest } = user;
  return {
    first_name: rest.firstName,
    last_name: rest.lastName,
    dob: rest.dob,
    phone: rest.phone,
    email: rest.email,
    password: rest.password,
    address: {
      street,
      house_number: houseNumber,
      city,
      state,
      country,
      postal_code: postalCode,
    },
  };
}

module.exports = { UsersApi, toApiPayload };
