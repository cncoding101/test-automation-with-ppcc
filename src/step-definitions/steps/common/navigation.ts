import { CustomWorld } from '@step-definitions/setup/world';
import { PageId } from '@utils/types/global';
import {
  currentPathMatchesPageId,
  navigateToPage,
  reloadPage,
} from '@support/navigation-behaviour';
import { waitFor } from '@support/wait-for-behaviour';
import { logger } from '@utils/helpers/logger';
import { Given, Then } from '@cucumber/cucumber';

Given(/^I am on the "([^"]*)" page$/, async function (this: CustomWorld, pageId: PageId) {
  const {
    screen: { page },
    globalConfig,
  } = this;

  logger.log(`I am on the ${pageId} page`);

  await navigateToPage(page, pageId, globalConfig);
  await waitFor(() => currentPathMatchesPageId(page, pageId, globalConfig), globalConfig, {
    target: pageId,
    type: 'page',
  });
});

Then(/^I am directed to the "([^"]*)" page$/, async function (this: CustomWorld, pageId: PageId) {
  const {
    screen: { page },
    globalConfig,
  } = this;

  logger.log(`I am directed to the ${pageId} page`);

  await waitFor(() => currentPathMatchesPageId(page, pageId, globalConfig), globalConfig, {
    target: pageId,
    type: 'page',
  });
});

Given(/^I refresh on the "([^"]*)" page$/, async function (this: CustomWorld, pageId: PageId) {
  const {
    screen: { page },
    globalConfig,
  } = this;

  logger.log(`I refresh the ${pageId} page`);

  await reloadPage(page);

  await waitFor(() => currentPathMatchesPageId(page, pageId, globalConfig), globalConfig, {
    target: pageId,
    type: 'page',
  });
});
