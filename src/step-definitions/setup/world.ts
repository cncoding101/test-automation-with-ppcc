import playwrightConfig from '../../../playwright.config';
import env from '@config/environment';
import { config } from '@config/browser';
import { generateLoginStateById } from '@support/state-management';
import { IGlobalConfig } from '@utils/interfaces/global';
// import { fileExist } from '@utils/helpers/file';
import { DBConnections } from '@utils/types/global';
// eslint-disable-next-line import/default
import playwright, {
  BrowserContext,
  Page,
  Browser,
  BrowserType,
  BrowserContextOptions,
} from 'playwright';
import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import * as messages from '@cucumber/messages';
import axios, { AxiosInstance } from 'axios';
import { PlaywrightTestConfig } from '@playwright/test';

interface IScreen {
  page: Page;
  browser: Browser;
  context: BrowserContext;
}

interface ICustomWorld {
  screen: IScreen;
  globalConfig: IGlobalConfig;
  pwConfig: PlaywrightTestConfig;
  server: AxiosInstance;
  dbConnections: DBConnections;
  debug: boolean;
  feature?: messages.Pickle;
  testName?: string;
  startTime?: Date;
  storageStateName?: string;
}

export class CustomWorld extends World implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);

    this.dbConnections = { mongodb: {}, postgresdb: {} };
    this.server = this.createServer();
    this.globalConfig = options.parameters as IGlobalConfig;
    this.pwConfig = playwrightConfig;
  }

  debug = false;
  screen!: IScreen;
  globalConfig: IGlobalConfig;
  pwConfig: PlaywrightTestConfig;
  server: AxiosInstance;
  dbConnections: DBConnections;
  feature?: messages.Pickle;
  testName?: string;
  startTime?: Date;
  storageStateName?: string;

  async init(contextOptions?: BrowserContextOptions): Promise<IScreen> {
    await this.screen?.page?.close();
    await this.screen?.context?.close();
    await this.screen?.browser?.close();

    const browser = await this.newBrowser();

    // creates the login states
    const navigationTime = this.pwConfig?.use?.navigationTimeout
      ? this.pwConfig.use.navigationTimeout
      : 3000;
    if (this.storageStateName) {
      // let generate = true;
      // const storagePath = `../../../storage/${this.storageStateName}`;
      // if (fileExist(storagePath)) {
      //   generate = false;
      //   const { cookies } = getJsonFromFile(storagePath);
      //   if (cookies && Array.isArray(cookies) && cookies.length > 0) {
      //     const { expires } = cookies[0];
      //     if (new Date() > expires) generate = true;
      //   }
      // }

      // TODO if the cookie has a valid expire we can check if it is needed to re-login..
      // if (generate) {
      const username = this.storageStateName.split('.')[0];
      await generateLoginStateById(username, browser, this.globalConfig, navigationTime);
      // }
    }

    const ctOptions = {
      ...this.pwConfig.use,
      ...contextOptions,
    };
    const context = await browser.newContext({
      storageState:
        this.storageStateName !== undefined ? `storage/${this.storageStateName}.json` : undefined,
      ...ctOptions,
    });
    await context.setDefaultNavigationTimeout(navigationTime);

    const page = await context.newPage();
    this.screen = {
      browser,
      context,
      page,
    };

    return this.screen;
  }

  private newBrowser = async (): Promise<Browser> => {
    const browserType: BrowserType = playwright[env.BROWSER];
    const browser = await browserType.launch({
      headless: env.HEADLESS,
      devtools: env.DEVTOOLS,
      args: ['--disable-web-security', '--disable-features=IsolateOrigins, site-per-process'],
    });

    return browser;
  };

  private createServer = (): AxiosInstance => {
    const server = axios.create();
    server.defaults.baseURL = config.api;
    server.defaults.headers.post = {
      'Content-Type': 'application/json',
    };
    server.interceptors.response.use((res: any) => res.data);

    return server;
  };
}

setWorldConstructor(CustomWorld);
