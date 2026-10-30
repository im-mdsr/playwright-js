const js = require('@eslint/js');
const globals = require('globals');
const playwright = require('eslint-plugin-playwright');

module.exports = [
  {
    ignores: [
      'node_modules/',
      '.features-gen/',
      'playwright-report/',
      'test-results/',
      'allure-results/',
      'allure-report/',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-empty-pattern': 'off', // Playwright fixtures use `async ({}, use)`
    },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['src/**/*.js'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'error',
      'playwright/expect-expect': 'off', // assertions live in Then steps, not in test bodies
      'playwright/no-standalone-expect': 'off',
    },
  },
];
