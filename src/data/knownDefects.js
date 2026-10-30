// Real defects found on the Toolshop site, mirrored from docs/known-defects.md.
//
// The accessibility scans use this list to leave documented defects out of the "no critical or
// serious violations" check, so a new regression still fails them. Each entry also has an
// @known-bug scenario that asserts the correct behaviour and is expected to fail until the site
// is fixed; when it starts passing, remove the entry and the tag.
const knownA11yDefects = [
  { id: 'D-01', page: 'home', rule: 'label-content-name-mismatch' },
  { id: 'D-01', page: 'product', rule: 'label-content-name-mismatch' },
  { id: 'D-01', page: 'login', rule: 'label-content-name-mismatch' },
  { id: 'D-01', page: 'cart', rule: 'label-content-name-mismatch' },
  { id: 'D-02', page: 'home', rule: 'list' },
  { id: 'D-03', page: 'login', rule: 'button-name' },
];

module.exports = { knownA11yDefects };
