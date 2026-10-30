class ProductsApi {
  constructor(client) {
    this.client = client;
  }

  list(page = 1) {
    return this.client.get('/products', { params: { page } });
  }

  get(id) {
    return this.client.get(`/products/${id}`);
  }

  /** Raw query string such as "sort=price,asc"; passed through untouched so commas stay literal. */
  query(queryString) {
    return this.client.get(`/products?${queryString}`);
  }

  search(query) {
    return this.client.get('/products/search', { params: { q: query } });
  }

  /** Every product in the catalog (all pages). Used to check filters against the source of truth. */
  async all() {
    const first = await (await this.list(1)).json();
    const products = [...first.data];
    for (let page = 2; page <= first.last_page; page++) {
      products.push(...(await (await this.list(page)).json()).data);
    }
    return products;
  }

  /** Finds a product by exact name through the search endpoint; ids are not stable across sites. */
  async findByName(name) {
    const response = await this.search(name);
    const { data } = await response.json();
    const product = data.find((p) => p.name === name);
    if (!product) throw new Error(`Product "${name}" not found through the API`);
    return product;
  }
}

module.exports = { ProductsApi };
