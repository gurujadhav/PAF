import { Logger } from './logger.js';

export class PAFHelpers {
  /**
   * Generates a random alphanumeric string
   */
  public static randomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates a random unique email address for testing
   */
  public static randomEmail(domain: string = 'paf-test.com'): string {
    return `test-${Date.now()}-${this.randomString(5)}@${domain}`;
  }

  /**
   * Sleep / pause execution for given milliseconds
   */
  public static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Retries an async action multiple times before failing
   */
  public static async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000,
    actionName: string = 'Action'
  ): Promise<T> {
    let lastError: any;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        Logger.warn(`[Retry] ${actionName} failed on attempt ${attempt}/${maxRetries}. Retrying in ${delayMs}ms...`);
        if (attempt < maxRetries) {
          await this.sleep(delayMs);
        }
      }
    }
    Logger.error(`[Retry] ${actionName} failed after ${maxRetries} attempts.`);
    throw lastError;
  }

  /**
   * Generates deep link URLs to Cloud Grid Dashboard or Trace Viewers
   */
  public static generateCloudGridDeepLink(
    provider: 'lambdatest' | 'browserstack' | 'saucelabs' | 'playwright-trace',
    sessionIdOrTracePath: string
  ): string {
    switch (provider) {
      case 'lambdatest':
        return `https://automation.lambdatest.com/logs/?sessionID=${sessionIdOrTracePath}`;
      case 'browserstack':
        return `https://automate.browserstack.com/dashboard/v2/sessions/${sessionIdOrTracePath}`;
      case 'saucelabs':
        return `https://app.saucelabs.com/tests/${sessionIdOrTracePath}`;
      case 'playwright-trace':
        return `https://trace.playwright.dev/?trace=${encodeURIComponent(sessionIdOrTracePath)}`;
      default:
        return sessionIdOrTracePath;
    }
  }

  /**
   * Validates an object against simple key type expectations
   */
  public static validateSimpleSchema(data: Record<string, any>, expectedKeys: string[]): boolean {
    if (!data || typeof data !== 'object') return false;
    return expectedKeys.every((key) => key in data);
  }

  /**
   * Sanitizes string for safe file name output
   */
  public static sanitizeFileName(name: string): string {
    return name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  }
}
