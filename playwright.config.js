require('dotenv').config({ quiet: true });
const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');

const isCI = !!process.env.CI;

// Every feature file is run. Override ad hoc with FEATURES='features/ui/**/*.feature'.
const ALL_FEATURES = 'features/**/*.feature';

const testDir = defineBddConfig({
  features: process.env.FEATURES || ALL_FEATURES,
  steps: ['src/fixtures/index.js', 'src/steps/**/*.js'],
  outputDir: '.features-gen',
});

module.exports = defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 4 : undefined,
  // The AUT is a shared public demo whose latency varies (page loads of 0.5s to 20s were seen
  // in Phase 3), so waits are generous. Auto-waiting returns as soon as the condition holds.
  timeout: 60_000,
  // Visual baselines are committed under snapshots/ (the generated test folder is git-ignored).
  snapshotDir: './snapshots',
  snapshotPathTemplate: '{snapshotDir}/{arg}-{projectName}-{platform}{ext}',
  expect: {
    timeout: 15_000,
    toHaveScreenshot: { animations: 'disabled', maxDiffPixelRatio: 0.02 },
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        environmentInfo: {
          app_ui: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
          app_api: process.env.API_URL || 'https://api.practicesoftwaretesting.com',
          node: process.version,
        },
      },
    ],
    ...(isCI ? [['junit', { outputFile: 'test-results/junit.xml' }]] : []),
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Visual baselines are rendering specific and API scenarios do not involve the browser, so
    // both run on Chromium only.
    { name: 'firefox', grepInvert: /@visual|@api/, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', grepInvert: /@visual|@api/, use: { ...devices['Desktop Safari'] } },
  ],
});
