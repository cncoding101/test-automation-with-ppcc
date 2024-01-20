import { ILogin } from '@utils/interfaces/login';
import {
  HostsConfig,
  PagesConfig,
  EmailsConfig,
  IMigrationOptions,
  PageElementMappings,
  ErrorsConfig,
} from '@utils/types/global';

interface IMigrationConfigs {
  [account: string]: IMigrationOptions;
}

interface IErrorConfig {
  originalErrMsgRegexString: string;
  parsedErrMsg: string;
}

interface IGlobalConfig {
  hostsConfig: HostsConfig;
  pagesConfig: PagesConfig;
  emailsConfig?: EmailsConfig;
  errorsConfig: ErrorsConfig;
  loginsConfig?: ILogin[];
  migrationsConfig?: IMigrationConfigs;
  pageElementMappings: PageElementMappings;
}

export { IErrorConfig, IGlobalConfig, IMigrationConfigs };
