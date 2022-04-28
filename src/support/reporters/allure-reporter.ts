import { AllureRuntime, CucumberJSAllureFormatter } from 'allure-cucumberjs8';

function Reporter(options: any) {
  return new CucumberJSAllureFormatter(
    options,
    new AllureRuntime({ resultsDir: './reports/allure-results' }),
    {
      // add in option for external links if required
    },
  );
}
Reporter.prototype = Object.create(CucumberJSAllureFormatter.prototype);
Reporter.prototype.constructor = Reporter;

exports.default = Reporter;
