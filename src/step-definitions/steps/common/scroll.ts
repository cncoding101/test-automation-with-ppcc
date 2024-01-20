import { CustomWorld } from '@step-definitions/setup/world';
import { scrollIntoView } from '@support/html-behaviour';
import { waitFor, waitForResult, waitForSelector } from '@support/wait-for-behaviour';
import { ElementKey } from '@utils/types/global';
import { logger } from '@utils/helpers/logger';
import { getElementId } from '@support/element';
import { Then } from '@cucumber/cucumber';

Then(/^I scroll to the "([^"]*)"$/, async function (this: CustomWorld, elementKey: ElementKey) {
  const {
    screen: { page },
    globalConfig,
  } = this;

  logger.log(`I scroll to the ${elementKey}`);

  const elementId = getElementId(page, elementKey, globalConfig);

  await waitFor(
    async () => {
      const elementStable = await waitForSelector(page, elementId);

      if (elementStable) {
        await scrollIntoView(page, elementId);
        return waitForResult.PASS;
      }

      return waitForResult.ELEMENT_NOT_AVAILABLE;
    },
    globalConfig,
    { target: elementKey },
  );
});
