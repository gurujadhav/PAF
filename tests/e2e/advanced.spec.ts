import { test, expect } from '../../src/core/fixtures.js';
import { EmailReporterRegistry, ICustomEmailReporter } from '../../src/mailer/custom.reporter.interface.js';
import { SummaryReportStats } from '../../src/mailer/templates/report.html.js';
import { PAFHelpers } from '../../src/utils/helpers.js';
import { HardAssertions } from '../../src/utils/assertion.helper.js';

class CustomTeamSlackReporter implements ICustomEmailReporter {
  name = 'CustomTeamSlackReporter';

  async sendReport(stats: SummaryReportStats): Promise<boolean> {
    console.log(`[Custom Email Reporter] Handled custom report for ${stats.total} tests (${stats.passed} passed).`);
    return true;
  }
}

test.describe('PAF Advanced Capabilities Suite', () => {

  test.beforeAll(() => {
    EmailReporterRegistry.registerCustomReporter(new CustomTeamSlackReporter());
  });

  test('should seed user data via API and mock network traffic', async ({ page, apiSeeder, networkMocker, pafLogger }) => {
    pafLogger.info('Seeding API data before launching UI...');
    const user = await apiSeeder.seedUser({ name: 'Antigravity AI Tester' });
    expect(user.email).toContain('qa-user-');

    pafLogger.info('Setting up network interception...');
    await networkMocker.mockJsonEndpoint('**/api/v1/user/profile', {
      id: user.id,
      name: user.name,
      status: 'active_premium',
    });

    await networkMocker.blockTrackerScripts();

    const randomName = PAFHelpers.randomString(10);
    expect(randomName).toHaveLength(10);
  });

  test('should demonstrate soft assertions, hard assertions, and JS executor', async ({ page, softAssert, pafLogger }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // JS Executor test
    const pageTitle = await page.evaluate(() => document.title);
    pafLogger.info(`JS Executor evaluated page title: "${pageTitle}"`);

    // Hard Assert
    HardAssertions.assertContains(pageTitle, 'TodoMVC');

    // Soft Assertions (non-fatal, collected and checked at test end)
    softAssert.assertEquals(1 + 1, 2, 'Math check should pass');
    softAssert.assertTrue(pageTitle.length > 0, 'Title length check');
  });

});
