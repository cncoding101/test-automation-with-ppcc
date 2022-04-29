import { ICustomWorld } from '@/support/custom-world';
import { config } from '@/support/config';
import { Given, When, Then } from '@cucumber/cucumber';

Given('Go to the onlinefuel website login page', async function (this: ICustomWorld) {
  const page = this.page!; // it will always exist
  await page.goto(`${config.urls.olfstaging}/login`);
});

When('I enter to the email input {string}', async function (this: ICustomWorld, email: string) {
  const page = this.page!;
  await page.locator('input[type="email"]').click();
  await page.locator('input[type="email"]').fill(email);
});

When('The password input {string}', async function (this: ICustomWorld, password: string) {
  const page = this.page!;
  await page.locator('input[type="password"]').click();
  await page.locator('input[type="password"]').fill(password);
});

When('Click the login button', async function () {
  const page = this.page!;
  await page.locator('button:has-text("Login")').click();
});

Then('I fail to login and I see a error message', async function (this: ICustomWorld) {
  const page = this.page!;
  await page
    .locator(
      'text=/.*Login leider nicht erfolgreich. Versuchen Sie es erneut oder klicken Sie auf "Pa.*/',
    )
    .waitFor();
});

Then('I successfully login and see the dashboard', async function () {
  const page = this.page!;
  await page.locator('h1:has-text("Dashboard")').waitFor();
});
