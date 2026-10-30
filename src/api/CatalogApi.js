class CatalogApi {
  constructor(client) {
    this.client = client;
  }

  categories() {
    return this.client.get('/categories');
  }

  categoryTree() {
    return this.client.get('/categories/tree');
  }

  brands() {
    return this.client.get('/brands');
  }
}

module.exports = { CatalogApi };
