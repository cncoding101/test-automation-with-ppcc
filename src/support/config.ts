import { LaunchOptions } from 'playwright';
import { base } from '@/utils/const';

const browserOptions: LaunchOptions = {
  slowMo: 0,
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
};

export const config = {
  browser: process.env.BROWSER || 'chromium',
  browserOptions,
  urls: {
    base: base.urls.base,
    olfstaging: base.urls.olfstaging,
  },
  imgThreshold: { threshold: 0.4 },
  api: 'https://www.boredapi.com/api/',
};
