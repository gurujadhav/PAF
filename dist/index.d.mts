import * as _playwright_test from '@playwright/test';
import { Page, Locator, Request, APIRequestContext, PlaywrightTestConfig, Browser } from '@playwright/test';
import { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

declare abstract class BasePage {
    protected page: Page;
    constructor(page: Page);
    /**
     * Navigate to relative or absolute path
     */
    goto(urlPath?: string): Promise<void>;
    /**
     * Wait for element to be visible
     */
    waitForVisible(selectorOrLocator: string | Locator): Promise<void>;
    /**
     * Click an element identified by selector or locator
     */
    click(selectorOrLocator: string | Locator): Promise<void>;
    /**
     * Fill an input element with text
     */
    fill(selectorOrLocator: string | Locator, value: string): Promise<void>;
    /**
     * Get visible text of an element
     */
    getText(selectorOrLocator: string | Locator): Promise<string>;
    /**
     * JavaScript Executor: Executes custom JavaScript in page context
     */
    executeJs<T = any>(script: string | ((arg: any) => any), arg?: any): Promise<T>;
    /**
     * JavaScript Executor: Scroll element into view using JS
     */
    scrollIntoView(selectorOrLocator: string | Locator): Promise<void>;
    /**
     * JavaScript Executor: Scroll to bottom of page
     */
    scrollToBottom(): Promise<void>;
    /**
     * JavaScript Executor: Highlights an element visually on screen (useful for videos & debugging)
     */
    highlightElement(selectorOrLocator: string | Locator): Promise<void>;
    /**
     * Capture a full page screenshot and save to test artifacts
     */
    takeScreenshot(name: string): Promise<string>;
    /**
     * Wait for network idle state
     */
    waitForNetworkIdle(): Promise<void>;
}

declare abstract class BaseComponent {
    protected page: Page;
    protected rootLocator: Locator;
    constructor(page: Page, rootLocator: Locator);
    isVisible(): Promise<boolean>;
    getRoot(): Locator;
}

interface PAFEnvConfig {
    baseUrl: string;
    envName: string;
    headless: boolean;
    viewport: {
        width: number;
        height: number;
    };
    retries: number;
    recordVideo: 'on' | 'off' | 'retain-on-failure' | 'retry-with-video';
    recordTrace: 'on' | 'off' | 'retain-on-failure' | 'retry-with-trace';
    smtpHost?: string;
    smtpPort?: number;
    smtpSecure?: boolean;
    smtpUser?: string;
    smtpPass?: string;
    mailFrom?: string;
    mailTo?: string;
    sendMailOnFinish: boolean;
    isLambdaTest: boolean;
    ltUsername?: string;
    ltAccessKey?: string;
    ltGridUrl?: string;
}
declare const getEnvConfig: () => PAFEnvConfig;

/**
 * PAF Framework Logger Utility
 */
declare enum LogLevel {
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS",
    DEBUG = "DEBUG"
}
declare class Logger {
    private static formatTime;
    private static log;
    static info(message: string, ...args: any[]): void;
    static success(message: string, ...args: any[]): void;
    static warn(message: string, ...args: any[]): void;
    static error(message: string, ...args: any[]): void;
    static debug(message: string, ...args: any[]): void;
}

interface RouteMockOptions {
    status?: number;
    contentType?: string;
    body?: any;
    headers?: Record<string, string>;
    delayMs?: number;
}
declare class NetworkMocker {
    private page;
    constructor(page: Page);
    /**
     * Mocks an HTTP endpoint to return a mock JSON response
     */
    mockJsonEndpoint(urlPattern: string | RegExp, jsonBody: any, status?: number): Promise<void>;
    /**
     * Mocks an endpoint with advanced options like custom headers and simulated delay
     */
    mockEndpointWithOptions(urlPattern: string | RegExp, options: RouteMockOptions): Promise<void>;
    /**
     * Blocks specified requests (e.g. Google Analytics, Facebook Pixel, tracking scripts)
     */
    blockTrackerScripts(): Promise<void>;
    /**
     * Captures and logs all network requests matching a URL pattern
     */
    captureRequests(urlPattern: string | RegExp, callback?: (req: Request) => void): void;
}

interface SeedUser {
    id: string;
    name: string;
    email: string;
    token?: string;
}
declare class ApiSeeder {
    private request;
    constructor(request: APIRequestContext);
    /**
     * Provisions a fresh test user via API endpoint
     */
    seedUser(userPayload?: Partial<SeedUser>): Promise<SeedUser>;
    /**
     * Deletes seeded test data after test suite execution
     */
    cleanupSeededData(entityId: string): Promise<boolean>;
}

interface DBConfig {
    connectionString?: string;
    type: 'postgres' | 'mongodb' | 'sqlite' | 'mock';
}
declare class DBSeeder {
    private config;
    constructor(config?: DBConfig);
    /**
     * Connects to database and executes setup SQL or script
     */
    seedDatabase(queryOrPayload: string | Record<string, any>): Promise<void>;
    /**
     * Clears staging DB tables before test run
     */
    truncateTables(tables: string[]): Promise<void>;
}

type GridProviderName = 'lambdatest' | 'browserstack' | 'saucelabs' | 'local';
interface CloudGridSessionInfo {
    provider: GridProviderName;
    wsEndpoint?: string;
    dashboardUrl?: string;
}
declare class GridRouter {
    /**
     * Resolves active grid provider from process.env.GRID_PROVIDER or process.env.LAMBDATEST
     */
    static getActiveProvider(): GridProviderName;
    /**
     * Returns websocket endpoint for cloud grid or local CDP connection
     */
    static getCdpEndpoint(testTitle: string, browserName?: string): CloudGridSessionInfo;
}

interface SoftAssertionError {
    message: string;
    actual?: any;
    expected?: any;
}
declare class SoftAssertions {
    private errors;
    /**
     * Performs a soft equality check. Does not throw immediately if condition fails.
     */
    assertEquals(actual: any, expected: any, message?: string): void;
    /**
     * Performs a soft truthy check.
     */
    assertTrue(condition: boolean, message?: string): void;
    /**
     * Asserts all collected soft assertion errors at the end of the test.
     */
    assertAll(): void;
}
declare class HardAssertions {
    static assertEquals(actual: any, expected: any, message?: string): void;
    static assertTrue(condition: boolean, message?: string): void;
    static assertContains(actualStringOrArray: string | any[], expectedSubstringOrItem: any, message?: string): void;
}

interface VisualMatchOptions {
    threshold?: number;
    maxDiffPixels?: number;
    maskElements?: (string | Locator)[];
}
declare class VisualValidator {
    private page;
    constructor(page: Page);
    /**
     * Compares page or element screenshot against visual baseline
     */
    compareScreenshot(snapshotName: string, target?: Locator, options?: VisualMatchOptions): Promise<void>;
}

interface AccessibilityAuditOptions {
    tags?: string[];
    includeSelectors?: string[];
    excludeSelectors?: string[];
    disabledRules?: string[];
}
interface AccessibilityViolationSummary {
    id: string;
    impact?: 'minor' | 'moderate' | 'serious' | 'critical' | null;
    description: string;
    help: string;
    helpUrl: string;
    nodesCount: number;
}
declare class AccessibilityValidator {
    private page;
    private static reportDir;
    constructor(page: Page);
    /**
     * Performs an accessibility audit using Axe-Core
     */
    audit(options?: AccessibilityAuditOptions): Promise<any>;
    /**
     * Asserts that page or component has zero WCAG accessibility violations
     */
    assertNoViolations(pageName: string, options?: AccessibilityAuditOptions): Promise<void>;
    /**
     * Saves accessibility report JSON to test-results/accessibility
     */
    private saveAccessibilityReport;
}

interface PAFTestFixtures {
    envConfig: PAFEnvConfig;
    pafLogger: typeof Logger;
    networkMocker: NetworkMocker;
    apiSeeder: ApiSeeder;
    dbSeeder: DBSeeder;
    gridSession: CloudGridSessionInfo;
    softAssert: SoftAssertions;
    visualValidator: VisualValidator;
    a11yValidator: AccessibilityValidator;
}
declare const test: _playwright_test.TestType<_playwright_test.PlaywrightTestArgs & _playwright_test.PlaywrightTestOptions & PAFTestFixtures, _playwright_test.PlaywrightWorkerArgs & _playwright_test.PlaywrightWorkerOptions>;
declare const expect: _playwright_test.Expect<{}>;

declare const createPAFConfig: (overrides?: Partial<PlaywrightTestConfig>) => PlaywrightTestConfig;

interface TestCaseReportResult {
    title: string;
    status: 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted';
    durationMs: number;
    error?: string;
    videoPath?: string;
    tracePath?: string;
}
interface SummaryReportStats {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    durationMs: number;
    environment: string;
    startTime: string;
    testCases: TestCaseReportResult[];
}
declare const generateEmailHtmlReport: (stats: SummaryReportStats) => string;

declare class EmailService {
    /**
     * Sends execution report email using custom reporter if registered, or standard Nodemailer transporter
     */
    static sendReportEmail(stats: SummaryReportStats): Promise<boolean>;
}

interface ICustomEmailReporter {
    /**
     * Name identifier of custom email reporter
     */
    name: string;
    /**
     * Send function receiving test summary stats and returning boolean success status
     */
    sendReport(stats: SummaryReportStats): Promise<boolean>;
}
declare class EmailReporterRegistry {
    private static customReporter?;
    /**
     * Registers a custom user-defined email reporter
     */
    static registerCustomReporter(reporter: ICustomEmailReporter): void;
    /**
     * Get active custom reporter if registered
     */
    static getCustomReporter(): ICustomEmailReporter | undefined;
    /**
     * Clears custom reporter
     */
    static clear(): void;
}

declare class PAFReporter implements Reporter {
    private startTime;
    private testCases;
    onBegin(config: FullConfig, suite: Suite): void;
    onTestEnd(test: TestCase, result: TestResult): void;
    onEnd(result: FullResult): Promise<void>;
}

interface AgentArtifactPayload {
    testTitle: string;
    status: 'passed' | 'failed' | 'skipped';
    errorDetails?: string;
    suggestedLocatorFix?: string;
    accessibilitySnapshot?: string;
    cdpDebuggerUrl?: string;
}
declare class PAFMcpAgent {
    private static artifactDir;
    /**
     * Captures the live accessibility tree of the active page for AI element inspection
     */
    static getAccessibilityTree(page: Page): Promise<string>;
    /**
     * Returns Chrome DevTools Protocol (CDP) WebSocket URL for AI agent live browser attach/debug
     */
    static getCdpDebuggerUrl(browser: Browser): string | null;
    /**
     * Analyzes Playwright error logs and returns suggested replacement locators
     */
    static suggestFixForLocator(errorMsg?: string): string | undefined;
    /**
     * Emits a structured Agentic AI Markdown artifact to test-results/mcp-artifacts/
     */
    static emitAgentArtifact(payload: AgentArtifactPayload): string;
}

interface ArtifactDetails {
    testTitle: string;
    videoPath?: string;
    tracePath?: string;
    screenshots: string[];
}
declare class ArtifactManager {
    private static resultsDir;
    /**
     * Scans and aggregates test artifacts (videos, trace files, screenshots) for a given test.
     */
    static getArtifactsForTest(testTitleSanitized: string): ArtifactDetails;
    /**
     * Helper to ensure output directory exists
     */
    static ensureDirExists(dirPath: string): void;
}

interface LambdaTestCapabilities {
    browserName: 'pw-chromium' | 'pw-firefox' | 'pw-webkit';
    browserVersion?: string;
    'LT:Options': {
        platform: string;
        build: string;
        name: string;
        user: string;
        accessKey: string;
        network?: boolean;
        video?: boolean;
        console?: boolean;
        tunnel?: boolean;
    };
}
declare class LambdaTestProvider {
    /**
     * Constructs the LambdaTest Playwright CDP Endpoint URL for remote browser execution.
     */
    static getCdpEndpoint(testTitle: string, browserName?: 'chromium' | 'firefox' | 'webkit', buildName?: string): string;
    /**
     * Helper to set test status on LambdaTest session
     */
    static setTestStatus(page: any, status: 'passed' | 'failed', remark?: string): Promise<void>;
}

interface ServerEnvironmentInfo {
    isCI: boolean;
    platform: string;
    nodeVersion: string;
    baseUrl: string;
    headless: boolean;
}
declare class ServerProvider {
    /**
     * Evaluates server execution environment details (Local vs Docker vs GitHub Actions server)
     */
    static getEnvironmentInfo(): ServerEnvironmentInfo;
    /**
     * Helper to determine if we are running in headless server mode
     */
    static isServerMode(): boolean;
}

declare class PAFHelpers {
    /**
     * Generates a random alphanumeric string
     */
    static randomString(length?: number): string;
    /**
     * Generates a random unique email address for testing
     */
    static randomEmail(domain?: string): string;
    /**
     * Sleep / pause execution for given milliseconds
     */
    static sleep(ms: number): Promise<void>;
    /**
     * Retries an async action multiple times before failing
     */
    static retry<T>(fn: () => Promise<T>, maxRetries?: number, delayMs?: number, actionName?: string): Promise<T>;
    /**
     * Generates deep link URLs to Cloud Grid Dashboard or Trace Viewers
     */
    static generateCloudGridDeepLink(provider: 'lambdatest' | 'browserstack' | 'saucelabs' | 'playwright-trace', sessionIdOrTracePath: string): string;
    /**
     * Validates an object against simple key type expectations
     */
    static validateSimpleSchema(data: Record<string, any>, expectedKeys: string[]): boolean;
    /**
     * Sanitizes string for safe file name output
     */
    static sanitizeFileName(name: string): string;
}

export { type AccessibilityAuditOptions, AccessibilityValidator, type AccessibilityViolationSummary, type AgentArtifactPayload, ApiSeeder, type ArtifactDetails, ArtifactManager, BaseComponent, BasePage, type CloudGridSessionInfo, type DBConfig, DBSeeder, EmailReporterRegistry, EmailService, type GridProviderName, GridRouter, HardAssertions, type ICustomEmailReporter, type LambdaTestCapabilities, LambdaTestProvider, LogLevel, Logger, NetworkMocker, type PAFEnvConfig, PAFHelpers, PAFMcpAgent, PAFReporter, type PAFTestFixtures, type RouteMockOptions, type SeedUser, type ServerEnvironmentInfo, ServerProvider, type SoftAssertionError, SoftAssertions, type SummaryReportStats, type TestCaseReportResult, type VisualMatchOptions, VisualValidator, createPAFConfig, expect, generateEmailHtmlReport, getEnvConfig, test };
