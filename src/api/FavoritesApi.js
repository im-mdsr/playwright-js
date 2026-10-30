class FavoritesApi {
  constructor(client) {
    this.client = client;
  }

  async add(token, productId) {
    const response = await this.client.post('/favorites', {
      token,
      data: { product_id: productId },
    });
    if (response.status() !== 201) {
      throw new Error(`Could not add favorite: HTTP ${response.status()} ${await response.text()}`);
    }
  }
}

module.exports = { FavoritesApi };
