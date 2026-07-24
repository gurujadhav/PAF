import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger.js';

export abstract class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to relative or absolute path
   */
  public async goto(urlPath: string = ''): Promise<void> {
    Logger.info(`Navigating to path: "${urlPath}"`);
    await this.page.goto(urlPath, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Click an element identified by selector or locator
   */
  public async click(selectorOrLocator: string | Locator): Promise<void> {
    const locator = typeof selectorOrLocator === 'string' ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    Logger.info(`Clicking element: ${locator.toString()}`);
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * Fill an input element with text
   */
  public async fill(selectorOrLocator: string | Locator, value: string): Promise<void> {
    const locator = typeof selectorOrLocator === 'string' ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    Logger.info(`Typing "${value}" into: ${locator.toString()}`);
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  /**
   * Get visible text of an element
   */
  public async getText(selectorOrLocator: string | Locator): Promise<string> {
    const locator = typeof selectorOrLocator === 'string' ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent()) || '';
  }

  /**
   * JavaScript Executor: Executes custom JavaScript in page context
   */
  public async executeJs<T = any>(script: string | ((arg: any) => any), arg?: any): Promise<T> {
    Logger.info('Executing custom JavaScript snippet in browser...');
    return await this.page.evaluate(script as any, arg);
  }

  /**
   * JavaScript Executor: Scroll element into view using JS
   */
  public async scrollIntoView(selectorOrLocator: string | Locator): Promise<void> {
    const locator = typeof selectorOrLocator === 'string' ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    await locator.evaluate((el: HTMLElement) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  }

  /**
   * JavaScript Executor: Scroll to bottom of page
   */
  public async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * JavaScript Executor: Highlights an element visually on screen (useful for videos & debugging)
   */
  public async highlightElement(selectorOrLocator: string | Locator): Promise<void> {
    const locator = typeof selectorOrLocator === 'string' ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    await locator.evaluate((el: HTMLElement) => {
      el.style.border = '3px solid red';
      el.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
    });
  }

  /**
   * Capture a full page screenshot and save to test artifacts
   */
  public async takeScreenshot(name: string): Promise<string> {
    const screenshotPath = `test-results/screenshots/${name}-${Date.now()}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    Logger.info(`Captured screenshot: ${screenshotPath}`);
    return screenshotPath;
  }

  /**
   * Wait for network idle state
   */
  public async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
