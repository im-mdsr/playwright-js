class InvoicesApi {
  constructor(client) {
    this.client = client;
  }

  /**
   * Places a cash-on-delivery order for the cart. The API only accepts a street, city and state
   * that agree with its own postcode lookup, so the address is taken from there.
   */
  async place(token, cartId, { country = 'NL', postalCode = '1011AB', houseNumber = '1' } = {}) {
    const lookup = await this.client.get('/postcode-lookup', {
      params: { country, postcode: postalCode, house_number: houseNumber },
    });
    const address = await lookup.json();
    const response = await this.client.post('/invoices', {
      token,
      data: {
        billing_street: address.street,
        billing_city: address.city,
        billing_state: address.state,
        billing_country: country,
        billing_postal_code: postalCode,
        payment_method: 'cash-on-delivery',
        payment_details: {},
        cart_id: cartId,
      },
    });
    if (response.status() !== 201) {
      throw new Error(`Could not place order: HTTP ${response.status()} ${await response.text()}`);
    }
    return response.json();
  }
}

module.exports = { InvoicesApi };
