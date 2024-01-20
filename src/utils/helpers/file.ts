import { getDate } from './date';
import { PROVIDER_TYPES } from '../constants/db';
import { RULE_TYPES } from '../constants/rule';
import { DATE_TYPES } from '../constants/date';
import { IMigrationConfigs } from '@utils/interfaces/global';
import { IMigrationOptions, Provider } from '@utils/types/global';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const getJsonFromFile = <T = Record<string, any>>(path: string): T => {
  return require(`${process.cwd()}${path}`);
};

const fileExist = (filePath?: string): boolean => {
  if (!filePath) return false;

  const absolutePath = path.join(__dirname, filePath);
  if (fs.existsSync(absolutePath)) {
    return true;
  }
  return false;
};

const readMigrationFiles = (folderPath: string): IMigrationConfigs | null => {
  if (!fileExist(folderPath)) {
    return null;
  }

  const migrations: IMigrationConfigs = {};

  const processFile = (filePath: string) => {
    const extension = path.extname(filePath);
    if (extension !== '.json') return;

    const account = path.basename(filePath, extension);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const accountMigrations: IMigrationOptions = JSON.parse(fileContents);
    const fileEntries = Object.entries(accountMigrations);

    for (const [provider, providerEntries] of fileEntries) {
      if (!PROVIDER_TYPES[provider as Provider] || providerEntries.length === 0) continue;

      for (let i = 0; i < providerEntries.length; i++) {
        const { data, database, table } = providerEntries[i];
        if (!database || !table || !data || !Array.isArray(data) || data.length === 0) continue;

        // check if rows contain rules
        for (let k = 0; k < data.length; k++) {
          for (const [key, value] of Object.entries(data[k])) {
            switch (value) {
              case RULE_TYPES.year:
                // currently only support for current year
                data[k][key] = getDate<number>(new Date(), DATE_TYPES.year); // TODO move locale into row info..
                break;

              case RULE_TYPES.month:
                // currently only support for current month
                data[k][key] = getDate<number>(new Date(), DATE_TYPES.monthNumber);
                break;

              case RULE_TYPES.date:
                // currently only support for current month
                data[k][key] = new Date();
                break;
            }
          }
        }

        migrations[account] = migrations[account] || {};
        migrations[account][provider as Provider] = migrations[account][provider as Provider] || [];
        migrations[account][provider as Provider]?.push({ data, database, table });
      }
    }
  };

  const processDirectory = (dirPath: string) => {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        processDirectory(filePath);
      } else {
        processFile(filePath);
      }
    }
  };

  const absolutePath = path.resolve(__dirname, folderPath);
  processDirectory(absolutePath);

  if (Object.keys(migrations).length === 0) return null;

  return migrations;
};

const executeShellScript = async (filePath: string, args: string[]): Promise<void> => {
  const command = `sh ${filePath} ${args.join(' ')}`;
  try {
    const { stdout, stderr } = await promisify(exec)(command);
    if (stderr) {
      console.error(`Shell script produced an error: ${stderr}`);
    } else {
      console.log(`Shell script output: ${stdout}`);
    }
  } catch (error) {
    console.error(`Error executing shell script: ${error.message}`);
  }
};

export { fileExist, getJsonFromFile, readMigrationFiles, executeShellScript };
