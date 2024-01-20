import { CustomWorld } from '@step-definitions/setup/world';
import { getElementId } from '@support/element';
import { waitFor, waitForResult, waitForSelector } from '@support/wait-for-behaviour';
import { elementEnabled, getElementText, getValue } from '@support/html-behaviour';
import { ElementKey } from '@utils/types/global';
import { logger } from '@utils/helpers/logger';
import { parseInput } from '@support/input-helper';
import { Then } from '@cucumber/cucumber';

Then(
  /^The "([^"]*)" should( not)? contain the text "(.*)"$/,
  async function (
    this: CustomWorld,
    elementKey: ElementKey,
    negate: boolean,
    expectedElementText: string,
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;
    logger.log(
      `The ${elementKey} should ${negate ? 'not' : ''} contain the text ${expectedElementText}`,
    );

    const elementId = getElementId(page, elementKey, globalConfig);
    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementId);

        if (elementStable) {
          const elementText = await page.textContent(elementId);
          if (elementText?.includes(expectedElementText) === !negate) return waitForResult.PASS;

          return waitForResult.FAIL;
        }

        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        target: elementKey,
        failureMsg: `Expected ${elementKey} to ${
          negate ? 'not ' : ''
        }contain the text ${expectedElementText}`,
      },
    );
  },
);

Then(
  /^The "([^"]*)" should( not)? equal the text "(.*)"$/,
  async function (
    this: CustomWorld,
    elementKey: ElementKey,
    negate: boolean,
    expectedElementText: string,
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `the ${elementKey} should ${negate ? 'not' : ''}equal the text ${expectedElementText}`,
    );

    const elementId = getElementId(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementId);

        if (elementStable) {
          const elementText = await getElementText(page, elementId);
          if ((elementText === expectedElementText) === !negate) return waitForResult.PASS;
          return waitForResult.FAIL;
        }

        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        target: elementKey,
        failureMsg: `Expected ${elementKey} to ${
          negate ? 'not ' : ''
        }equal the text ${expectedElementText}`,
      },
    );
  },
);

Then(
  /^The "([^"]*)" should( not)? contain the value "(.*)"$/,
  async function (
    this: CustomWorld,
    elementKey: ElementKey,
    negate: boolean,
    elementValue: string,
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(`The ${elementKey} should ${negate ? 'not' : ''} contain the value ${elementValue}`);

    const elementId = getElementId(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementId);

        if (elementStable) {
          const elementAttr = await getValue(page, elementId);
          if (elementAttr?.includes(elementValue) === !negate) return waitForResult.PASS;
          return waitForResult.FAIL;
        }

        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        target: elementKey,
        failureMsg: `Expected ${elementKey} to ${
          negate ? 'not ' : ''
        }contain the value ${elementValue}`,
      },
    );
  },
);

Then(
  /^The "([^"]*)" should( not)? equal the value "(.*)"$/,
  async function (
    this: CustomWorld,
    elementKey: ElementKey,
    negate: boolean,
    elementValue: string,
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(`The ${elementKey} should ${negate ? 'not' : ''} equal the value ${elementValue}`);

    const elementId = getElementId(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementId);
        if (elementStable) {
          const elementAttr = await getValue(page, elementId);
          if ((elementAttr === elementValue) === !negate) return waitForResult.PASS;
          return waitForResult.FAIL;
        }

        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      { target: elementKey },
    );
  },
);

Then(
  /^The "([^"]*)" should( not)? be enabled$/,
  async function (this: CustomWorld, elementKey: ElementKey, negate: boolean) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(`The ${elementKey} should ${negate ? 'not' : ''} be enabled`);

    const elementId = getElementId(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementId);
        if (elementStable) {
          const isElementEnabled = await elementEnabled(page, elementId);
          if (isElementEnabled === !negate) return waitForResult.PASS;
          return waitForResult.FAIL;
        }

        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        target: elementKey,
        failureMsg: `Expected ${elementKey} to ${negate ? 'not' : ''} be enabled`,
      },
    );
  },
);

Then(
  /^The "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" "([^"]*)" should( not)? contain the text "(.*)"$/,
  async function (
    this: CustomWorld,
    elementPosition: string,
    elementKey: ElementKey,
    negate: boolean,
    expectedElementText: string,
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `the ${elementPosition} ${elementKey} should ${
        negate ? 'not ' : ''
      }contain the text ${expectedElementText}`,
    );

    const elementId = getElementId(page, elementKey, globalConfig);
    const index = Number(elementPosition.match(/\d/g)?.join('')) - 1;

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementId);
        if (elementStable) {
          const elementText = await getElementText(page, `${elementId}>>nth=${index}`);
          if (elementText?.includes(expectedElementText) === !negate) return waitForResult.PASS;
          return waitForResult.FAIL;
        }

        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        target: elementKey,
        failureMsg: `Expected ${elementKey} to ${
          negate ? 'not' : ''
        } contain the text ${expectedElementText}`,
      },
    );
  },
);

Then(
  /^The "([^"]*)" should( not)? contain the text "(.*)" from the "([^"]*)" table on row (\d+)$/,
  async function (
    this: CustomWorld,
    elementKey: ElementKey,
    negate: boolean,
    expectedElementText: string,
    tableKey: ElementKey,
    row: number,
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;
    logger.log(
      `The ${elementKey} should ${
        negate ? 'not' : ''
      } contain the text ${expectedElementText} from the ${tableKey} table on row ${row}`,
    );

    let elementId = getElementId(page, elementKey, globalConfig);
    const tableId = getElementId(page, tableKey, globalConfig);

    await waitFor(
      async () => {
        const tableStable = await waitForSelector(page, tableId);

        if (tableStable) {
          elementId = `${tableId} tbody tr:nth-child(${row}) ${elementId}`;
          const elementStable = await waitForSelector(page, elementId);

          if (elementStable) {
            const elementText = await page.textContent(elementId);
            if (elementText?.includes(expectedElementText) === !negate) return waitForResult.PASS;
            return waitForResult.FAIL;
          }
        }

        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        target: elementKey,
        failureMsg: `Expected ${elementKey} to ${
          negate ? 'not' : ''
        }contain the text ${expectedElementText}`,
      },
    );
  },
);

Then(
  /^The "([^"]*)" should( not)? equal the value "(.*)" from the "([^"]*)" table on row (\d+)$/,
  async function (
    this: CustomWorld,
    elementKey: ElementKey,
    negate: boolean,
    elementValue: string,
    tableKey: string,
    row: number,
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    const parsedInput = parseInput(elementValue, globalConfig);
    logger.log(
      `The ${elementKey} should ${
        negate ? 'not' : ''
      } equal the value ${parsedInput} from the ${tableKey} table on row ${row}`,
    );

    const elementId = getElementId(page, elementKey, globalConfig);
    const tableId = getElementId(page, tableKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementId);
        if (elementStable) {
          const elementAttr = await getValue(
            page,
            `${tableId} tbody tr:nth-child(${row}) ${elementId}`,
          );

          if ((elementAttr === parsedInput) === !negate) return waitForResult.PASS;
          return waitForResult.FAIL;
        }

        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        target: elementKey,
        failureMsg: `Expected ${elementKey} to ${
          negate ? 'not' : ''
        }equal the value ${parsedInput}`,
      },
    );
  },
);
