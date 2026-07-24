/**
 * PAF - Playwright Automation Framework
 * Main Export Entry Point
 */

// Core exports
export { BasePage } from './core/base.page.js';
export { BaseComponent } from './core/base.component.js';
export { test, expect } from './core/fixtures.js';
export type { PAFTestFixtures } from './core/fixtures.js';

// Configuration exports
export { createPAFConfig } from './config/paf.config.js';
export { getEnvConfig } from './config/env.config.js';
export type { PAFEnvConfig } from './config/env.config.js';

// Assertions, Visual Validation & Accessibility Testing
export { SoftAssertions, HardAssertions } from './utils/assertion.helper.js';
export type { SoftAssertionError } from './utils/assertion.helper.js';
export { VisualValidator } from './utils/visual.validator.js';
export type { VisualMatchOptions } from './utils/visual.validator.js';
export { AccessibilityValidator } from './utils/accessibility.validator.js';
export type { AccessibilityAuditOptions, AccessibilityViolationSummary } from './utils/accessibility.validator.js';

// Mailer & Custom Reporter exports
export { EmailService } from './mailer/email.service.js';
export { EmailReporterRegistry } from './mailer/custom.reporter.interface.js';
export type { ICustomEmailReporter } from './mailer/custom.reporter.interface.js';
export { generateEmailHtmlReport } from './mailer/templates/report.html.js';
export type { SummaryReportStats, TestCaseReportResult } from './mailer/templates/report.html.js';
export { PAFReporter } from './reporters/paf.reporter.js';

// Data & Seeding exports
export { ApiSeeder } from './data/api.seeder.js';
export type { SeedUser } from './data/api.seeder.js';
export { DBSeeder } from './data/db.seeder.js';
export type { DBConfig } from './data/db.seeder.js';

// Antigravity AI IDE & MCP Integration exports
export { PAFMcpAgent } from './mcp/paf.mcp.js';
export type { AgentArtifactPayload } from './mcp/paf.mcp.js';

// Recorders & Artifacts
export { ArtifactManager } from './recorders/artifact.manager.js';
export type { ArtifactDetails } from './recorders/artifact.manager.js';

// Providers & Grid Routing
export { LambdaTestProvider } from './providers/lambdatest.provider.js';
export type { LambdaTestCapabilities } from './providers/lambdatest.provider.js';
export { ServerProvider } from './providers/server.provider.js';
export type { ServerEnvironmentInfo } from './providers/server.provider.js';
export { GridRouter } from './providers/grid.router.js';
export type { GridProviderName, CloudGridSessionInfo } from './providers/grid.router.js';

// Utilities
export { Logger, LogLevel } from './utils/logger.js';
export { PAFHelpers } from './utils/helpers.js';
export { NetworkMocker } from './utils/network.mock.js';
export type { RouteMockOptions } from './utils/network.mock.js';
