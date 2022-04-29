import { ICustomWorld } from '@/support/custom-world';
import { Given, When, Then } from '@cucumber/cucumber';

Given('Seller has pricing engine enabled', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.locator('text=Meine Angebote').click();
  await page.locator('text=Pricing Engine');
});

Given('A seller has navigated to {string}', async function (this: ICustomWorld, title: string) {
  const page = this.page!;
  await page.locator(`text=${title}`).click();
});

When('The seller clicks the {string} button', async function (this: ICustomWorld, title: string) {
  const page = this.page!;
  await page.locator(`button[type="button"]:has-text("${title}")`).click();
});

Then('A popup with the pricing engine rules is displayed', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.locator('h2:has-text("Pricing Engine")');
});
