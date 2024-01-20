import { ElementKey } from '@utils/types/global';
import { waitFor, waitForResult, waitForSelector } from '@support/wait-for-behaviour';
import { CustomWorld } from '@step-definitions/setup/world';
import { getElementId } from '@support/element';
import { logger } from '@utils/helpers/logger';
import { getTableData } from '@support/html-behaviour';
import { When, DataTable } from '@cucumber/cucumber';

When(
  /^The "([^"]*)" table should( not)? equal the following( skipping columns ([0-9]+(,[0-9]+)*))?( skipping rows ([0-9]+(,[0-9]+)*))?:$/,
  async function (
    this: CustomWorld,
    elementKey: ElementKey,
    negate: boolean,
    skipCols: string,
    skipRows: string,
    table: DataTable,
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(
      `The ${elementKey} table should${negate ? ' not' : ''} equal the following${
        skipCols ? ` skipping columns ${skipCols}` : ''
      }${skipRows ? ` skipping rows ${skipRows}` : ''}:`,
    );

    await waitFor(
      async () => {
        const elementId = getElementId(page, elementKey, globalConfig);
        const elementStable = await waitForSelector(page, elementId);

        if (elementStable) {
          const colsToSkip = skipCols ? skipCols.split(',').map((x) => Number(x)) : [];
          const rowsToSkip = skipRows ? skipRows.split(',').map((x) => Number(x)) : [];
          const data = await getTableData(page, colsToSkip, rowsToSkip, elementId);

          if ((data === JSON.stringify(table.raw())) === !negate) return waitForResult.PASS;
          return waitForResult.FAIL;
        }

        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        target: elementKey,
        failureMsg: `Expected ${elementKey} to ${negate ? 'not ' : ''}equal ${table.raw()}`,
      },
    );
  },
);
