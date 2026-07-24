import { Logger } from '../utils/logger.js';
import { PAFHelpers } from '../utils/helpers.js';

export type GridProviderName = 'lambdatest' | 'browserstack' | 'saucelabs' | 'local';

export interface CloudGridSessionInfo {
  provider: GridProviderName;
  wsEndpoint?: string;
  dashboardUrl?: string;
}

export class GridRouter {
  /**
   * Resolves active grid provider from process.env.GRID_PROVIDER or process.env.LAMBDATEST
   */
  public static getActiveProvider(): GridProviderName {
    if (process.env.GRID_PROVIDER) {
      return process.env.GRID_PROVIDER.toLowerCase() as GridProviderName;
    }
    if (process.env.LAMBDATEST === 'true') {
      return 'lambdatest';
    }
    if (process.env.BROWSERSTACK === 'true') {
      return 'browserstack';
    }
    return 'local';
  }

  /**
   * Returns websocket endpoint for cloud grid or local CDP connection
   */
  public static getCdpEndpoint(testTitle: string, browserName: string = 'chromium'): CloudGridSessionInfo {
    const provider = this.getActiveProvider();
    Logger.info(`[Grid Router] Routing execution to Grid Provider: "${provider}" for test: "${testTitle}"`);

    switch (provider) {
      case 'lambdatest': {
        const username = process.env.LT_USERNAME || '';
        const accessKey = process.env.LT_ACCESS_KEY || '';
        const caps = encodeURIComponent(
          JSON.stringify({
            browserName: `pw-${browserName}`,
            'LT:Options': {
              platform: 'Windows 11',
              build: process.env.CI_BUILD_NAME || 'PAF Cloud Suite',
              name: testTitle,
              user: username,
              accessKey,
            },
          })
        );
        const wsEndpoint = `wss://${process.env.LT_GRID_URL || 'hub.lambdatest.com/playwright/cdp'}?config=${caps}`;
        return {
          provider: 'lambdatest',
          wsEndpoint,
          dashboardUrl: PAFHelpers.generateCloudGridDeepLink('lambdatest', testTitle),
        };
      }
      case 'browserstack': {
        const username = process.env.BS_USERNAME || '';
        const accessKey = process.env.BS_ACCESS_KEY || '';
        const caps = encodeURIComponent(
          JSON.stringify({
            browser: browserName,
            os: 'Windows',
            os_version: '11',
            name: testTitle,
            'browserstack.username': username,
            'browserstack.accessKey': accessKey,
          })
        );
        const wsEndpoint = `wss://cdp.browserstack.com/playwright?caps=${caps}`;
        return {
          provider: 'browserstack',
          wsEndpoint,
          dashboardUrl: PAFHelpers.generateCloudGridDeepLink('browserstack', testTitle),
        };
      }
      default:
        return {
          provider: 'local',
        };
    }
  }
}
