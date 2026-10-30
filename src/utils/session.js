/* global window */
// The Toolshop SPA keeps its JWT in localStorage under this key (verified in Phase 1/3).
const TOKEN_KEY = 'auth-token';

/**
 * Signs the browser in without touching the login form: plants the token before any page script
 * runs. Use for scenarios where login is a precondition, not the behaviour under test.
 *
 * The init script runs on every document load, so it seeds only once per tab (guarded by a
 * sessionStorage flag). Otherwise a later sign-out followed by a reload would silently sign the
 * user back in and hide real logout bugs.
 */
async function signInWithToken(page, token) {
  await page.addInitScript(
    ([key, value]) => {
      const seeded = '__token_seeded__';
      if (window.sessionStorage.getItem(seeded)) return;
      window.localStorage.setItem(key, value);
      window.sessionStorage.setItem(seeded, '1');
    },
    [TOKEN_KEY, token],
  );
}

/**
 * Hands the browser a cart that was built through the API. The SPA keeps the cart id and the
 * header badge count in sessionStorage. Seeded once per tab, like the token, so a cart emptied by
 * a completed order is not resurrected on reload.
 */
async function seedCart(page, cartId, quantity) {
  await page.addInitScript(
    ([id, count]) => {
      const seeded = '__cart_seeded__';
      if (window.sessionStorage.getItem(seeded)) return;
      window.sessionStorage.setItem('cart_id', id);
      window.sessionStorage.setItem('cart_quantity', String(count));
      window.sessionStorage.setItem(seeded, '1');
    },
    [cartId, quantity],
  );
}

module.exports = { TOKEN_KEY, signInWithToken, seedCart };
