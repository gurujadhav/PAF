import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../src/core/base.page.js';

export class TodoPage extends BasePage {
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly mainSection: Locator;

  constructor(page: Page) {
    super(page);
    this.newTodoInput = page.locator('.new-todo');
    this.todoItems = page.locator('.todo-list li');
    this.mainSection = page.locator('.main');
  }

  public async navigate(): Promise<void> {
    await this.goto('https://demo.playwright.dev/todomvc');
  }

  public async addTodo(title: string): Promise<void> {
    await this.fill(this.newTodoInput, title);
    await this.newTodoInput.press('Enter');
  }

  public async getTodoCount(): Promise<number> {
    return await this.todoItems.count();
  }

  public async toggleTodo(index: number): Promise<void> {
    const toggleCheckbox = this.todoItems.nth(index).locator('.toggle');
    await this.click(toggleCheckbox);
  }
}
