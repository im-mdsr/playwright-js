class CartsApi {
  constructor(client) {
    this.client = client;
  }

  /** Creates an empty cart and returns its id. */
  async create() {
    const response = await this.client.post('/carts');
    if (response.status() !== 201) {
      throw new Error(`Could not create cart: HTTP ${response.status()} ${await response.text()}`);
    }
    return (await response.json()).id;
  }

  async addItem(cartId, productId, quantity = 1) {
    // A cart that was created a moment ago is sometimes answered with 404 by the demo site (seen
    // under load). Nothing was added in that case, so asking again cannot double the quantity.
    let response;
    for (let attempt = 1; attempt <= 3; attempt++) {
      response = await this.client.post(`/carts/${cartId}`, {
        data: { product_id: productId, quantity },
      });
      if (response.status() !== 404) break;
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
    if (!response.ok()) {
      throw new Error(`Could not add item to cart: HTTP ${response.status()}`);
    }
  }
}

module.exports = { CartsApi };
