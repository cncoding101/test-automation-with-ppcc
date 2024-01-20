import { IConnection } from './interfaces';
import { logger } from '@utils/helpers/logger';
import { MongoClient, MongoClientOptions, Collection, Document, ObjectId } from 'mongodb';

const defaultOptions: MongoClientOptions = {
  maxPoolSize: 10,
  tls: false,
  serverSelectionTimeoutMS: 5000,
};

class MongoConnection implements IConnection<MongoClient> {
  private dump: Record<string, Document[]> | null = null;
  private connection: MongoClient | null = null;

  constructor(
    private database: string,
    private hostname = 'localhost',
    private port = 27017,
    private username?: string,
    private password?: string,
  ) {}

  public async connect(): Promise<MongoClient> {
    if (this.connection) return this.connection;

    if (!this.database) throw new Error('Please provide a database to connect');

    let mongoOptions: MongoClientOptions = defaultOptions;
    if (this.username && this.password)
      mongoOptions = {
        ...mongoOptions,
        authSource: this.database,
        auth: {
          username: this.username,
          password: this.password,
        },
      };
    const url = `mongodb://${this.hostname}:${this.port}/${this.database}`;
    const mongoClient = new MongoClient(url, mongoOptions);
    await mongoClient.connect();
    logger.log('MongoDB client connected');
    this.connection = mongoClient;

    return mongoClient;
  }

  public async close() {
    if (this.connection) {
      await this.connection.close();
      logger.log('MongoDB client disconnected');
      this.connection = null;
    }
  }

  public async createMany(table: string, data: Record<string, any>[]) {
    if (data.length === 0) return;
    if (!this.connection) throw new Error('MongoDB client is not connected');

    try {
      const database = this.connection.db();
      const collections = await database.listCollections({ name: table }).toArray();
      if (collections.length === 0) await database.createCollection(table);

      const collection: Collection = database.collection(table);

      const traverse = <T>(doc: any): T => {
        if (Array.isArray(doc)) {
          doc.forEach((item, i) => {
            doc[i] = traverse(item);
          });
        } else if (doc instanceof Object) {
          const entries: any = Object.entries(doc);
          for (const [key, value] of entries) {
            switch (key) {
              case '$oid':
                return new ObjectId(value) as unknown as T;

              case '$date': {
                const { $numberLong } = value;
                if (!$numberLong || isNaN($numberLong)) break;
                const numeric = parseInt($numberLong, 10);
                return new Date(numeric) as unknown as T;
              }
            }

            if (value?.$oid) {
              doc[key] = new ObjectId(value.$oid);
            } else {
              doc[key] = traverse(value);
            }
          }
        }
        return doc;
      };
      data = traverse(data);

      logger.log('Inserting migration data into MongoDB client');
      await collection.insertMany(data);
    } catch (ex) {
      throw new Error(ex);
    }
  }

  public async removeAll() {
    if (!this.connection) throw new Error('MongoDB client is not connected');

    const db = this.connection.db();
    const collections = await db.listCollections().toArray();
    logger.log('Removing all data from the MongoDB client');
    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
    }
  }

  public async dumpDB() {
    if (!this.connection) throw new Error('MongoDB client is not connected');

    const db = this.connection.db();
    const collections = await db.listCollections().toArray();
    logger.log('Taking a dump from the MongoDB client');
    const allCollections: Record<string, Document[]> = {};
    for (const collection of collections) {
      const docs = await db.collection(collection.name).find().toArray();
      allCollections[collection.name] = docs;
    }
    this.dump = allCollections;
  }

  public async reset() {
    if (!this.dump || Object.entries(this.dump).length === 0)
      throw new Error('No dump available to reset the database');

    logger.log('Removing all data from MongoDB');
    await this.removeAll();
    logger.log('Reset all the data from the dump file');
    for (const [collection, data] of Object.entries(this.dump)) {
      await this.createMany(collection, data);
    }
  }
}

export { MongoConnection };
