import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Go to https://playwright.dev/
  await page.goto('https://playwright.dev/');

  // Click [aria-label="Switch between dark and light mode \(currently dark mode\)"]
  await page
    .locator('[aria-label="Switch between dark and light mode \\(currently dark mode\\)"]')
    .click();

  // Click [aria-label="Switch between dark and light mode \(currently light mode\)"]
  await page
    .locator('[aria-label="Switch between dark and light mode \\(currently light mode\\)"]')
    .click();
});
