import { test as baseTest, expect as baseExpect } from '@playwright/test';
import { getEnvConfig, PAFEnvConfig } from '../config/env.config.js';
import { LambdaTestProvider } from '../providers/lambdatest.provider.js';
import { Logger } from '../utils/logger.js';
import { NetworkMocker } from '../utils/network.mock.js';
import { ApiSeeder } from '../data/api.seeder.js';
import { DBSeeder } from '../data/db.seeder.js';
import { PAFMcpAgent } from '../mcp/paf.mcp.js';
import { GridRouter, CloudGridSessionInfo } from '../providers/grid.router.js';
import { SoftAssertions } from '../utils/assertion.helper.js';
import { VisualValidator } from '../utils/visual.validator.js';
import { AccessibilityValidator } from '../utils/accessibility.validator.js';

export interface PAFTestFixtures {
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

export const test = baseTest.extend<PAFTestFixtures>({
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
    const seeder = new DBSeeder({ type: 'mock' });
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
    Logger.info(`▶ Starting Test: "${testInfo.title}" [Project: ${testInfo.project.name}]`);

    // Execute test block
    await use(page);

    // If test failed, emit Antigravity Agent Artifact for live inspection
    if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
      const accessTree = await PAFMcpAgent.getAccessibilityTree(page);
      const fixTip = PAFMcpAgent.suggestFixForLocator(testInfo.error?.message);

      PAFMcpAgent.emitAgentArtifact({
        testTitle: testInfo.title,
        status: 'failed',
        errorDetails: testInfo.error?.message,
        suggestedLocatorFix: fixTip,
        accessibilitySnapshot: accessTree,
      });
    }

    // Teardown step: Handle LambdaTest status sync if active
    if (envConfig.isLambdaTest) {
      const status = testInfo.status === 'passed' ? 'passed' : 'failed';
      const remark = testInfo.error ? testInfo.error.message : 'Test executed successfully';
      await LambdaTestProvider.setTestStatus(page, status, remark);
    }
  },
});

export const expect = baseExpect;
