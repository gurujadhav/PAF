import { Page, Locator, expect } from '@playwright/test';
import { Logger } from './logger.js';

export interface VisualMatchOptions {
  threshold?: number;
  maxDiffPixels?: number;
  maskElements?: (string | Locator)[];
}

export class VisualValidator {
  constructor(private page: Page) {}

  /**
   * Compares page or element screenshot against visual baseline
   */
  public async compareScreenshot(snapshotName: string, target?: Locator, options: VisualMatchOptions = {}): Promise<void> {
    const { threshold = 0.2, maxDiffPixels = 50, maskElements = [] } = options;

    Logger.info(`Performing Visual Validation for snapshot: "${snapshotName}"`);

    const maskedLocators: Locator[] = maskElements.map((el) =>
      typeof el === 'string' ? this.page.locator(el) : el
    );

    const compareTarget = target || this.page;

    await expect(compareTarget).toHaveScreenshot(`${snapshotName}.png`, {
      threshold,
      maxDiffPixels,
      mask: maskedLocators,
    });

    Logger.success(`Visual validation passed for snapshot: "${snapshotName}"`);
  }
}
