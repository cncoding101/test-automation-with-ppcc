import { IConnection } from './interfaces';
import { logger } from '@utils/helpers/logger';
import { Pool, PoolConfig } from 'pg';

const defaultOptions: PoolConfig = {
  max: 10,
  ssl: false,
  statement_timeout: 5000,
};

class PostgresConnection implements IConnection<Pool> {
  private connection: Pool | null = null;
  private dump: Record<string, any> | null = null;

  constructor(
    private database: string,
    private hostname = 'localhost',
    private port = 5432,
    private user = 'postgres',
    private password = 'password',
  ) {}

  async connect(): Promise<Pool> {
    if (this.connection) {
      return this.connection;
    }

    if (!this.database) throw new Error('Please provide a database to connect');

    const pgOptions: PoolConfig = {
      ...defaultOptions,
      user: this.user,
      password: this.password,
      host: this.hostname,
      port: this.port,
      database: this.database,
    };
    const pool = new Pool(pgOptions);
    logger.log(`Created a pool to database ${this.database} using PostgresDB client`);
    this.connection = pool;

    return pool;
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
      logger.log(`disconnected PostgresDB client using database ${this.database}`);
      this.connection = null;
    }
  }

  public async createMany(table: string, data: Record<string, any>[]) {
    if (data.length === 0) return;
    if (!this.connection) {
      throw new Error('PostgreSQL client is not connected');
    }

    const client = await this.connection.connect();
    try {
      const columns = Object.keys(data[0]);
      const entries = data.map((obj) => Object.values(obj));
      let index = 1;
      const placeholders = entries
        .map((values) => `(${values.map(() => `$${index++}`).join(', ')})`)
        .join(',');
      // Check if the table exists
      const res = await client.query(
        'SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = $1)',
        [table],
      );
      const tableExists = res.rows[0].exists;

      if (!tableExists) {
        throw new Error(`Table '${table}' does not exist in the database`);
      }

      const sql = `INSERT INTO ${table}(${columns.join(', ')}) VALUES ${placeholders}`;
      logger.log(`Inserting migration data into database ${this.database} using PostgresDB client`);
      await client.query(sql, entries.flat());
    } catch (ex) {
      throw new Error(ex);
    } finally {
      client.release();
    }
  }

  public async dumpDB() {
    if (!this.connection) {
      throw new Error('PostgreSQL client is not connected');
    }

    const client = await this.connection.connect();
    try {
      const result = await client.query(
        `SELECT tablename FROM pg_tables WHERE schemaname=$1 AND NOT tablename='_prisma_migrations';`,
        ['public'],
      );
      const tables = result.rows.map((r) => r.tablename);
      const data: Record<string, any[]> = {};
      for (const table of tables) {
        const result = await client.query(`SELECT * FROM ${table}`);
        if (result && result.rows) data[table] = result.rows;
      }
      this.dump = data;
    } catch (e) {
      logger.log('Dump error stack:', e);
    } finally {
      client.release();
    }
  }

  public async reset() {
    if (!this.dump) {
      throw new Error('No database dump found');
    }

    logger.log(`Removing all data from database ${this.database} using PostgresDB`);
    await this.removeAll();
    logger.log('Reset all the data from the dump file');
    for (const [table, data] of Object.entries(this.dump)) {
      await this.createMany(table, data);
    }
  }

  public async removeAll() {
    if (!this.connection) {
      throw new Error('PostgreSQL client is not connected');
    }

    const client = await this.connection.connect();
    try {
      const result = await client.query(
        `SELECT tablename FROM pg_tables WHERE schemaname=$1 AND NOT tablename='_prisma_migrations';`,
        ['public'],
      );
      const tables = result.rows.map((r) => r.tablename);
      for (const table of tables) {
        await client.query(`DELETE FROM ${table};`);
      }
    } finally {
      client.release();
    }
  }
}

export { PostgresConnection };
