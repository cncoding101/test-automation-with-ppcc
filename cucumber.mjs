/**
 *  NOTE uncomment the reporting once you are done creating the new tests
 */
const common = {
  format: [
    // 'json:reports/report.json',
    // 'html:reports/index.html',
    'summary',
    'progress-bar',
    '@cucumber/pretty-formatter',
    // './src/reporters/allure.ts',
  ],
};

module.exports = {
  ...common,
  ...require('./dist'),
  formatOptions: { snippetInterface: 'async-await' },
  publishQuiet: true,
};
