import { Logger } from '../utils/logger.js';

export interface DBConfig {
  connectionString?: string;
  type: 'postgres' | 'mongodb' | 'sqlite' | 'mock';
}

export class DBSeeder {
  constructor(private config: DBConfig = { type: 'mock' }) {}

  /**
   * Connects to database and executes setup SQL or script
   */
  public async seedDatabase(queryOrPayload: string | Record<string, any>): Promise<void> {
    Logger.info(`[DB Seeder] Executing seeding query/script for DB type: ${this.config.type}`);
    // Database seeding logic wrapper
  }

  /**
   * Clears staging DB tables before test run
   */
  public async truncateTables(tables: string[]): Promise<void> {
    Logger.info(`[DB Seeder] Truncating DB tables: ${tables.join(', ')}`);
  }
}
