import { PROVIDER_TYPES } from '../constants/db';
import { MongoConnection } from 'data-access/mongo';
import { PostgresConnection } from 'data-access/postgres';
import { IErrorConfig } from '@utils/interfaces/global';

type PageId = string;
type PagesConfig = Record<PageId, Record<string, string>>;
type HostsConfig = Record<string, string>;
type ElementKey = string;
type ElementLocator = string;
type EmailsConfig = Record<string, string>;
type WaitForTarget = PageId | ElementKey;
type WaitForTargetType = string;
type ErrorsConfig = IErrorConfig[];
type Migration = {
  data: Record<string, any>[];
  database: string;
  table: string;
};
type Provider = typeof PROVIDER_TYPES[keyof typeof PROVIDER_TYPES];
type IMigrationOptions = {
  [provider in Provider]?: Migration[];
};

type DBConnections = {
  mongodb: { [database: string]: MongoConnection };
  postgresdb: { [database: string]: PostgresConnection };
};

type PageElementMappings = Record<PageId, Record<ElementKey, ElementLocator>>;

export {
  PageId,
  Provider,
  PagesConfig,
  ElementKey,
  ElementLocator,
  HostsConfig,
  EmailsConfig,
  ErrorsConfig,
  WaitForTarget,
  WaitForTargetType,
  Migration,
  DBConnections,
  IMigrationOptions,
  PageElementMappings,
};
