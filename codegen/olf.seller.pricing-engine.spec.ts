// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   // Go to https://frontend.staging.onlinefuels.io/
//   await page.goto('https://frontend.staging.onlinefuels.io/');

//   // Go to https://frontend.staging.onlinefuels.io/login
//   await page.goto('https://frontend.staging.onlinefuels.io/login');

//   // Click input[type="email"]
//   await page.locator('input[type="email"]').click();

//   // Fill input[type="email"]
//   await page.locator('input[type="email"]').fill('jg+testrail@onlinefuels.de');

//   // Click input[type="password"]
//   await page.locator('input[type="password"]').click();

//   // Fill input[type="password"]
//   await page.locator('input[type="password"]').fill('21OLF%1510s');

//   // Click button:has-text("Login")
//   await Promise.all([
//     page.waitForNavigation(/*{ url: 'https://frontend.staging.onlinefuels.io/' }*/),
//     page.locator('button:has-text("Login")').click(),
//   ]);

//   // Click text=Meine Angebote
//   await Promise.all([
//     page.waitForNavigation(/*{ url: 'https://frontend.staging.onlinefuels.io/meine-angebote' }*/),
//     page.locator('text=Meine Angebote').click(),
//   ]);

//   // Click text=Pricing Engine
//   await page.locator('button[type="button"]:has-text("Pricing Engine")').click();

//   // Click h2:has-text("Pricing Engine")
//   await page.locator('h2:has-text("Pricing Engine")').click();
// });
