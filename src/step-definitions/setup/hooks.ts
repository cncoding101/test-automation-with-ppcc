import { CustomWorld } from '@step-definitions/setup/world';
// import { auth } from '@utils/constants';
import env from '@config/environment';
import { PROVIDER_TYPES } from '@utils/constants/db';
import { migrateData, resetDBs } from '@utils/helpers/migrate';
import {
  Before,
  After,
  Status,
  ITestCaseHookParameter,
  setDefaultTimeout,
} from '@cucumber/cucumber';

// set global timeout for all tests when running with async/await..
setDefaultTimeout(env.TIMEOUT);
Before({ tags: '@ignore' }, async function () {
  return 'skipped' as any;
});

Before({ tags: '@debug' }, async function (this: CustomWorld) {
  this.debug = true;
});

Before({ tags: '@login' }, async function (this: CustomWorld, { pickle }: ITestCaseHookParameter) {
  const tags = pickle.tags;
  // fetch user, denoted by 'as-' tag
  const asUser = tags.map((tag) => tag.name).find((tag) => tag.includes('@as'));
  if (asUser && asUser) {
    const { PLATFORM, ENVIRONMENT } = env;
    const username = asUser.split('@as-')[asUser.split('@as-').length - 1];

    if (PLATFORM && ENVIRONMENT && username) {
      // migrating data for the test account if any..
      // NOTE if a timeout or an error outside of the catch is thrown the migration files will not reset..
      // TODO find a solution..
      const { globalConfig, dbConnections } = this;
      if (globalConfig.migrationsConfig) {
        const migrationData = globalConfig.migrationsConfig[username];
        if (migrationData) {
          const { mongodb, postgresdb } = migrationData;

          const allPromises = [];
          if (mongodb && mongodb.length > 0) {
            allPromises.push(migrateData(PROVIDER_TYPES.mongodb, mongodb, dbConnections));
          }

          if (postgresdb && postgresdb.length > 0) {
            allPromises.push(migrateData(PROVIDER_TYPES.postgresdb, postgresdb, dbConnections));
          }

          if (allPromises.length > 0) await Promise.all(allPromises);
        }
      }

      this.storageStateName = `${username}.${PLATFORM}-${ENVIRONMENT}`;
    }
  }
});

Before(async function (this: CustomWorld, { pickle }: ITestCaseHookParameter) {
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');
  // customize the [browser context](https://playwright.dev/docs/next/api/class-browser#browsernewcontextoptions)
  const contextOptions = {
    recordVideo: env.VIDEO ? { dir: `reports/recordings/${pickle.name}` } : undefined,
  };

  const ready = await this.init(contextOptions);
  const {
    screen: { page },
  } = this;

  // watches for console calls from the page
  page.on('console', async (msg) => {
    if (msg.type() === 'log') {
      await this.attach(msg.text());
    }
  });
  this.feature = pickle;

  return ready;
});

After(async function (this: CustomWorld, { pickle, result }: ITestCaseHookParameter) {
  try {
    const {
      screen: { page, browser },
    } = this;

    if (result) {
      await this.attach(`Status: ${result.status}. Duration:${result.duration?.nanos}ns`);

      // if the test fails take a snapshot
      if (result.status !== Status.PASSED) {
        const image = await page.screenshot({
          path: `./reports/screenshots/${pickle.name}.png`,
        });
        image && (await this.attach(image, 'image/png'));
      }
    }

    // clear all tables from the db providers
    await browser.close();
    return browser;
  } catch (err) {
    throw new Error(err);
  } finally {
    const { dbConnections } = this;

    await resetDBs(dbConnections);
  }
});
