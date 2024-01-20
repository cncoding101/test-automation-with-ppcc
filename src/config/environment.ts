import { BrowserType } from '@config/browser';
import { Environment, Platform } from '@utils/types/platform';
import * as dotenv from 'dotenv';
// import path from 'path';

// Parsing the env file.
dotenv.config();

// Interface to load common mandatory env variables
interface IEnv {
  LOG_LEVEL: string;
  PLATFORM: Platform;
  ENVIRONMENT: Environment;
  BROWSER: BrowserType;
  TIMEOUT: number;
  PARALLEL: number;
  RETRY: number;
  HEADLESS: boolean;
  VIDEO: boolean;
  DEVTOOLS: boolean;
  CI: boolean;
}

// Loading process.env as ENV interface
const getConfig = (): IEnv => {
  return {
    LOG_LEVEL: process.env.LOG_LEVEL ?? 'log',
    PLATFORM: process.env.PLATFORM as Platform,
    ENVIRONMENT: process.env.ENVIRONMENT as Environment,
    BROWSER: process.env.BROWSER as BrowserType,
    TIMEOUT: process.env.TIMEOUT ? Number(process.env.TIMEOUT) : 30000,
    PARALLEL: process.env.PARALLEL ? Number(process.env.PARALLEL) : 1,
    RETRY: process.env.RETRY ? Number(process.env.RETRY) : 0,
    HEADLESS: process.env.HEADLESS !== 'false',
    VIDEO: process.env.VIDEO !== 'false',
    DEVTOOLS: process.env.DEVTOOLS !== 'false',
    CI: process.env.CI !== 'false',
  };
};

// Throwing an Error if any field was undefined
const getSanitzedConfig = (config: IEnv): IEnv => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config;
};

const config = getConfig();

// storing sensitive information
dotenv.config({ path: `${config.ENVIRONMENT}.env` });

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
