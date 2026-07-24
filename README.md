# 🚀 PAF (Playwright Automation Framework)

A modular, enterprise-grade Playwright automation testing framework in TypeScript with out-of-the-box support for:
- 🎬 **Video Recording & Playwright Trace Viewer** artifact packaging
- 📧 **Automated Email Reporting (Mailer)** with pluggable custom reporter support
- ♿ **WCAG Accessibility (a11y) Testing** via Axe-Core
- 📸 **Visual Regression Testing** with element masking and pixel diff thresholds
- ⚡ **Soft & Hard Assertions**
- 📜 **JavaScript Executor & Visual Highlighting**
- 🌐 **Network Interception & Mocking**
- ☁️ **Dynamic Cloud Grid Routing** (LambdaTest, BrowserStack, SauceLabs)
- 🤖 **Antigravity AI IDE & MCP Server Integration** with live artifact emission
- 📦 **NPM Package Publishing Capability** with CLI tool (`bin/paf.js`)

---

## ⚙️ Framework Settings & Environment Variables (`.env`)

Configure these environment variables in your `.env` file or CI environment secrets:

| Variable | Type | Default | Description |
| --- | --- | --- | --- |
| `BASE_URL` | String | `https://demo.playwright.dev/todomvc` | Application base URL under test |
| `ENV` | String | `dev` | Environment identifier (`dev`, `staging`, `prod`) |
| `HEADLESS` | Boolean | `true` | Run browser in headless mode (`true` / `false`) |
| `VIEWPORT_WIDTH` | Number | `1920` | Browser viewport width |
| `VIEWPORT_HEIGHT` | Number | `1080` | Browser viewport height |
| `RETRIES` | Number | `1` | Test retries count |
| `RECORD_VIDEO` | String | `retain-on-failure` | Video recording rule (`on`, `off`, `retain-on-failure`, `retry-with-video`) |
| `RECORD_TRACE` | String | `retain-on-failure` | Playwright trace rule (`on`, `off`, `retain-on-failure`, `retry-with-trace`) |
| `SMTP_HOST` | String | - | SMTP Host for email reporter (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | Number | `587` | SMTP port |
| `SMTP_SECURE` | Boolean | `false` | Enable TLS/SSL for SMTP |
| `SMTP_USER` | String | - | SMTP authentication username / email |
| `SMTP_PASS` | String | - | SMTP password or app-specific password |
| `MAIL_FROM` | String | `PAF Automation <no-reply@paf.com>` | Sender email header |
| `MAIL_TO` | String | - | Recipient email address(es), comma-separated |
| `SEND_MAIL_ON_FINISH` | Boolean | `false` | Set to `true` to automatically send email on suite completion |
| `GRID_PROVIDER` | String | `local` | Active grid provider (`lambdatest`, `browserstack`, `saucelabs`, `local`) |
| `LAMBDATEST` | Boolean | `false` | Enable LambdaTest cloud grid execution |
| `LT_USERNAME` | String | - | LambdaTest username |
| `LT_ACCESS_KEY` | String | - | LambdaTest access key |
| `LT_GRID_URL` | String | `hub.lambdatest.com/playwright/cdp` | LambdaTest WebSocket grid URL |

---

## 🛠️ Complete Helper Functions & Fixtures Reference

PAF exposes built-in extended Playwright test fixtures and utility helper classes.

### 1. `PAFHelpers` (`src/utils/helpers.ts`)
```typescript
import { PAFHelpers } from 'paf-automation-framework';

// Random string & email generation
const str = PAFHelpers.randomString(8); // 'aB3x9KzL'
const email = PAFHelpers.randomEmail('mycompany.com'); // 'test-178491438-aB3x9@mycompany.com'

// Execution pause
await PAFHelpers.sleep(2000);

// Robust retry wrapper with delay
const data = await PAFHelpers.retry(
  async () => fetchUserData(),
  3, // max retries
  1000, // delay ms
  'Fetch User Data'
);

// Cloud Grid Deep Link generator
const dashboardUrl = PAFHelpers.generateCloudGridDeepLink('lambdatest', 'Test Session Name');
```

---

### 2. Soft Assertions & Hard Assertions (`src/utils/assertion.helper.ts`)
```typescript
test('Assertion example', async ({ softAssert }) => {
  // Soft assertions do not halt execution on failure; errors are collected and asserted at test completion
  softAssert.assertEquals(actualValue, expectedValue, 'Verify component status');
  softAssert.assertTrue(isDisplayed, 'Verify element visibility');

  // Hard assertion (immediate throw)
  HardAssertions.assertEquals(actual, expected);
  HardAssertions.assertContains('Hello World', 'World');
});
```

---

### 3. Visual Validation (`src/utils/visual.validator.ts`)
```typescript
test('Visual validation example', async ({ visualValidator, page }) => {
  await page.goto('/dashboard');

  // Compare page screenshot with reference baseline using custom threshold & element masking
  await visualValidator.compareScreenshot('dashboard-home', undefined, {
    threshold: 0.2,
    maxDiffPixels: 50,
    maskElements: ['.dynamic-timestamp', page.locator('.user-avatar')],
  });
});
```

---

### 4. Accessibility Testing (a11y) (`src/utils/accessibility.validator.ts`)
```typescript
test('Accessibility audit example', async ({ a11yValidator, page }) => {
  await page.goto('/login');

  // Perform WCAG 2.1 AA audit and assert zero violations
  await a11yValidator.assertNoViolations('Login Page', {
    tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    disabledRules: ['color-contrast'], // optional exclusions
  });
});
```

---

### 5. JavaScript Executor (`src/core/base.page.ts`)
```typescript
export class DashboardPage extends BasePage {
  public async performJsActions() {
    // Execute JS script in browser context
    const pageTitle = await this.executeJs(() => document.title);

    // Scroll element into view smoothly
    await this.scrollIntoView('#footer-links');

    // Scroll to bottom
    await this.scrollToBottom();

    // Visually highlight element with red border (for videos and live debugging)
    await this.highlightElement('#submit-button');
  }
}
```

---

### 6. Network Interception & Mocking (`src/utils/network.mock.ts`)
```typescript
test('Network mocking example', async ({ networkMocker, page }) => {
  // Mock API JSON endpoint response
  await networkMocker.mockJsonEndpoint('**/api/v1/user/profile', {
    id: 'user_123',
    name: 'Jane Doe',
    status: 'active',
  });

  // Block 3rd party analytics & tracking scripts
  await networkMocker.blockTrackerScripts();

  await page.goto('/profile');
});
```

---

### 7. Custom Email Reporter Registration (`src/mailer/custom.reporter.interface.ts`)
```typescript
import { EmailReporterRegistry, ICustomEmailReporter, SummaryReportStats } from 'paf-automation-framework';

class CustomSlackReporter implements ICustomEmailReporter {
  name = 'CustomSlackReporter';

  async sendReport(stats: SummaryReportStats): Promise<boolean> {
    console.log(`Sending custom Slack report for ${stats.total} tests...`);
    return true;
  }
}

// Register custom reporter
EmailReporterRegistry.registerCustomReporter(new CustomSlackReporter());
```

---

## 🎛️ Advanced CLI Runner Flags (`npx paf` / `node bin/paf.js`)

PAF features an intelligent CLI tool (`bin/paf.js`) supporting tag filtering, browser selection, report backups, and conditional email reporting:

| CLI Option | Example Command | Description |
| --- | --- | --- |
| **Tag Inclusion (`@tag`)** | `node bin/paf.js @smoke` | Runs only tests matching `@smoke` tag |
| **Tag Exclusion (`--skip @tag`)** | `node bin/paf.js --skip @flaky` | Runs tests excluding `@flaky` tag |
| **Browser Selection (`--browser`)** | `node bin/paf.js --browser chrome` | Targets `Chromium`, `Firefox`, or `WebKit` |
| **Headed Mode (`--headed`)** | `node bin/paf.js --headed` | Runs browser visibly |
| **Headless Mode (`--headless`)** | `node bin/paf.js --headless` | Runs browser headless |
| **Report Backup (`--reportsBackup`)** | `node bin/paf.js --reportsBackup` | Archives prior reports & test results to timestamped backup folder before running |
| **Email Reporting (`--email`)** | `node bin/paf.js --email` | Sends email report on finish (skips email if flag is absent) |

### Combined Example Commands
```bash
# Run @smoke tagged tests on Chrome in headed mode and email report upon completion
node bin/paf.js --browser chrome @smoke --headed --email

# Backup previous execution reports and run all tests excluding @wip tag on Firefox
node bin/paf.js --browser firefox --skip @wip --reportsBackup
```
