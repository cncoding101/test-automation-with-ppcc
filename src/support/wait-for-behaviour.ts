import { handleError } from './error-helper';
import { IGlobalConfig } from '@utils/interfaces/global';
import { ElementLocator, WaitForTarget, WaitForTargetType } from '@utils/types/global';
import config from 'config/environment';
import { logger } from '@utils/helpers/logger';
import { Page } from 'playwright';

export const enum waitForResult {
  PASS = 1,
  FAIL = 2,
  ELEMENT_NOT_AVAILABLE = 3,
}

export type waitForResultWithContext = {
  result: waitForResult;
  replace?: string;
};

/**
 * This function can be used to trigger a retry mechanism
 * NOTE can not be used together with playwright/test
 * Playwright do not play well with retries..
 * @param predicate
 * @param options
 * @returns
 */
const waitFor = async <T>(
  predicate: () =>
    | waitForResult
    | Promise<waitForResult>
    | waitForResultWithContext
    | Promise<waitForResultWithContext>,
  globalConfig: IGlobalConfig,
  options?: {
    wait?: number;
    target?: WaitForTarget;
    type?: WaitForTargetType;
    failureMsg?: string;
  },
): Promise<void> => {
  const timeout = config.TIMEOUT / 2;
  const { wait = 2000, target = '', type = 'element' } = options || {};

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const startDate = new Date();
  let notAvailableContext: string | undefined;

  try {
    while (new Date().getTime() - startDate.getTime() < timeout) {
      const result = await predicate();
      let resultAs: waitForResult;
      if ((result as waitForResultWithContext).result) {
        notAvailableContext = (result as waitForResultWithContext).replace;
        resultAs = (result as waitForResultWithContext).result;
      } else resultAs = result as waitForResult;

      if (resultAs === waitForResult.PASS) return;
      else if (resultAs === waitForResult.FAIL)
        throw new Error(options?.failureMsg || 'Test assertion failed');

      await sleep(wait);
      logger.debug(`Waiting ${wait}ms`);
    }

    throw new Error(`Wait time of ${timeout}ms for ${notAvailableContext || target} exceeded`);
  } catch (error) {
    handleError(globalConfig.errorsConfig, error as Error, target, type);
  }
};

const waitForSelector = async (page: Page, elementId: ElementLocator): Promise<boolean> => {
  try {
    await page.waitForSelector(elementId, {
      state: 'visible',
      timeout: Number(process.env.SELECTOR_TIMEOUT) ?? 2000,
    });

    return true;
  } catch (e) {
    return false;
  }
};

export { waitFor, waitForSelector };
