import { ChromiumBrowser, FirefoxBrowser, WebKitBrowser } from 'playwright';

type browserType = ChromiumBrowser | FirefoxBrowser | WebKitBrowser;

export default browserType;
