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
    const response = await this.client.post(`/carts/${cartId}`, {
      data: { product_id: productId, quantity },
    });
    if (!response.ok()) {
      throw new Error(`Could not add item to cart: HTTP ${response.status()}`);
    }
  }
}

module.exports = { CartsApi };
