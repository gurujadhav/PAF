import { Page, Locator, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';
import { Logger } from './logger.js';

export interface AccessibilityAuditOptions {
  tags?: string[];
  includeSelectors?: string[];
  excludeSelectors?: string[];
  disabledRules?: string[];
}

export interface AccessibilityViolationSummary {
  id: string;
  impact?: 'minor' | 'moderate' | 'serious' | 'critical' | null;
  description: string;
  help: string;
  helpUrl: string;
  nodesCount: number;
}

export class AccessibilityValidator {
  private static reportDir = path.resolve(process.cwd(), 'test-results/accessibility');

  constructor(private page: Page) {}

  /**
   * Performs an accessibility audit using Axe-Core
   */
  public async audit(options: AccessibilityAuditOptions = {}) {
    const {
      tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
      includeSelectors = [],
      excludeSelectors = [],
      disabledRules = [],
    } = options;

    let builder = new AxeBuilder({ page: this.page }).withTags(tags);

    if (includeSelectors.length > 0) {
      for (const selector of includeSelectors) {
        builder = builder.include(selector);
      }
    }

    if (excludeSelectors.length > 0) {
      for (const selector of excludeSelectors) {
        builder = builder.exclude(selector);
      }
    }

    if (disabledRules.length > 0) {
      builder = builder.disableRules(disabledRules);
    }

    const results = await builder.analyze();
    return results;
  }

  /**
   * Asserts that page or component has zero WCAG accessibility violations
   */
  public async assertNoViolations(pageName: string, options: AccessibilityAuditOptions = {}): Promise<void> {
    Logger.info(`♿ Running WCAG Accessibility Audit on page: "${pageName}"...`);

    const results = await this.audit(options);
    const violations = results.violations;

    if (violations.length > 0) {
      const summaryList: AccessibilityViolationSummary[] = violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodesCount: v.nodes.length,
      }));

      this.saveAccessibilityReport(pageName, results);

      Logger.error(
        `♿ Found ${violations.length} Accessibility Violation(s) on "${pageName}":\n` +
          summaryList.map((s) => `   - [${s.impact?.toUpperCase()}] ${s.id}: ${s.help} (${s.nodesCount} nodes affected) -> ${s.helpUrl}`).join('\n')
      );

      expect(violations, `Page "${pageName}" has ${violations.length} accessibility violation(s)`).toEqual([]);
    } else {
      Logger.success(`♿ Accessibility Audit PASSED for "${pageName}" - 0 violations detected!`);
    }
  }

  /**
   * Saves accessibility report JSON to test-results/accessibility
   */
  private saveAccessibilityReport(pageName: string, results: any): void {
    if (!fs.existsSync(AccessibilityValidator.reportDir)) {
      fs.mkdirSync(AccessibilityValidator.reportDir, { recursive: true });
    }

    const fileName = `a11y-report-${pageName.replace(/[^a-z0-9]/gi, '_')}-${Date.now()}.json`;
    const filePath = path.join(AccessibilityValidator.reportDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf-8');
    Logger.info(`Saved accessibility audit report: ${filePath}`);
  }
}
