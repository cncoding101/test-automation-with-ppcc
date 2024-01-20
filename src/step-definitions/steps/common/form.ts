import { waitFor, waitForResult, waitForSelector } from '@support/wait-for-behaviour';
import { getElementId } from '@support/element';
import { inputValue, selectValue } from '@support/html-behaviour';
import { CustomWorld } from '@step-definitions/setup/world';
import { ElementKey } from '@utils/types/global';
import { logger } from '@utils/helpers/logger';
import { parseInput } from '@support/input-helper';
import { Then } from '@cucumber/cucumber';

Then(
  /^I fill in the "([^"]*)" input with "([^"]*)"$/,
  async function (this: CustomWorld, elementKey: ElementKey, input: string) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(`I fill in the ${elementKey} input with ${input}`);

    const elementId = getElementId(page, elementKey, globalConfig);
    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementId);

        if (elementStable) {
          const parsedInput = parseInput(input, globalConfig);
          await inputValue(page, elementId, parsedInput);
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
  /^I select the "([^"]*)" option from the "([^"]*)"$/,
  async function (this: CustomWorld, option: string, elementKey: ElementKey) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(`I select the ${option} option from the ${elementKey}`);

    const elementId = getElementId(page, elementKey, globalConfig);
    await waitFor(
      async () => {
        const elementStable = await waitForSelector(page, elementId);

        if (elementStable) {
          await selectValue(page, option, elementId);
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
  /^I fill in the "([^"]*)" input with "([^"]*)" from the "([^"]*)" table on row (\d+)$/,
  async function (
    this: CustomWorld,
    elementKey: ElementKey,
    input: string,
    tableKey: string,
    row: number,
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `I fill in the ${elementKey} input with ${input} from the ${tableKey} table on row ${row}`,
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
            const parsedInput = parseInput(input, globalConfig);
            await inputValue(page, elementId, parsedInput);
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
