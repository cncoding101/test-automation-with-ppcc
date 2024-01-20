import { waitForResult } from './wait-for-behaviour';
import { PageId } from '@utils/types/global';
import { IGlobalConfig } from '@utils/interfaces/global';
import env from '@config/environment';
import { Page } from 'playwright';

const navigateToPage = async (
  page: Page,
  pageId: PageId,
  { pagesConfig, hostsConfig }: IGlobalConfig,
): Promise<boolean> => {
  const hostPath = hostsConfig[env.ENVIRONMENT];
  if (!hostPath) return false;

  const url = new URL(hostPath);
  const pagesConfigItem = pagesConfig[pageId];

  if (!pagesConfigItem) return false;
  const { route } = pagesConfigItem;

  if (!route) return false;
  url.pathname = route;

  await page.goto(url.href);
  return true;
};

const pathMatchesPageId = (
  path: string,
  pageId: PageId,
  { pagesConfig }: IGlobalConfig,
): boolean => {
  const pageRegexString = pagesConfig[pageId].regex;
  const pageRegex = new RegExp(pageRegexString);

  return pageRegex.test(decodeURI(path));
};

const currentPathMatchesPageId = (
  page: Page,
  pageId: PageId,
  globalConfig: IGlobalConfig,
): waitForResult => {
  const { pathname: currentPath } = new URL(page.url());

  if (pathMatchesPageId(currentPath, pageId, globalConfig)) return waitForResult.PASS;
  return waitForResult.ELEMENT_NOT_AVAILABLE;
};

const getCurrentPageId = (page: Page, globalConfig: IGlobalConfig): PageId => {
  const { pagesConfig } = globalConfig;

  const pageConfigPageIds = Object.keys(pagesConfig);
  const { pathname: currentPath } = new URL(page.url());

  const currentPageId = pageConfigPageIds.find((pageId) =>
    pathMatchesPageId(currentPath, pageId, globalConfig),
  );
  if (!currentPageId)
    throw new Error(`Failed to get page name from current route ${currentPath}, \
                    possible pages: ${JSON.stringify(pagesConfig)}`);

  return currentPageId;
};

const reloadPage = async (page: Page): Promise<void> => {
  await page.reload();
};

export { navigateToPage, currentPathMatchesPageId, getCurrentPageId, reloadPage };
