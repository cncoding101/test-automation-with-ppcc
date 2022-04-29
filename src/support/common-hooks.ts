import { ICustomWorld } from './custom-world';
import { config } from './config';
import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit } from 'playwright';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { auth, base } from '@/utils/const';
import { browserType } from '@/utils/types';
import generateStates from '@/utils/helper/generate-auth-states';
// import { ensureDir } from 'fs-extra';
import axios from 'axios';

let browser: browserType;
setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 1000);

BeforeAll(async function () {
  switch (config.browser) {
    case 'firefox':
      browser = await firefox.launch(config.browserOptions);
      break;
    case 'webkit':
      browser = await webkit.launch(config.browserOptions);
      break;
    default:
      browser = await chromium.launch(config.browserOptions);
  }

  // store login states
  const keys = Object.keys(base.urls);
  for (let i = 0; i < keys.length; i++) {
    switch (keys[i]) {
      case base.urlTypes.base: {
        break;
      }

      case base.urlTypes.olfstaging: {
        await generateStates(browser, auth.authTypes.sellers, base.urlTypes.olfstaging);
        break;
      }
    }
  }
});

Before({ tags: '@ignore' }, async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 'skipped' as any;
});

Before({ tags: '@debug' }, async function (this: ICustomWorld) {
  this.debug = true;
});

// these tags represent logins globally
Before({ tags: '@sellers' }, async function (this: ICustomWorld) {
  this.storageStateName = auth.authTypes.sellers;
});

Before({ tags: '@1' }, async function (this: ICustomWorld) {
  this.storageStateName = `${this.storageStateName}-1`;
});

Before({ tags: '@olfstaging' }, async function (this: ICustomWorld) {
  this.storageStateName = `${this.storageStateName}.${base.urlTypes.olfstaging}`;
});

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');
  // customize the [browser context](https://playwright.dev/docs/next/api/class-browser#browsernewcontextoptions)
  this.context = await browser.newContext({
    acceptDownloads: true,
    recordVideo: process.env.PWVIDEO ? { dir: 'screenshots' } : undefined,
    viewport: { width: 1200, height: 800 },
    storageState: 'storage/sellers-1.olfstaging.json',
    // this.storageStateName !== undefined ? `storage/${this.storageStateName}.json` : undefined,
  });

  this.server = axios.create();
  this.server.defaults.baseURL = config.api;
  this.server.defaults.headers.post = {
    'Content-Type': 'application/json',
  };
  this.server.interceptors.response.use((res) => res.data);
  // use login and set authorization if needed to access api
  // this.server.defaults.headers.common.Authorization = ;

  this.page = await this.context.newPage();
  // watches for console calls from the page
  this.page.on('console', async (msg) => {
    if (msg.type() === 'log') {
      await this.attach(msg.text());
    }
  });
  this.feature = pickle;
});

// add before tags to perform page interactions that will be used globally
Before({ tags: '@olfstaging' }, async function (this: ICustomWorld) {
  const page = this.page!;
  await page.goto(`${config.urls.olfstaging}`);
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  if (result) {
    await this.attach(`Status: ${result?.status}. Duration:${result.duration?.seconds}s`);

    // if the test fails take a snapshot
    if (result.status !== Status.PASSED) {
      const image = await this.page?.screenshot();
      image && (await this.attach(image, 'image/png'));
    }
  }
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  await browser.close();
});
