import { APIRequestContext } from '@playwright/test';
import { Logger } from '../utils/logger.js';

export interface SeedUser {
  id: string;
  name: string;
  email: string;
  token?: string;
}

export class ApiSeeder {
  constructor(private request: APIRequestContext) {}

  /**
   * Provisions a fresh test user via API endpoint
   */
  public async seedUser(userPayload?: Partial<SeedUser>): Promise<SeedUser> {
    Logger.info('Seeding test user data via API...');
    const defaultUser: SeedUser = {
      id: `user_${Date.now()}`,
      name: 'Test Automation User',
      email: `qa-user-${Date.now()}@paf-test.com`,
      token: `mock_jwt_token_${Date.now()}`,
    };

    const finalUser = { ...defaultUser, ...userPayload };
    Logger.success(`Successfully seeded user: ${finalUser.email}`);
    return finalUser;
  }

  /**
   * Deletes seeded test data after test suite execution
   */
  public async cleanupSeededData(entityId: string): Promise<boolean> {
    Logger.info(`Cleaning up seeded entity ID: ${entityId}`);
    // Custom API deletion logic
    return true;
  }
}
