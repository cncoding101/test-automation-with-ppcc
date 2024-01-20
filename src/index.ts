import { getJsonFromFile, fileExist, readMigrationFiles } from './utils/helpers/file';
import {
  PagesConfig,
  HostsConfig,
  EmailsConfig,
  PageElementMappings,
  ErrorsConfig,
} from './utils/types/global';
import env from './config/environment';
import { ILoginRecords } from './utils/interfaces/login';
import { IGlobalConfig } from './utils/interfaces/global';
import fs from 'fs';

const basePath = `/config/${env.PLATFORM}`;
const hostsConfig: HostsConfig = getJsonFromFile(`${basePath}/hosts.json`);
const pagesConfig: PagesConfig = getJsonFromFile(`${basePath}/pages.json`);

let errorsConfig: ErrorsConfig | null = null;
if (fileExist(`../../../${basePath}/errors.json`))
  errorsConfig = getJsonFromFile(`${basePath}/errors.json`);

let emailsConfig: EmailsConfig | null = null;
if (fileExist(`../../../${basePath}/emails.json`))
  emailsConfig = getJsonFromFile(`${basePath}/emails.json`);

let loginsConfig: ILoginRecords | null = null;
if (fileExist(`../../../${basePath}/logins.json`))
  loginsConfig = getJsonFromFile(`${basePath}/logins.json`);

const migrationsConfig = readMigrationFiles(`../../../${basePath}/migrations`);
const mappingFiles = fs.readdirSync(`${process.cwd()}${basePath}/mappings`); // folder
const pageElementMappings: PageElementMappings = mappingFiles.reduce(
  (pageElementConfigAcc, file) => {
    const key = file.replace('.json', '');
    const elementsMapping = getJsonFromFile(`${basePath}/mappings/${file}`);

    return { ...pageElementConfigAcc, [key]: elementsMapping };
  },
  {},
);

const worldParameters: IGlobalConfig = {
  hostsConfig,
  pagesConfig,
  errorsConfig: errorsConfig ?? [],
  emailsConfig: emailsConfig ?? undefined,
  loginsConfig: loginsConfig ? loginsConfig[env.ENVIRONMENT] : undefined,
  migrationsConfig: migrationsConfig ?? undefined,
  pageElementMappings,
};

const common = `./src/features/**/**/*.feature \
                --require-module ts-node/register \
                --require ./src/step-definitions/**/**/*.ts \
                --world-parameters ${JSON.stringify(worldParameters)} \
                 -f json:./reports/report.json \
                --format progress-bar \
                --parallel ${env.PARALLEL} \
                --retry ${env.RETRY}`;

const all = common;
const dev = `${common} --tags '@dev'`; // used for development of tests, always remember to remove tag once done.
const only = `${common} --tags '@${env.PLATFORM}-${env.ENVIRONMENT}'`;

export { all, dev, only };
