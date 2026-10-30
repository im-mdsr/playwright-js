// Allure 3 report configuration, used by `npm run report:allure` and the nightly workflow.
// The history file feeds the trend graphs; the nightly job restores it from the published
// report before generating and publishes it again afterwards (see .github/workflows/nightly.yml).
export default {
  name: 'Toolshop Playwright BDD',
  output: './allure-report',
  historyPath: './allure-history/history.jsonl',
  appendHistory: true,
  historyLimit: 30,
  plugins: {
    awesome: {
      options: {
        reportName: 'Toolshop Playwright BDD',
        reportLanguage: 'en',
        groupBy: ['parentSuite', 'suite'],
      },
    },
  },
};
