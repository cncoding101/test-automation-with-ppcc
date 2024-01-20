import { logger } from './logger';
import { DBConnections, Migration, Provider } from '@utils/types/global';
import { MongoConnection } from 'data-access/mongo';
import { PROVIDER_TYPES } from '@utils/constants/db';
import { PostgresConnection } from 'data-access/postgres';

const migrateData = async (
  provider: Provider,
  migrationData: Migration[],
  connections: DBConnections,
): Promise<void> => {
  logger.log(`Begin migrating data to db provider ${provider}`);
  for (let i = 0; i < migrationData.length; i++) {
    const { table, database, data } = migrationData[i];
    let dbConnector = null;
    switch (provider) {
      case PROVIDER_TYPES.mongodb:
        if (connections.mongodb[database]) dbConnector = connections.mongodb[database];
        else {
          dbConnector = new MongoConnection(
            database,
            process.env[`${provider.toUpperCase()}_HOST`],
            process.env[`${provider.toUpperCase()}_PORT`]
              ? Number(process.env[`${provider.toUpperCase()}_PORT`])
              : undefined,
            process.env[`${provider.toUpperCase()}_USERNAME`],
            process.env[`${provider.toUpperCase()}_PASSWORD`],
          );

          if (!dbConnector) throw new Error(`No connection found for the provider ${provider}`);
          await dbConnector.connect();
          await dbConnector.dumpDB();
          connections.mongodb[database] = dbConnector;
        }

        break;

      case PROVIDER_TYPES.postgresdb:
        if (connections.postgresdb[database]) dbConnector = connections.postgresdb[database];
        else {
          dbConnector = new PostgresConnection(
            database,
            process.env[`${provider.toUpperCase()}_HOST`],
            process.env[`${provider.toUpperCase()}_PORT`]
              ? Number(process.env[`${provider.toUpperCase()}_PORT`])
              : undefined,
            process.env[`${provider.toUpperCase()}_USERNAME`],
            process.env[`${provider.toUpperCase()}_PASSWORD`],
          );
          if (!dbConnector) throw new Error(`No connection found for the provider ${provider}`);
          await dbConnector.connect();
          await dbConnector.dumpDB();
          connections.postgresdb[database] = dbConnector;
        }

        break;
    }

    await dbConnector.createMany(table, data);
    logger.log(`End migration data to db provider ${provider}`);
  }
};

const resetProvider = async (
  connections:
    | { [database: string]: MongoConnection }
    | { [database: string]: PostgresConnection } = {},
) => {
  if (Object.values(connections).length === 0) return;

  for (const connection of Object.values(connections)) {
    await connection.reset();
    await connection.close();
  }
};

const resetDBs = async (dbConnections: DBConnections) => {
  const allPromises = [];
  for (const [provider, data] of Object.entries(dbConnections)) {
    switch (provider) {
      case PROVIDER_TYPES.mongodb:
        allPromises.push(resetProvider(data));
        break;

      case PROVIDER_TYPES.postgresdb:
        allPromises.push(resetProvider(data));
        break;
    }
  }

  if (allPromises.length > 0) await Promise.all(allPromises);
};

export { migrateData, resetDBs };
