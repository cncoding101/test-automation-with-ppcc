import { IPlatformUrl } from '@utils/interfaces/platform';

const URLS: IPlatformUrl = {} as const;

enum eEnvironmentTypes {
  staging = 'staging',
  production = 'production',
  development = 'development',
}

enum ePlatformTypes {}

export { URLS, eEnvironmentTypes, ePlatformTypes };
