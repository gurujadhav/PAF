import { Page, Route, Request } from '@playwright/test';
import { Logger } from './logger.js';

export interface RouteMockOptions {
  status?: number;
  contentType?: string;
  body?: any;
  headers?: Record<string, string>;
  delayMs?: number;
}

export class NetworkMocker {
  constructor(private page: Page) {}

  /**
   * Mocks an HTTP endpoint to return a mock JSON response
   */
  public async mockJsonEndpoint(urlPattern: string | RegExp, jsonBody: any, status: number = 200): Promise<void> {
    Logger.info(`Setting up network mock for endpoint pattern: ${urlPattern}`);
    await this.page.route(urlPattern, async (route: Route) => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(jsonBody),
      });
    });
  }

  /**
   * Mocks an endpoint with advanced options like custom headers and simulated delay
   */
  public async mockEndpointWithOptions(urlPattern: string | RegExp, options: RouteMockOptions): Promise<void> {
    const { status = 200, contentType = 'application/json', body = {}, headers = {}, delayMs = 0 } = options;

    await this.page.route(urlPattern, async (route: Route) => {
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
      await route.fulfill({
        status,
        contentType,
        headers,
        body: typeof body === 'string' ? body : JSON.stringify(body),
      });
    });
  }

  /**
   * Blocks specified requests (e.g. Google Analytics, Facebook Pixel, tracking scripts)
   */
  public async blockTrackerScripts(): Promise<void> {
    const trackerPatterns = [
      '**/google-analytics.com/**',
      '**/gtm.js/**',
      '**/facebook.net/**',
      '**/mixpanel.com/**',
      '**/segment.io/**',
    ];

    for (const pattern of trackerPatterns) {
      await this.page.route(pattern, (route: Route) => route.abort());
    }
    Logger.info('Blocked common 3rd party analytics and tracker scripts.');
  }

  /**
   * Captures and logs all network requests matching a URL pattern
   */
  public captureRequests(urlPattern: string | RegExp, callback?: (req: Request) => void): void {
    this.page.on('request', (request: Request) => {
      const url = request.url();
      if (typeof urlPattern === 'string' ? url.includes(urlPattern) : urlPattern.test(url)) {
        Logger.info(`[Network Monitor] Captured Request: ${request.method()} ${url}`);
        if (callback) callback(request);
      }
    });
  }
}
