const { test } = require('@playwright/test');
const { Before } = require('../fixtures');

// A scenario tagged @known-bug asserts the CORRECT behaviour of something that is broken on the
// site (see docs/known-defects.md). It is expected to fail: Playwright reports that as a pass, and
// reports an unexpected pass as a failure, which is the signal to remove the tag once the site
// is fixed.
Before({ tags: '@known-bug' }, async () => {
  test.fail(true, 'Known site defect, see docs/known-defects.md');
});
