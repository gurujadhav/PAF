import { Logger } from '../utils/logger.js';
import { getEnvConfig } from '../config/env.config.js';

export interface ServerEnvironmentInfo {
  isCI: boolean;
  platform: string;
  nodeVersion: string;
  baseUrl: string;
  headless: boolean;
}

export class ServerProvider {
  /**
   * Evaluates server execution environment details (Local vs Docker vs GitHub Actions server)
   */
  public static getEnvironmentInfo(): ServerEnvironmentInfo {
    const env = getEnvConfig();
    const isCI = !!process.env.CI || !!process.env.GITHUB_ACTIONS;

    Logger.info(`Running in ${isCI ? 'CI Server / GitHub Actions' : 'Local / On-Prem Server'} Environment`);

    return {
      isCI,
      platform: process.platform,
      nodeVersion: process.version,
      baseUrl: env.baseUrl,
      headless: env.headless,
    };
  }

  /**
   * Helper to determine if we are running in headless server mode
   */
  public static isServerMode(): boolean {
    const env = getEnvConfig();
    return env.headless || !!process.env.CI;
  }
}
