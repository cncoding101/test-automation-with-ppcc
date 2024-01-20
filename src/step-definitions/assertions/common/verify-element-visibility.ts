import { CustomWorld } from '@step-definitions/setup/world';
import { getElementId } from '@support/element';
import { getElement, getElements } from '@support/html-behaviour';
import { waitFor, waitForResult } from '@support/wait-for-behaviour';
import { ElementKey } from '@utils/types/global';
import { logger } from '@utils/helpers/logger';
import { Then } from '@cucumber/cucumber';

Then(
  /^The "([^"]*)" should( not)? be displayed$/,
  async function (this: CustomWorld, elementKey: ElementKey, negate: boolean) {
    const {
      screen: { page },
      globalConfig,
    } = this;
    logger.log(`The ${elementKey} should be displayed`);

    const elementId = getElementId(page, elementKey, globalConfig);
    await waitFor(
      async () => {
        const isElementVisible = (await getElement(page, elementId)) != null;
        if (isElementVisible === !negate) return waitForResult.PASS;
        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        target: elementKey,
        failureMsg: `Expected ${elementKey} to ${negate ? 'not' : ''} be displayed`,
      },
    );
  },
);

Then(
  /^The "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)" "([^"]*)" should( not)? be displayed$/,
  async function (
    this: CustomWorld,
    elementPosition: string,
    elementKey: ElementKey,
    negate: boolean,
  ) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(`the ${elementPosition} ${elementKey} should ${negate ? 'not' : ''}be displayed`);

    const elementId = getElementId(page, elementKey, globalConfig);
    const index = Number(elementPosition.match(/\d/g)?.join('')) - 1;

    await waitFor(
      async () => {
        const isElementVisible = (await getElement(page, `${elementId}>>nth=${index}`)) != null;
        if (isElementVisible === !negate) return waitForResult.PASS;
        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        target: elementKey,
        failureMsg: `Expected ${elementPosition} ${elementKey} to ${
          negate ? 'not' : ''
        } be displayed`,
      },
    );
  },
);

Then(
  /^I should( not)? see "(\d*)" "([^"]*)" displayed$/,
  async function (this: CustomWorld, negate: boolean, count: string, elementKey: ElementKey) {
    const {
      screen: { page },
      globalConfig,
    } = this;

    logger.log(`I should ${negate ? 'not ' : ''}see ${count} ${elementKey} displayed`);

    const elementId = getElementId(page, elementKey, globalConfig);

    await waitFor(
      async () => {
        const element = await getElements(page, elementId);
        if ((Number(count) === element.length) === !negate) return waitForResult.PASS;
        return waitForResult.ELEMENT_NOT_AVAILABLE;
      },
      globalConfig,
      {
        target: elementKey,
        failureMsg: `Expected ${count} ${elementKey} to ${negate ? 'not' : ''} be displayed`,
      },
    );
  },
);
