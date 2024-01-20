import { ElementKey } from '@utils/types/global';
import { CustomWorld } from '@step-definitions/setup/world';
import { waitFor, waitForResult, waitForSelector } from '@support/wait-for-behaviour';
import { getElementId } from '@support/element';
import { clickElement } from '@support/html-behaviour';
import { logger } from '@utils/helpers/logger';
import { When } from '@cucumber/cucumber';

When(
  /^I click on the "([^"]*)" (?:button|link|icon|element|tab)$/,
  async function (this: CustomWorld, elementKey: ElementKey) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(`I click the ${elementKey} (?:button|link|icon|element|tab)`);

    const elementId = getElementId(page, elementKey, globalConfig);
    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementId);

        if (elementStable) {
          await clickElement(page, elementId);
          return waitForResult.PASS;
        }

        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      { target: elementKey },
    );
  },
);

When(
  /^I click on the "([^"]*)" (?:button|link|icon|element) from the "([^"]*)" table on row (\d+)$/,
  async function (this: CustomWorld, elementKey: ElementKey, tableKey: ElementKey, row: number) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `I click the ${elementKey} (?:button|link|icon|element) from the ${tableKey} table on row ${row}`,
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
            await clickElement(page, elementId);
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
