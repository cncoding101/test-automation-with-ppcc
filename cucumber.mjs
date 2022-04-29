/**
 *  NOTE uncomment the reporting once you are done creating the new tests
 */
export default {
  requireModule: ['ts-node/register'],
  require: ['src/**/*.ts'],
  format: [
    // 'json:reports/cucumber-report.json',
    // 'html:reports/report.html',
    'summary',
    'progress-bar',
    '@cucumber/pretty-formatter',
    // './src/support/reporters/allure-reporter.ts',
  ],
  formatOptions: { snippetInterface: 'async-await' },
  publishQuiet: true,
};
