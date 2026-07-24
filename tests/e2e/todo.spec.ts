import { test, expect } from '../../src/core/fixtures.js';
import { TodoPage } from '../pages/todo.page.js';

test.describe('PAF TodoMVC Automation Suite', () => {

  test('should create new todo item and capture video & traces @smoke', async ({ page, pafLogger }) => {
    const todoPage = new TodoPage(page);

    pafLogger.info('Navigating to TodoMVC demo app...');
    await todoPage.navigate();

    pafLogger.info('Adding items to todo list...');
    await todoPage.addTodo('Build Playwright PAF Automation Framework');
    await todoPage.addTodo('Add Nodemailer Email Reporting');
    await todoPage.addTodo('Integrate LambdaTest Cloud Grid');

    const count = await todoPage.getTodoCount();
    expect(count).toBe(3);

    pafLogger.info('Toggling todo status...');
    await todoPage.toggleTodo(0);

    const screenshotPath = await todoPage.takeScreenshot('todo-created');
    expect(screenshotPath).toBeDefined();
  });

  test('should verify todo item completion', async ({ page, pafLogger }) => {
    const todoPage = new TodoPage(page);
    await todoPage.navigate();

    await todoPage.addTodo('Verify GitHub Actions Artifact Uploads');
    expect(await todoPage.getTodoCount()).toBe(1);

    await todoPage.toggleTodo(0);
    const completedItem = page.locator('.todo-list li.completed');
    await expect(completedItem).toBeVisible();
  });

});
