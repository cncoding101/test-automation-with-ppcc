## Note

Reporting through allure cucumber js may have to be replaced in the future as it is not maintained or documented well.

When creating tests that are not yet defined, then comment out the following lines on `cucumber.mjs` line 13, 14, 18 which corresponds to the reporting. This is in order to get a more readable output from the terminal.

When running the codegen, make sure to test it properly and run it through a couple of times to ensure consistency.

To make the playwright debugger stop at a specific breakpoint use `page.paus()`. Make sure to run it in headless mode = false. You can enable devtools for chrome to see console logs as well.

If using the playwright debugger, currently the debugger will wait indefinitely for an element that do not exist.

Observe that some of the migration data needs to be used with rules. E.g. date properties that are validated against the BE.

If a test fails that has been working before. Make sure to first check if all the servers are up and running as they should. It is known that the migration can sometimes destroy the db pool by exiting too early.

Note currently if you are doing local mockup servers such as partner services then you need to run these servers as well or 
else the test will fail if they rely on the response.

Currently running test in parallel will not work due to how the data migration is setup. After each
scenario a migration is ran so that the tests are completely isolated. A solution for this issue will have to be thought through for the future in order to run tests efficiently. 

## To run your tests

`npm run tests` runs all tests
`npm run tests -- only` to run platform specific tests

## Browser selection

You can define an envrionment variable called BROWSER and set the name of the browser. 
Available options: chromium, firefox, webkit

## Debugging Features

### From CLI

- `PWDEBUG=1 npm run testgen` - debug test runner of pw

### From Environment

- `PWDEBUG=1` add to env file to run with debugging

## In Visual Studio Code

NOTE: not working atm..
- Open the feature
- Select the debug options in the VSCode debugger
- Set breakpoints in the code

To stop the feature, you can add the `Then debug` step inside your feature. It will stop your debugger.


## To ignore a scenario

- tag the scenario with `@ignore`

## To check for typescript, linting and gherkin errors

- run the command `npm run check`. 

## To view report

- run the command `npm run allure`.
- navigate to reports folder and find index.html for manual
- navigate to reports/playwright-reports and find index.html for manual opening of the last pw run

## To generate code

- run the command `npm run gen -- codegen/<output file>.spec.ts url`.

## To run playwright tests

- run command `npm run testgen`
