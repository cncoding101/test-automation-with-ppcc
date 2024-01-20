import { getElementId } from '@support/element';
import { ElementKey } from '@utils/types/global';
import { checkElement, uncheckElement } from '@support/html-behaviour';
import { CustomWorld } from '@step-definitions/setup/world';
import { logger } from '@utils/helpers/logger';
import { waitFor, waitForResult, waitForSelector } from '@support/wait-for-behaviour';
import { Then } from '@cucumber/cucumber';

Then(
  /^I (check)?(uncheck)? the "([^"]*)" (?:radio button|checkbox|switch)$/,
  async function (this: CustomWorld, checked: boolean, unchecked: boolean, elementKey: ElementKey) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `I ${unchecked ? 'uncheck' : 'check'} the ${elementKey} radio button|checkbox|switch`,
    );

    const elementId = getElementId(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementId);

        if (elementStable) {
          if (unchecked) await uncheckElement(page, elementId);
          else await checkElement(page, elementId);

          return waitForResult.PASS;
        }

        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      { target: elementKey },
    );
  },
);

Then(
  /^I (check)?(uncheck)? the "([^"]*)" (?:radio button|checkbox|switch) from the "([^"]*)" table on row (\d+)$/,
  async function (
    this: CustomWorld,
    checked: boolean,
    unchecked: boolean,
    elementKey: ElementKey,
    tableKey: ElementKey,
    row: number,
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `I ${
        unchecked ? 'uncheck' : 'check'
      } the ${elementKey} radio button|checkbox|switch from the ${tableKey} table on row ${row}`,
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
            if (unchecked) await uncheckElement(page, elementId);
            else await checkElement(page, elementId);

            return waitForResult.PASS;
          }
        }

        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      { target: elementKey },
    );
  },
);
