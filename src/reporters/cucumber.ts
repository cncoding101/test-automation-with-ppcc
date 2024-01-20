import { generate, Options } from 'cucumber-html-reporter';

const options: Options = {
  theme: 'bootstrap',
  jsonFile: './reports/report.json',
  output: './reports/index.html',
  screenshotsDirectory: './reports/screenshots',
  storeScreenshots: true,
  reportSuiteAsScenarios: true,
  launchReport: true,
};

generate(options);
