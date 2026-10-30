/** "$1,014.15" -> 1014.15 */
function parseMoney(text) {
  return Number(String(text).replace(/[^0-9.]/g, ''));
}

/** Rounds to cents so float noise (0.1 + 0.2) never decides an assertion. */
function cents(amount) {
  return Math.round(amount * 100);
}

module.exports = { parseMoney, cents };
