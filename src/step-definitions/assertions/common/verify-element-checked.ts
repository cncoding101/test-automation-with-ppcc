import { CustomWorld } from '@step-definitions/setup/world';
import { waitFor, waitForResult, waitForSelector } from '@support/wait-for-behaviour';
import { ElementKey } from '@utils/types/global';
import { getElementId } from '@support/element';
import { logger } from '@utils/helpers/logger';
import { elementChecked } from '@support/html-behaviour';
import { Then } from '@cucumber/cucumber';

Then(
  /^The "([^"]*)" (?:radio button|checkbox|switch) should( not)? be checked$/,
  async function (this: CustomWorld, elementKey: ElementKey, negate: boolean) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `The ${elementKey} radio button|checkbox|switch should ${negate ? 'not' : ''} be checked`,
    );

    const elementId = getElementId(page, elementKey, globalConfig);
    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementId);
        if (elementStable) {
          const isElementChecked = await elementChecked(page, elementId);
          if (isElementChecked === !negate) return waitForResult.PASS;
          return waitForResult.FAIL;
        }

        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        target: elementKey,
        failureMsg: `Expected ${elementKey} to ${negate ? 'not' : ''} be checked`,
      },
    );
  },
);

Then(
  /^The "([^"]*)" (?:radio button|checkbox|switch) from the "([^"]*)" table on row (\d+) should( not)? be checked$/,
  async function (
    this: CustomWorld,
    elementKey: ElementKey,
    tableKey: ElementKey,
    row: number,
    negate: boolean,
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `The ${elementKey} radio button|checkbox|switch from the ${tableKey} on row ${row} should ${
        negate ? 'not' : ''
      } be checked`,
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
            const isElementChecked = await elementChecked(page, elementId);
            if (isElementChecked === !negate) return waitForResult.PASS;

            return waitForResult.FAIL;
          }
        }

        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        target: elementKey,
        failureMsg: `Expected ${elementKey} to ${negate ? 'not ' : ''}be checked`,
      },
    );
  },
);
