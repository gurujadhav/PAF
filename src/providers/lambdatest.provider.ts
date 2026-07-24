import { Logger } from '../utils/logger.js';
import { getEnvConfig } from '../config/env.config.js';

export interface LambdaTestCapabilities {
  browserName: 'pw-chromium' | 'pw-firefox' | 'pw-webkit';
  browserVersion?: string;
  'LT:Options': {
    platform: string;
    build: string;
    name: string;
    user: string;
    accessKey: string;
    network?: boolean;
    video?: boolean;
    console?: boolean;
    tunnel?: boolean;
  };
}

export class LambdaTestProvider {
  /**
   * Constructs the LambdaTest Playwright CDP Endpoint URL for remote browser execution.
   */
  public static getCdpEndpoint(
    testTitle: string,
    browserName: 'chromium' | 'firefox' | 'webkit' = 'chromium',
    buildName: string = 'PAF Test Suite'
  ): string {
    const env = getEnvConfig();

    if (!env.ltUsername || !env.ltAccessKey) {
      Logger.warn('LambdaTest credentials missing! Set LT_USERNAME and LT_ACCESS_KEY in env.');
    }

    const capabilities: LambdaTestCapabilities = {
      browserName: `pw-${browserName}` as any,
      browserVersion: 'latest',
      'LT:Options': {
        platform: 'Windows 11',
        build: process.env.CI_BUILD_NAME || buildName,
        name: testTitle,
        user: env.ltUsername || '',
        accessKey: env.ltAccessKey || '',
        network: true,
        video: true,
        console: true,
      },
    };

    const capsQuery = encodeURIComponent(JSON.stringify(capabilities));
    const endpoint = `wss://${env.ltGridUrl}?geolocation=US&config=${capsQuery}`;
    Logger.info(`Generated LambdaTest CDP Endpoint for test: "${testTitle}"`);
    return endpoint;
  }

  /**
   * Helper to set test status on LambdaTest session
   */
  public static async setTestStatus(page: any, status: 'passed' | 'failed', remark: string = ''): Promise<void> {
    try {
      await page.evaluate(
        (_: any, arg: { status: string; remark: string }) => {
          // LambdaTest specific executor script for updating session metadata
          (window as any).LambdaTestCaseStatus && (window as any).LambdaTestCaseStatus(arg.status, arg.remark);
        },
        { status, remark }
      );
      Logger.info(`LambdaTest test status set to: ${status}`);
    } catch (e) {
      Logger.debug('LambdaTest status update note: Only applicable on LambdaTest grid execution');
    }
  }
}
