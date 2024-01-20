import { IGlobalConfig } from '@utils/interfaces/global';
import env from '@config/environment';
import { navigateToPage } from '@support/navigation-behaviour';
import { getElementId } from '@support/element';
import { Browser } from 'playwright';

// specific to marketplace login
const generateLoginStateById = async (
  id: string,
  browser: Browser,
  globalConfig: IGlobalConfig,
  navigationTime: number,
): Promise<void> => {
  // go to default login page if exist..
  // const { ALL_RECORDS } = auth;
  const { PLATFORM, ENVIRONMENT } = env;
  const { loginsConfig } = globalConfig;
  if (!loginsConfig) return;

  const records = loginsConfig;
  if (!records || records.length === 0) return;

  const record = records.find((r) => r.id === id);
  if (!record) return;

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(navigationTime);
  // open new page
  // navigate to default login
  const navigated = await navigateToPage(page, 'login', globalConfig);
  if (!navigated) throw new Error(`Timeout was not able to navigate to login page`);

  // find in mappings..
  const emailElemId = getElementId(page, 'email input', globalConfig);
  const passwordElemId = getElementId(page, 'password input', globalConfig);
  const btnElemId = getElementId(page, 'login button', globalConfig);
  const dashboardElemId = getElementId(page, 'dashboard title', globalConfig);
  // fill in login credentials
  await page.fill(emailElemId, record.email);
  await page.fill(passwordElemId, record.password);

  // submit and wait for dashboard
  await page.locator(btnElemId).click();
  await page.locator(dashboardElemId).waitFor();
  // store state info to a json file
  await page.context().storageState({
    path: `storage/${id}.${PLATFORM}-${ENVIRONMENT}.json`,
  });
  await page.close();
};

export { generateLoginStateById };
