import { FullConfig } from '@playwright/test';
import { Logger } from '../utils/logger.js';

async function globalTeardown(config: FullConfig) {
  Logger.info('🌐 [PAF Global Teardown] Cleaning Up Test Resources & Closing Connections...');
  // Add database cleanup or server stop hooks here
}

export default globalTeardown;
