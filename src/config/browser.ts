import { URLS } from '@utils/constants/base';
import { LaunchOptions } from 'playwright';

const browserOptions: LaunchOptions = {
  slowMo: 0,
  args: [
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    '--disable-web-security',
    '--disable-features=IsolateOrigins, site-per-process',
  ],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
};

const BROWSER_TYPES = ['chromium', 'firefox', 'webkit'] as const;
export type BrowserType = typeof BROWSER_TYPES[number];

export const config = {
  browserTypes: BROWSER_TYPES,
  browserOptions,
  urls: URLS,
  imgThreshold: { threshold: 0.4 },
  api: 'https://www.boredapi.com/api/',
};
