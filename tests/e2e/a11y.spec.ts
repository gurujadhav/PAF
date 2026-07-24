import { test, expect } from '../../src/core/fixtures.js';

test.describe('PAF Accessibility (a11y) Audit Suite', () => {

  test('should perform WCAG accessibility audit on TodoMVC main section', async ({ page, a11yValidator, pafLogger }) => {
    pafLogger.info('Navigating to TodoMVC page for accessibility scan...');
    await page.goto('https://demo.playwright.dev/todomvc');

    // Run audit targeting main section with rule exclusions for demo app
    await a11yValidator.assertNoViolations('TodoMVC Main App', {
      tags: ['wcag2a', 'wcag2aa'],
      disabledRules: ['color-contrast'],
    });
  });

});
