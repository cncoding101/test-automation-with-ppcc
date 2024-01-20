import { EnvironmentType, PlatformType } from '@utils/types/platform';
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PLATFORM: PlatformType;
      ENVIRONMENT: EnvironmentType;
    }
  }
}
