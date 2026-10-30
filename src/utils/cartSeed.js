/**
 * Builds a cart through the API. Products are looked up by name because ids differ between
 * installations of the site. Returns the cart id.
 */
async function createCart({ cartsApi, productsApi }, items) {
  const cartId = await cartsApi.create();
  for (const { name, quantity } of items) {
    const product = await productsApi.findByName(name);
    await cartsApi.addItem(cartId, product.id, quantity);
  }
  return cartId;
}

module.exports = { createCart };
