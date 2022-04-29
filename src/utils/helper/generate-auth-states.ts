// global-setup.ts
import { baseUrlType, browserType, authType } from '@/utils/types';
import { auth } from '@/utils/const';
import { config } from '@/support/config';

async function generateStates(browser: browserType, authType: authType, baseURL: baseUrlType) {
  if (!browser && !authType && !baseURL) return; // will not save and fail test

  const { allRecords } = auth;

  const page = await browser.newPage();
  await page.goto(`${config.urls[baseURL]}/login`);
  await page.fill('input[type="email"]', allRecords[authType].seller_1.email);
  await page.fill('input[type="password"]', allRecords[authType].seller_1.password);
  await page.locator('button:has-text("Login")').click();
  await page.locator('h1:has-text("Dashboard")').waitFor();
  await page.context().storageState({ path: `storage/${authType}-1.${baseURL}.json` });
  await page.close();
}

export default generateStates;
