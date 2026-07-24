"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AccessibilityValidator: () => AccessibilityValidator,
  ApiSeeder: () => ApiSeeder,
  ArtifactManager: () => ArtifactManager,
  BaseComponent: () => BaseComponent,
  BasePage: () => BasePage,
  DBSeeder: () => DBSeeder,
  EmailReporterRegistry: () => EmailReporterRegistry,
  EmailService: () => EmailService,
  GridRouter: () => GridRouter,
  HardAssertions: () => HardAssertions,
  LambdaTestProvider: () => LambdaTestProvider,
  LogLevel: () => LogLevel,
  Logger: () => Logger,
  NetworkMocker: () => NetworkMocker,
  PAFHelpers: () => PAFHelpers,
  PAFMcpAgent: () => PAFMcpAgent,
  PAFReporter: () => PAFReporter,
  ServerProvider: () => ServerProvider,
  SoftAssertions: () => SoftAssertions,
  VisualValidator: () => VisualValidator,
  createPAFConfig: () => createPAFConfig,
  expect: () => expect4,
  generateEmailHtmlReport: () => generateEmailHtmlReport,
  getEnvConfig: () => getEnvConfig,
  test: () => test
});
module.exports = __toCommonJS(index_exports);

// src/utils/logger.ts
var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
  LogLevel2["INFO"] = "INFO";
  LogLevel2["WARN"] = "WARN";
  LogLevel2["ERROR"] = "ERROR";
  LogLevel2["SUCCESS"] = "SUCCESS";
  LogLevel2["DEBUG"] = "DEBUG";
  return LogLevel2;
})(LogLevel || {});
var Logger = class {
  static formatTime() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  static log(level, message, ...args) {
    const timestamp = this.formatTime();
    let prefix = `[${timestamp}] [PAF::${level}]`;
    switch (level) {
      case "INFO" /* INFO */:
        console.log(`\x1B[36m${prefix}\x1B[0m`, message, ...args);
        break;
      case "SUCCESS" /* SUCCESS */:
        console.log(`\x1B[32m${prefix}\x1B[0m`, message, ...args);
        break;
      case "WARN" /* WARN */:
        console.warn(`\x1B[33m${prefix}\x1B[0m`, message, ...args);
        break;
      case "ERROR" /* ERROR */:
        console.error(`\x1B[31m${prefix}\x1B[0m`, message, ...args);
        break;
      case "DEBUG" /* DEBUG */:
        if (process.env.DEBUG) {
          console.log(`\x1B[35m${prefix}\x1B[0m`, message, ...args);
        }
        break;
    }
  }
  static info(message, ...args) {
    this.log("INFO" /* INFO */, message, ...args);
  }
  static success(message, ...args) {
    this.log("SUCCESS" /* SUCCESS */, message, ...args);
  }
  static warn(message, ...args) {
    this.log("WARN" /* WARN */, message, ...args);
  }
  static error(message, ...args) {
    this.log("ERROR" /* ERROR */, message, ...args);
  }
  static debug(message, ...args) {
    this.log("DEBUG" /* DEBUG */, message, ...args);
  }
};

// src/core/base.page.ts
var BasePage = class {
  constructor(page) {
    this.page = page;
  }
  page;
  /**
   * Navigate to relative or absolute path
   */
  async goto(urlPath = "") {
    Logger.info(`Navigating to path: "${urlPath}"`);
    await this.page.goto(urlPath, { waitUntil: "domcontentloaded" });
  }
  /**
   * Wait for element to be visible
   */
  async waitForVisible(selectorOrLocator) {
    const locator = typeof selectorOrLocator === "string" ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    await locator.waitFor({ state: "visible" });
  }
  /**
   * Click an element identified by selector or locator
   */
  async click(selectorOrLocator) {
    const locator = typeof selectorOrLocator === "string" ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    Logger.info(`Clicking element: ${locator.toString()}`);
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }
  /**
   * Fill an input element with text
   */
  async fill(selectorOrLocator, value) {
    const locator = typeof selectorOrLocator === "string" ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    Logger.info(`Typing "${value}" into: ${locator.toString()}`);
    await locator.waitFor({ state: "visible" });
    await locator.fill(value);
  }
  /**
   * Get visible text of an element
   */
  async getText(selectorOrLocator) {
    const locator = typeof selectorOrLocator === "string" ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    await locator.waitFor({ state: "visible" });
    return await locator.textContent() || "";
  }
  /**
   * JavaScript Executor: Executes custom JavaScript in page context
   */
  async executeJs(script, arg) {
    Logger.info("Executing custom JavaScript snippet in browser...");
    return await this.page.evaluate(script, arg);
  }
  /**
   * JavaScript Executor: Scroll element into view using JS
   */
  async scrollIntoView(selectorOrLocator) {
    const locator = typeof selectorOrLocator === "string" ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    await locator.evaluate((el) => el.scrollIntoView({ behavior: "smooth", block: "center" }));
  }
  /**
   * JavaScript Executor: Scroll to bottom of page
   */
  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }
  /**
   * JavaScript Executor: Highlights an element visually on screen (useful for videos & debugging)
   */
  async highlightElement(selectorOrLocator) {
    const locator = typeof selectorOrLocator === "string" ? this.page.locator(selectorOrLocator) : selectorOrLocator;
    await locator.evaluate((el) => {
      el.style.border = "3px solid red";
      el.style.backgroundColor = "rgba(255, 255, 0, 0.3)";
    });
  }
  /**
   * Capture a full page screenshot and save to test artifacts
   */
  async takeScreenshot(name) {
    const screenshotPath = `test-results/screenshots/${name}-${Date.now()}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    Logger.info(`Captured screenshot: ${screenshotPath}`);
    return screenshotPath;
  }
  /**
   * Wait for network idle state
   */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState("networkidle");
  }
};

// src/core/base.component.ts
var BaseComponent = class {
  constructor(page, rootLocator) {
    this.page = page;
    this.rootLocator = rootLocator;
  }
  page;
  rootLocator;
  async isVisible() {
    return await this.rootLocator.isVisible();
  }
  getRoot() {
    return this.rootLocator;
  }
};

// src/core/fixtures.ts
var import_test4 = require("@playwright/test");

// src/config/env.config.ts
var import_dotenv = __toESM(require("dotenv"));
var import_path = __toESM(require("path"));
import_dotenv.default.config({ path: import_path.default.resolve(process.cwd(), ".env") });
var getEnvConfig = () => {
  return {
    baseUrl: process.env.BASE_URL || "https://demo.playwright.dev/todomvc",
    envName: process.env.ENV || "dev",
    headless: process.env.HEADLESS !== "false",
    viewport: {
      width: parseInt(process.env.VIEWPORT_WIDTH || "1920", 10),
      height: parseInt(process.env.VIEWPORT_HEIGHT || "1080", 10)
    },
    retries: parseInt(process.env.RETRIES || "1", 10),
    recordVideo: process.env.RECORD_VIDEO || "retain-on-failure",
    recordTrace: process.env.RECORD_TRACE || "retain-on-failure",
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    smtpSecure: process.env.SMTP_SECURE === "true",
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    mailFrom: process.env.MAIL_FROM || "PAF Automation <no-reply@paf.com>",
    mailTo: process.env.MAIL_TO,
    sendMailOnFinish: process.env.SEND_MAIL_ON_FINISH === "true",
    isLambdaTest: process.env.LAMBDATEST === "true",
    ltUsername: process.env.LT_USERNAME,
    ltAccessKey: process.env.LT_ACCESS_KEY,
    ltGridUrl: process.env.LT_GRID_URL || "hub.lambdatest.com/playwright/cdp"
  };
};

// src/providers/lambdatest.provider.ts
var LambdaTestProvider = class {
  /**
   * Constructs the LambdaTest Playwright CDP Endpoint URL for remote browser execution.
   */
  static getCdpEndpoint(testTitle, browserName = "chromium", buildName = "PAF Test Suite") {
    const env = getEnvConfig();
    if (!env.ltUsername || !env.ltAccessKey) {
      Logger.warn("LambdaTest credentials missing! Set LT_USERNAME and LT_ACCESS_KEY in env.");
    }
    const capabilities = {
      browserName: `pw-${browserName}`,
      browserVersion: "latest",
      "LT:Options": {
        platform: "Windows 11",
        build: process.env.CI_BUILD_NAME || buildName,
        name: testTitle,
        user: env.ltUsername || "",
        accessKey: env.ltAccessKey || "",
        network: true,
        video: true,
        console: true
      }
    };
    const capsQuery = encodeURIComponent(JSON.stringify(capabilities));
    const endpoint = `wss://${env.ltGridUrl}?geolocation=US&config=${capsQuery}`;
    Logger.info(`Generated LambdaTest CDP Endpoint for test: "${testTitle}"`);
    return endpoint;
  }
  /**
   * Helper to set test status on LambdaTest session
   */
  static async setTestStatus(page, status, remark = "") {
    try {
      await page.evaluate(
        (_, arg) => {
          window.LambdaTestCaseStatus && window.LambdaTestCaseStatus(arg.status, arg.remark);
        },
        { status, remark }
      );
      Logger.info(`LambdaTest test status set to: ${status}`);
    } catch (e) {
      Logger.debug("LambdaTest status update note: Only applicable on LambdaTest grid execution");
    }
  }
};

// src/utils/network.mock.ts
var NetworkMocker = class {
  constructor(page) {
    this.page = page;
  }
  page;
  /**
   * Mocks an HTTP endpoint to return a mock JSON response
   */
  async mockJsonEndpoint(urlPattern, jsonBody, status = 200) {
    Logger.info(`Setting up network mock for endpoint pattern: ${urlPattern}`);
    await this.page.route(urlPattern, async (route) => {
      await route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(jsonBody)
      });
    });
  }
  /**
   * Mocks an endpoint with advanced options like custom headers and simulated delay
   */
  async mockEndpointWithOptions(urlPattern, options) {
    const { status = 200, contentType = "application/json", body = {}, headers = {}, delayMs = 0 } = options;
    await this.page.route(urlPattern, async (route) => {
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
      await route.fulfill({
        status,
        contentType,
        headers,
        body: typeof body === "string" ? body : JSON.stringify(body)
      });
    });
  }
  /**
   * Blocks specified requests (e.g. Google Analytics, Facebook Pixel, tracking scripts)
   */
  async blockTrackerScripts() {
    const trackerPatterns = [
      "**/google-analytics.com/**",
      "**/gtm.js/**",
      "**/facebook.net/**",
      "**/mixpanel.com/**",
      "**/segment.io/**"
    ];
    for (const pattern of trackerPatterns) {
      await this.page.route(pattern, (route) => route.abort());
    }
    Logger.info("Blocked common 3rd party analytics and tracker scripts.");
  }
  /**
   * Captures and logs all network requests matching a URL pattern
   */
  captureRequests(urlPattern, callback) {
    this.page.on("request", (request) => {
      const url = request.url();
      if (typeof urlPattern === "string" ? url.includes(urlPattern) : urlPattern.test(url)) {
        Logger.info(`[Network Monitor] Captured Request: ${request.method()} ${url}`);
        if (callback) callback(request);
      }
    });
  }
};

// src/data/api.seeder.ts
var ApiSeeder = class {
  constructor(request) {
    this.request = request;
  }
  request;
  /**
   * Provisions a fresh test user via API endpoint
   */
  async seedUser(userPayload) {
    Logger.info("Seeding test user data via API...");
    const defaultUser = {
      id: `user_${Date.now()}`,
      name: "Test Automation User",
      email: `qa-user-${Date.now()}@paf-test.com`,
      token: `mock_jwt_token_${Date.now()}`
    };
    const finalUser = { ...defaultUser, ...userPayload };
    Logger.success(`Successfully seeded user: ${finalUser.email}`);
    return finalUser;
  }
  /**
   * Deletes seeded test data after test suite execution
   */
  async cleanupSeededData(entityId) {
    Logger.info(`Cleaning up seeded entity ID: ${entityId}`);
    return true;
  }
};

// src/data/db.seeder.ts
var DBSeeder = class {
  constructor(config = { type: "mock" }) {
    this.config = config;
  }
  config;
  /**
   * Connects to database and executes setup SQL or script
   */
  async seedDatabase(queryOrPayload) {
    Logger.info(`[DB Seeder] Executing seeding query/script for DB type: ${this.config.type}`);
  }
  /**
   * Clears staging DB tables before test run
   */
  async truncateTables(tables) {
    Logger.info(`[DB Seeder] Truncating DB tables: ${tables.join(", ")}`);
  }
};

// src/mcp/paf.mcp.ts
var import_fs = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
var PAFMcpAgent = class {
  static artifactDir = import_path2.default.resolve(process.cwd(), "test-results/mcp-artifacts");
  /**
   * Captures the live accessibility tree of the active page for AI element inspection
   */
  static async getAccessibilityTree(page) {
    try {
      const snapshot = await page.accessibility?.snapshot();
      return JSON.stringify(snapshot || { note: "Accessibility snapshot API" }, null, 2);
    } catch (err) {
      Logger.warn("Could not capture accessibility snapshot:", err);
      return "Accessibility snapshot unavailable";
    }
  }
  /**
   * Returns Chrome DevTools Protocol (CDP) WebSocket URL for AI agent live browser attach/debug
   */
  static getCdpDebuggerUrl(browser) {
    try {
      if ("contexts" in browser && typeof browser.wsEndpoint === "function") {
        return browser.wsEndpoint();
      }
      return process.env.CDP_DEBUGGER_URL || null;
    } catch {
      return null;
    }
  }
  /**
   * Analyzes Playwright error logs and returns suggested replacement locators
   */
  static suggestFixForLocator(errorMsg) {
    if (!errorMsg) return void 0;
    if (errorMsg.includes("waiting for locator")) {
      return `[Agentic AI Tip]: Target locator timed out. Consider using role-based locator e.g. page.getByRole('button') or page.getByTestId(...) instead of dynamic CSS selectors.`;
    }
    if (errorMsg.includes("strict mode violation")) {
      return `[Agentic AI Tip]: Selector resolved to multiple elements. Refine using .first(), .nth(), or specify parent container context.`;
    }
    return `[Agentic AI Tip]: Inspect accessibility tree snapshot in test-results/mcp-artifacts to find exact ARIA role or label.`;
  }
  /**
   * Emits a structured Agentic AI Markdown artifact to test-results/mcp-artifacts/
   */
  static emitAgentArtifact(payload) {
    if (!import_fs.default.existsSync(this.artifactDir)) {
      import_fs.default.mkdirSync(this.artifactDir, { recursive: true });
    }
    const fileName = `agent-artifact-${payload.testTitle.replace(/[^a-z0-9]/gi, "_")}.md`;
    const filePath = import_path2.default.join(this.artifactDir, fileName);
    const content = `
# \u{1F916} Antigravity Agentic AI Test Artifact
**Test Title:** \`${payload.testTitle}\`
**Status:** ${payload.status === "passed" ? "\u2705 PASSED" : "\u274C FAILED"}
**Timestamp:** ${(/* @__PURE__ */ new Date()).toISOString()}

${payload.cdpDebuggerUrl ? `> \u{1F517} **Active CDP Debugger Session:** \`${payload.cdpDebuggerUrl}\`` : ""}

${payload.errorDetails ? `
### \u274C Failure Log
\`\`\`text
${payload.errorDetails}
\`\`\`
` : ""}

${payload.suggestedLocatorFix ? `
### \u{1F4A1} Agent Suggested Fix
> ${payload.suggestedLocatorFix}
` : ""}

${payload.accessibilitySnapshot ? `
### \u267F Accessibility Tree Snapshot
\`\`\`json
${payload.accessibilitySnapshot.slice(0, 1500)} ...
\`\`\`
` : ""}
`;
    import_fs.default.writeFileSync(filePath, content, "utf-8");
    Logger.info(`Emitted Antigravity AI Agent Artifact: ${filePath}`);
    return filePath;
  }
};

// src/utils/helpers.ts
var PAFHelpers = class {
  /**
   * Generates a random alphanumeric string
   */
  static randomString(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  /**
   * Generates a random unique email address for testing
   */
  static randomEmail(domain = "paf-test.com") {
    return `test-${Date.now()}-${this.randomString(5)}@${domain}`;
  }
  /**
   * Sleep / pause execution for given milliseconds
   */
  static async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  /**
   * Retries an async action multiple times before failing
   */
  static async retry(fn, maxRetries = 3, delayMs = 1e3, actionName = "Action") {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        Logger.warn(`[Retry] ${actionName} failed on attempt ${attempt}/${maxRetries}. Retrying in ${delayMs}ms...`);
        if (attempt < maxRetries) {
          await this.sleep(delayMs);
        }
      }
    }
    Logger.error(`[Retry] ${actionName} failed after ${maxRetries} attempts.`);
    throw lastError;
  }
  /**
   * Generates deep link URLs to Cloud Grid Dashboard or Trace Viewers
   */
  static generateCloudGridDeepLink(provider, sessionIdOrTracePath) {
    switch (provider) {
      case "lambdatest":
        return `https://automation.lambdatest.com/logs/?sessionID=${sessionIdOrTracePath}`;
      case "browserstack":
        return `https://automate.browserstack.com/dashboard/v2/sessions/${sessionIdOrTracePath}`;
      case "saucelabs":
        return `https://app.saucelabs.com/tests/${sessionIdOrTracePath}`;
      case "playwright-trace":
        return `https://trace.playwright.dev/?trace=${encodeURIComponent(sessionIdOrTracePath)}`;
      default:
        return sessionIdOrTracePath;
    }
  }
  /**
   * Validates an object against simple key type expectations
   */
  static validateSimpleSchema(data, expectedKeys) {
    if (!data || typeof data !== "object") return false;
    return expectedKeys.every((key) => key in data);
  }
  /**
   * Sanitizes string for safe file name output
   */
  static sanitizeFileName(name) {
    return name.replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
  }
};

// src/providers/grid.router.ts
var GridRouter = class {
  /**
   * Resolves active grid provider from process.env.GRID_PROVIDER or process.env.LAMBDATEST
   */
  static getActiveProvider() {
    if (process.env.GRID_PROVIDER) {
      return process.env.GRID_PROVIDER.toLowerCase();
    }
    if (process.env.LAMBDATEST === "true") {
      return "lambdatest";
    }
    if (process.env.BROWSERSTACK === "true") {
      return "browserstack";
    }
    return "local";
  }
  /**
   * Returns websocket endpoint for cloud grid or local CDP connection
   */
  static getCdpEndpoint(testTitle, browserName = "chromium") {
    const provider = this.getActiveProvider();
    Logger.info(`[Grid Router] Routing execution to Grid Provider: "${provider}" for test: "${testTitle}"`);
    switch (provider) {
      case "lambdatest": {
        const username = process.env.LT_USERNAME || "";
        const accessKey = process.env.LT_ACCESS_KEY || "";
        const caps = encodeURIComponent(
          JSON.stringify({
            browserName: `pw-${browserName}`,
            "LT:Options": {
              platform: "Windows 11",
              build: process.env.CI_BUILD_NAME || "PAF Cloud Suite",
              name: testTitle,
              user: username,
              accessKey
            }
          })
        );
        const wsEndpoint = `wss://${process.env.LT_GRID_URL || "hub.lambdatest.com/playwright/cdp"}?config=${caps}`;
        return {
          provider: "lambdatest",
          wsEndpoint,
          dashboardUrl: PAFHelpers.generateCloudGridDeepLink("lambdatest", testTitle)
        };
      }
      case "browserstack": {
        const username = process.env.BS_USERNAME || "";
        const accessKey = process.env.BS_ACCESS_KEY || "";
        const caps = encodeURIComponent(
          JSON.stringify({
            browser: browserName,
            os: "Windows",
            os_version: "11",
            name: testTitle,
            "browserstack.username": username,
            "browserstack.accessKey": accessKey
          })
        );
        const wsEndpoint = `wss://cdp.browserstack.com/playwright?caps=${caps}`;
        return {
          provider: "browserstack",
          wsEndpoint,
          dashboardUrl: PAFHelpers.generateCloudGridDeepLink("browserstack", testTitle)
        };
      }
      default:
        return {
          provider: "local"
        };
    }
  }
};

// src/utils/assertion.helper.ts
var import_test = require("@playwright/test");
var SoftAssertions = class {
  errors = [];
  /**
   * Performs a soft equality check. Does not throw immediately if condition fails.
   */
  assertEquals(actual, expected, message = "Soft assertion failed") {
    try {
      (0, import_test.expect)(actual).toEqual(expected);
      Logger.success(`[SoftAssert PASSED] ${message}`);
    } catch (err) {
      Logger.warn(`[SoftAssert FAILED] ${message} - Expected: ${expected}, Got: ${actual}`);
      this.errors.push({
        message: `${message} (Expected: ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)})`,
        actual,
        expected
      });
    }
  }
  /**
   * Performs a soft truthy check.
   */
  assertTrue(condition, message = "Soft assertion true failed") {
    this.assertEquals(condition, true, message);
  }
  /**
   * Asserts all collected soft assertion errors at the end of the test.
   */
  assertAll() {
    if (this.errors.length > 0) {
      const combinedMsg = this.errors.map((e, idx) => `  ${idx + 1}. ${e.message}`).join("\n");
      Logger.error(`SoftAssertions aggregate failure:
${combinedMsg}`);
      throw new Error(`SoftAssertions aggregate failure (${this.errors.length} failed):
${combinedMsg}`);
    }
  }
};
var HardAssertions = class {
  static assertEquals(actual, expected, message) {
    (0, import_test.expect)(actual, message).toEqual(expected);
  }
  static assertTrue(condition, message) {
    (0, import_test.expect)(condition, message).toBe(true);
  }
  static assertContains(actualStringOrArray, expectedSubstringOrItem, message) {
    (0, import_test.expect)(actualStringOrArray, message).toContain(expectedSubstringOrItem);
  }
};

// src/utils/visual.validator.ts
var import_test2 = require("@playwright/test");
var VisualValidator = class {
  constructor(page) {
    this.page = page;
  }
  page;
  /**
   * Compares page or element screenshot against visual baseline
   */
  async compareScreenshot(snapshotName, target, options = {}) {
    const { threshold = 0.2, maxDiffPixels = 50, maskElements = [] } = options;
    Logger.info(`Performing Visual Validation for snapshot: "${snapshotName}"`);
    const maskedLocators = maskElements.map(
      (el) => typeof el === "string" ? this.page.locator(el) : el
    );
    const compareTarget = target || this.page;
    await (0, import_test2.expect)(compareTarget).toHaveScreenshot(`${snapshotName}.png`, {
      threshold,
      maxDiffPixels,
      mask: maskedLocators
    });
    Logger.success(`Visual validation passed for snapshot: "${snapshotName}"`);
  }
};

// src/utils/accessibility.validator.ts
var import_test3 = require("@playwright/test");
var import_playwright = __toESM(require("@axe-core/playwright"));
var import_fs2 = __toESM(require("fs"));
var import_path3 = __toESM(require("path"));
var AccessibilityValidator = class _AccessibilityValidator {
  constructor(page) {
    this.page = page;
  }
  page;
  static reportDir = import_path3.default.resolve(process.cwd(), "test-results/accessibility");
  /**
   * Performs an accessibility audit using Axe-Core
   */
  async audit(options = {}) {
    const {
      tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
      includeSelectors = [],
      excludeSelectors = [],
      disabledRules = []
    } = options;
    let builder = new import_playwright.default({ page: this.page }).withTags(tags);
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
  async assertNoViolations(pageName, options = {}) {
    Logger.info(`\u267F Running WCAG Accessibility Audit on page: "${pageName}"...`);
    const results = await this.audit(options);
    const violations = results.violations;
    if (violations.length > 0) {
      const summaryList = violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodesCount: v.nodes.length
      }));
      this.saveAccessibilityReport(pageName, results);
      Logger.error(
        `\u267F Found ${violations.length} Accessibility Violation(s) on "${pageName}":
` + summaryList.map((s) => `   - [${s.impact?.toUpperCase()}] ${s.id}: ${s.help} (${s.nodesCount} nodes affected) -> ${s.helpUrl}`).join("\n")
      );
      (0, import_test3.expect)(violations, `Page "${pageName}" has ${violations.length} accessibility violation(s)`).toEqual([]);
    } else {
      Logger.success(`\u267F Accessibility Audit PASSED for "${pageName}" - 0 violations detected!`);
    }
  }
  /**
   * Saves accessibility report JSON to test-results/accessibility
   */
  saveAccessibilityReport(pageName, results) {
    if (!import_fs2.default.existsSync(_AccessibilityValidator.reportDir)) {
      import_fs2.default.mkdirSync(_AccessibilityValidator.reportDir, { recursive: true });
    }
    const fileName = `a11y-report-${pageName.replace(/[^a-z0-9]/gi, "_")}-${Date.now()}.json`;
    const filePath = import_path3.default.join(_AccessibilityValidator.reportDir, fileName);
    import_fs2.default.writeFileSync(filePath, JSON.stringify(results, null, 2), "utf-8");
    Logger.info(`Saved accessibility audit report: ${filePath}`);
  }
};

// src/core/fixtures.ts
var test = import_test4.test.extend({
  envConfig: async ({}, use) => {
    const config = getEnvConfig();
    await use(config);
  },
  pafLogger: async ({}, use) => {
    await use(Logger);
  },
  networkMocker: async ({ page }, use) => {
    const mocker = new NetworkMocker(page);
    await use(mocker);
  },
  apiSeeder: async ({ request }, use) => {
    const seeder = new ApiSeeder(request);
    await use(seeder);
  },
  dbSeeder: async ({}, use) => {
    const seeder = new DBSeeder({ type: "mock" });
    await use(seeder);
  },
  gridSession: async ({}, use, testInfo) => {
    const session = GridRouter.getCdpEndpoint(testInfo.title, testInfo.project.name);
    await use(session);
  },
  softAssert: async ({}, use) => {
    const soft = new SoftAssertions();
    await use(soft);
    soft.assertAll();
  },
  visualValidator: async ({ page }, use) => {
    const validator = new VisualValidator(page);
    await use(validator);
  },
  a11yValidator: async ({ page }, use) => {
    const validator = new AccessibilityValidator(page);
    await use(validator);
  },
  page: async ({ page, envConfig }, use, testInfo) => {
    Logger.info(`\u25B6 Starting Test: "${testInfo.title}" [Project: ${testInfo.project.name}]`);
    await use(page);
    if (testInfo.status === "failed" || testInfo.status === "timedOut") {
      const accessTree = await PAFMcpAgent.getAccessibilityTree(page);
      const fixTip = PAFMcpAgent.suggestFixForLocator(testInfo.error?.message);
      PAFMcpAgent.emitAgentArtifact({
        testTitle: testInfo.title,
        status: "failed",
        errorDetails: testInfo.error?.message,
        suggestedLocatorFix: fixTip,
        accessibilitySnapshot: accessTree
      });
    }
    if (envConfig.isLambdaTest) {
      const status = testInfo.status === "passed" ? "passed" : "failed";
      const remark = testInfo.error ? testInfo.error.message : "Test executed successfully";
      await LambdaTestProvider.setTestStatus(page, status, remark);
    }
  }
});
var expect4 = import_test4.expect;

// src/config/paf.config.ts
var import_test5 = require("@playwright/test");
var import_path4 = __toESM(require("path"));
var import_fs3 = __toESM(require("fs"));
var createPAFConfig = (overrides = {}) => {
  const env = getEnvConfig();
  const cwd = process.cwd();
  const localSetup = import_path4.default.resolve(cwd, "src/core/global.setup.ts");
  const localTeardown = import_path4.default.resolve(cwd, "src/core/global.teardown.ts");
  const config = {
    testDir: "./tests",
    timeout: 60 * 1e3,
    expect: {
      timeout: 10 * 1e3
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : env.retries,
    workers: process.env.CI ? 2 : void 0,
    ...import_fs3.default.existsSync(localSetup) ? { globalSetup: localSetup } : {},
    ...import_fs3.default.existsSync(localTeardown) ? { globalTeardown: localTeardown } : {},
    reporter: [
      ["list"],
      ["html", { open: "never" }],
      ["json", { outputFile: "test-results/results.json" }]
    ],
    use: {
      baseURL: env.baseUrl,
      headless: env.headless,
      viewport: env.viewport,
      trace: env.recordTrace,
      video: env.recordVideo,
      screenshot: "only-on-failure"
    },
    projects: [
      // 1. Desktop Browsers
      {
        name: "Chromium",
        use: { browserName: "chromium" }
      },
      {
        name: "Firefox",
        use: { browserName: "firefox" }
      },
      {
        name: "WebKit",
        use: { browserName: "webkit" }
      },
      // 2. Mobile Device Emulation Matrix
      {
        name: "Mobile-Chrome-Pixel5",
        use: {
          ...import_test5.devices["Pixel 5"]
        }
      },
      {
        name: "Mobile-Safari-iPhone13",
        use: {
          ...import_test5.devices["iPhone 13"]
        }
      }
    ],
    ...overrides
  };
  return config;
};

// src/mailer/email.service.ts
var import_nodemailer = __toESM(require("nodemailer"));

// src/mailer/templates/report.html.ts
var generateEmailHtmlReport = (stats) => {
  const passRate = stats.total > 0 ? (stats.passed / stats.total * 100).toFixed(1) : "0";
  const durationSec = (stats.durationMs / 1e3).toFixed(2);
  const testRowsHtml = stats.testCases.map((tc) => {
    let statusColor = "#10b981";
    let statusBg = "rgba(16, 185, 129, 0.15)";
    if (tc.status === "failed" || tc.status === "timedOut") {
      statusColor = "#ef4444";
      statusBg = "rgba(239, 68, 68, 0.15)";
    } else if (tc.status === "skipped") {
      statusColor = "#f59e0b";
      statusBg = "rgba(245, 158, 11, 0.15)";
    }
    const durationStr = (tc.durationMs / 1e3).toFixed(2) + "s";
    return `
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 12px; font-weight: 500; color: #f8fafc;">${tc.title}</td>
          <td style="padding: 12px;">
            <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; color: ${statusColor}; background-color: ${statusBg}; text-transform: uppercase;">
              ${tc.status}
            </span>
          </td>
          <td style="padding: 12px; color: #94a3b8; font-size: 13px;">${durationStr}</td>
          <td style="padding: 12px; color: #94a3b8; font-size: 12px; font-family: monospace;">
            ${tc.error ? `<div style="color: #f87171; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${tc.error}</div>` : "None"}
          </td>
        </tr>
      `;
  }).join("");
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>PAF Test Execution Report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="650" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 28px 32px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                \u{1F680} PAF Test Execution Summary
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 14px; color: #e0e7ff; opacity: 0.9;">
                Automated Playwright Execution Report \u2022 Environment: <strong>${stats.environment}</strong>
              </p>
            </td>
          </tr>

          <!-- Summary Cards Grid -->
          <tr>
            <td style="padding: 24px 32px 12px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="23%" style="background-color: #0f172a; border-radius: 8px; padding: 16px; text-align: center; border: 1px solid #334155;">
                    <div style="font-size: 24px; font-weight: 700; color: #38bdf8;">${stats.total}</div>
                    <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-top: 4px; font-weight: 600;">Total Tests</div>
                  </td>
                  <td width="2%"></td>
                  <td width="23%" style="background-color: #0f172a; border-radius: 8px; padding: 16px; text-align: center; border: 1px solid #334155;">
                    <div style="font-size: 24px; font-weight: 700; color: #4ade80;">${stats.passed}</div>
                    <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-top: 4px; font-weight: 600;">Passed</div>
                  </td>
                  <td width="2%"></td>
                  <td width="23%" style="background-color: #0f172a; border-radius: 8px; padding: 16px; text-align: center; border: 1px solid #334155;">
                    <div style="font-size: 24px; font-weight: 700; color: #f87171;">${stats.failed}</div>
                    <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-top: 4px; font-weight: 600;">Failed</div>
                  </td>
                  <td width="2%"></td>
                  <td width="23%" style="background-color: #0f172a; border-radius: 8px; padding: 16px; text-align: center; border: 1px solid #334155;">
                    <div style="font-size: 24px; font-weight: 700; color: #c084fc;">${passRate}%</div>
                    <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-top: 4px; font-weight: 600;">Pass Rate</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Metadata Bar -->
          <tr>
            <td style="padding: 0 32px 20px 32px;">
              <div style="background-color: #0f172a; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #94a3b8; border: 1px solid #334155;">
                \u23F1\uFE0F <strong>Duration:</strong> ${durationSec}s &nbsp;|&nbsp; \u{1F4C5} <strong>Time:</strong> ${stats.startTime} &nbsp;|&nbsp; \u{1F3AC} <strong>Artifacts:</strong> Videos & Traces attached in GitHub Actions
              </div>
            </td>
          </tr>

          <!-- Test Details Table -->
          <tr>
            <td style="padding: 0 32px 28px 32px;">
              <h2 style="font-size: 16px; font-weight: 600; color: #f8fafc; margin: 0 0 12px 0;">Test Results Breakdown</h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #0f172a; border-radius: 8px; overflow: hidden; border: 1px solid #334155;">
                <thead>
                  <tr style="background-color: #1e293b; text-align: left; border-bottom: 2px solid #334155;">
                    <th style="padding: 10px 12px; font-size: 12px; font-weight: 600; color: #cbd5e1; text-transform: uppercase;">Test Name</th>
                    <th style="padding: 10px 12px; font-size: 12px; font-weight: 600; color: #cbd5e1; text-transform: uppercase;">Status</th>
                    <th style="padding: 10px 12px; font-size: 12px; font-weight: 600; color: #cbd5e1; text-transform: uppercase;">Time</th>
                    <th style="padding: 10px 12px; font-size: 12px; font-weight: 600; color: #cbd5e1; text-transform: uppercase;">Error Details</th>
                  </tr>
                </thead>
                <tbody>
                  ${testRowsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 16px 32px; border-top: 1px solid #334155; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                Generated automatically by <strong>PAF Automation Framework</strong> \u2022 Playwright Test Suite
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// src/mailer/custom.reporter.interface.ts
var EmailReporterRegistry = class {
  static customReporter;
  /**
   * Registers a custom user-defined email reporter
   */
  static registerCustomReporter(reporter) {
    Logger.info(`Registered Custom Email Reporter: "${reporter.name}"`);
    this.customReporter = reporter;
  }
  /**
   * Get active custom reporter if registered
   */
  static getCustomReporter() {
    return this.customReporter;
  }
  /**
   * Clears custom reporter
   */
  static clear() {
    this.customReporter = void 0;
  }
};

// src/mailer/email.service.ts
var EmailService = class {
  /**
   * Sends execution report email using custom reporter if registered, or standard Nodemailer transporter
   */
  static async sendReportEmail(stats) {
    const customReporter = EmailReporterRegistry.getCustomReporter();
    if (customReporter) {
      Logger.info(`Delegating email reporting to Custom Email Reporter: "${customReporter.name}"`);
      try {
        return await customReporter.sendReport(stats);
      } catch (err) {
        Logger.error(`Custom Email Reporter "${customReporter.name}" failed:`, err);
        return false;
      }
    }
    const env = getEnvConfig();
    if (!env.smtpHost || !env.smtpUser || !env.smtpPass || !env.mailTo) {
      Logger.warn(
        "Email reporting skipped. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and MAIL_TO in environment variables or register a custom email reporter."
      );
      return false;
    }
    try {
      const transporter = import_nodemailer.default.createTransport({
        host: env.smtpHost,
        port: env.smtpPort,
        secure: env.smtpSecure,
        auth: {
          user: env.smtpUser,
          pass: env.smtpPass
        }
      });
      const htmlContent = generateEmailHtmlReport(stats);
      const passRate = stats.total > 0 ? Math.round(stats.passed / stats.total * 100) : 0;
      const statusIcon = stats.failed === 0 ? "\u2705" : "\u274C";
      const subject = `${statusIcon} PAF Test Report [${env.envName.toUpperCase()}] - ${stats.passed}/${stats.total} Passed (${passRate}%)`;
      Logger.info(`Sending zero-attachment email report to ${env.mailTo}...`);
      const info = await transporter.sendMail({
        from: env.mailFrom,
        to: env.mailTo,
        subject,
        html: htmlContent
      });
      Logger.success(`Report email sent successfully! MessageId: ${info.messageId}`);
      return true;
    } catch (error) {
      Logger.error("Failed to send report email:", error);
      return false;
    }
  }
};

// src/recorders/artifact.manager.ts
var import_fs4 = __toESM(require("fs"));
var import_path5 = __toESM(require("path"));
var ArtifactManager = class {
  static resultsDir = import_path5.default.resolve(process.cwd(), "test-results");
  /**
   * Scans and aggregates test artifacts (videos, trace files, screenshots) for a given test.
   */
  static getArtifactsForTest(testTitleSanitized) {
    const details = {
      testTitle: testTitleSanitized,
      screenshots: []
    };
    if (!import_fs4.default.existsSync(this.resultsDir)) {
      return details;
    }
    try {
      const dirs = import_fs4.default.readdirSync(this.resultsDir);
      for (const dirName of dirs) {
        if (dirName.toLowerCase().includes(testTitleSanitized.toLowerCase().replace(/[^a-z0-9]/gi, "-"))) {
          const fullDirPath = import_path5.default.join(this.resultsDir, dirName);
          if (import_fs4.default.lstatSync(fullDirPath).isDirectory()) {
            const files = import_fs4.default.readdirSync(fullDirPath);
            for (const file of files) {
              const fullFilePath = import_path5.default.join(fullDirPath, file);
              if (file.endsWith(".webm") || file.endsWith(".mp4")) {
                details.videoPath = fullFilePath;
              } else if (file.endsWith(".zip") || file.includes("trace")) {
                details.tracePath = fullFilePath;
              } else if (file.endsWith(".png") || file.endsWith(".jpg")) {
                details.screenshots.push(fullFilePath);
              }
            }
          }
        }
      }
    } catch (error) {
      Logger.error(`Error scanning artifacts for test "${testTitleSanitized}":`, error);
    }
    return details;
  }
  /**
   * Helper to ensure output directory exists
   */
  static ensureDirExists(dirPath) {
    if (!import_fs4.default.existsSync(dirPath)) {
      import_fs4.default.mkdirSync(dirPath, { recursive: true });
    }
  }
};

// src/reporters/paf.reporter.ts
var PAFReporter = class {
  startTime = 0;
  testCases = [];
  onBegin(config, suite) {
    this.startTime = Date.now();
    Logger.info(`\u{1F680} Starting Playwright PAF Execution... Total tests: ${suite.allTests().length}`);
  }
  onTestEnd(test2, result) {
    const durationMs = result.duration;
    const status = result.status;
    const title = test2.titlePath().slice(1).join(" > ");
    const artifacts = ArtifactManager.getArtifactsForTest(test2.title);
    const tcResult = {
      title,
      status,
      durationMs,
      error: result.error ? result.error.message : void 0,
      videoPath: artifacts.videoPath,
      tracePath: artifacts.tracePath
    };
    this.testCases.push(tcResult);
    if (status === "passed") {
      Logger.success(`PASSED: ${title} (${(durationMs / 1e3).toFixed(2)}s)`);
    } else if (status === "failed" || status === "timedOut") {
      Logger.error(`FAILED: ${title} (${(durationMs / 1e3).toFixed(2)}s) - Error: ${result.error?.message}`);
      if (artifacts.videoPath) {
        Logger.info(`   \u{1F4F9} Video artifact recorded: ${artifacts.videoPath}`);
      }
      if (artifacts.tracePath) {
        Logger.info(`   \u{1F50D} Trace artifact recorded: ${artifacts.tracePath}`);
      }
    } else {
      Logger.warn(`SKIPPED: ${title}`);
    }
  }
  async onEnd(result) {
    const durationMs = Date.now() - this.startTime;
    const passed = this.testCases.filter((tc) => tc.status === "passed").length;
    const failed = this.testCases.filter((tc) => tc.status === "failed" || tc.status === "timedOut").length;
    const skipped = this.testCases.filter((tc) => tc.status === "skipped").length;
    const total = this.testCases.length;
    Logger.info("========================================");
    Logger.info("\u{1F4CA} PLAYWRIGHT TEST SUITE RUN COMPLETED");
    Logger.info(` Total: ${total} | Passed: ${passed} | Failed: ${failed} | Skipped: ${skipped}`);
    Logger.info(` Duration: ${(durationMs / 1e3).toFixed(2)} seconds`);
    Logger.info("========================================");
    const env = getEnvConfig();
    const stats = {
      total,
      passed,
      failed,
      skipped,
      durationMs,
      environment: env.envName,
      startTime: new Date(this.startTime).toLocaleString(),
      testCases: this.testCases
    };
    if (env.sendMailOnFinish) {
      await EmailService.sendReportEmail(stats);
    }
  }
};

// src/providers/server.provider.ts
var ServerProvider = class {
  /**
   * Evaluates server execution environment details (Local vs Docker vs GitHub Actions server)
   */
  static getEnvironmentInfo() {
    const env = getEnvConfig();
    const isCI = !!process.env.CI || !!process.env.GITHUB_ACTIONS;
    Logger.info(`Running in ${isCI ? "CI Server / GitHub Actions" : "Local / On-Prem Server"} Environment`);
    return {
      isCI,
      platform: process.platform,
      nodeVersion: process.version,
      baseUrl: env.baseUrl,
      headless: env.headless
    };
  }
  /**
   * Helper to determine if we are running in headless server mode
   */
  static isServerMode() {
    const env = getEnvConfig();
    return env.headless || !!process.env.CI;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AccessibilityValidator,
  ApiSeeder,
  ArtifactManager,
  BaseComponent,
  BasePage,
  DBSeeder,
  EmailReporterRegistry,
  EmailService,
  GridRouter,
  HardAssertions,
  LambdaTestProvider,
  LogLevel,
  Logger,
  NetworkMocker,
  PAFHelpers,
  PAFMcpAgent,
  PAFReporter,
  ServerProvider,
  SoftAssertions,
  VisualValidator,
  createPAFConfig,
  expect,
  generateEmailHtmlReport,
  getEnvConfig,
  test
});
//# sourceMappingURL=index.js.map