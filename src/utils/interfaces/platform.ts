import { Platform, Environment } from '@utils/types/platform';

type IPlatformUrl = {
  [platform in Platform]: {
    [environment in Environment]: string;
  };
};

export { IPlatformUrl };
