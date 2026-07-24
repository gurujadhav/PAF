import { expect } from '@playwright/test';
import { Logger } from './logger.js';

export interface SoftAssertionError {
  message: string;
  actual?: any;
  expected?: any;
}

export class SoftAssertions {
  private errors: SoftAssertionError[] = [];

  /**
   * Performs a soft equality check. Does not throw immediately if condition fails.
   */
  public assertEquals(actual: any, expected: any, message: string = 'Soft assertion failed'): void {
    try {
      expect(actual).toEqual(expected);
      Logger.success(`[SoftAssert PASSED] ${message}`);
    } catch (err: any) {
      Logger.warn(`[SoftAssert FAILED] ${message} - Expected: ${expected}, Got: ${actual}`);
      this.errors.push({
        message: `${message} (Expected: ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)})`,
        actual,
        expected,
      });
    }
  }

  /**
   * Performs a soft truthy check.
   */
  public assertTrue(condition: boolean, message: string = 'Soft assertion true failed'): void {
    this.assertEquals(condition, true, message);
  }

  /**
   * Asserts all collected soft assertion errors at the end of the test.
   */
  public assertAll(): void {
    if (this.errors.length > 0) {
      const combinedMsg = this.errors.map((e, idx) => `  ${idx + 1}. ${e.message}`).join('\n');
      Logger.error(`SoftAssertions aggregate failure:\n${combinedMsg}`);
      throw new Error(`SoftAssertions aggregate failure (${this.errors.length} failed):\n${combinedMsg}`);
    }
  }
}

export class HardAssertions {
  public static assertEquals(actual: any, expected: any, message?: string): void {
    expect(actual, message).toEqual(expected);
  }

  public static assertTrue(condition: boolean, message?: string): void {
    expect(condition, message).toBe(true);
  }

  public static assertContains(actualStringOrArray: string | any[], expectedSubstringOrItem: any, message?: string): void {
    expect(actualStringOrArray, message).toContain(expectedSubstringOrItem);
  }
}
