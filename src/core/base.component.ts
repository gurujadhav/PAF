import { Page, Locator } from '@playwright/test';

export abstract class BaseComponent {
  constructor(protected page: Page, protected rootLocator: Locator) {}

  public async isVisible(): Promise<boolean> {
    return await this.rootLocator.isVisible();
  }

  public getRoot(): Locator {
    return this.rootLocator;
  }
}
