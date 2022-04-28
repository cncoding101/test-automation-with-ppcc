## What's inside

- Typescript setup for writing steps with eslint/typescript and prettier
- Launching of Playwright browser before running all tests
- Launching new context and page for each scenario
- Running feature with video recording option
- Allure reports (using cucumberjs8)
- VScode configuration to debug a single feature or an only scenario (run when located on the feature file)

## Note

Reporting through allure cucumber js may have to be replaced in the future as it is not maintained or documented well.

When creating tests that are not yet defined, then comment out the following lines on `cucumber.mjs` line 13, 14, 18 which corresponds to the reporting. This is in order to get a more readable output from the terminal.

When running the codegen, make sure to test it properly and run it through a couple of times to ensure consistency.

To make the playwright debugger stop at a specific breakpoint use `page.paus()`. In order to filter out the features that use the same step in debugging, we can utilize the `@debug` on the feature. Which can then be used as a variable in the step definition to activate `page.paus()`.

If using the playwright debugger, currently the debugger will wait indefinitely for an element that do not exist.

## To run your tests

`npm run test` or `npx cucumber-js` runs all tests
`npm run test <feature name>` or `npx cucumber-js <feature name>` run the single feature

## Browser selection

By default we will use chromium. You can define an envrionment variable called BROWSER and
set the name of the browser. Available options: chromium, firefox, webkit

On Linux and Mac you can write:

`BROWSER=firefox npm run test` or `BROWSER=firefox npx cucumber-js` runs all tests using Firefox

One Windows you need to write

```
set BROWSER=firefox
npm run test
```

## Debugging Features

### From CLI

- `npm run debug` - headful mode with APIs enables both APIs and debug options
- `npm run api` - headless mode with debug apis
- `npm run video` - headless mode vith video

## In Visual Studio Code

- Open the feature
- Select the debug options in the VSCode debugger
- Set breakpoints in the code

To stop the feature, you can add the `Then debug` step inside your feature. It will stop your debugger.

## To ignore a scenario

- tag the scenario with `@ignore`

## To check for typescript, linting and gherkin errors

- run the command `npm run check`.

## To view the steps usage

- run the command `npm run steps-usage`.

## To view the html report of the last run

- run the command `npm run report`.

## To view allure report

- run the command `npm run allure`.

## To generate code

- run the command `npm run gen -- codegen/<output file>.spec.ts url`.

## To run playwright tests

- run command `npm run testgen`
