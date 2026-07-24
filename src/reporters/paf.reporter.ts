import {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';
import { Logger } from '../utils/logger.js';
import { getEnvConfig } from '../config/env.config.js';
import { EmailService } from '../mailer/email.service.js';
import { SummaryReportStats, TestCaseReportResult } from '../mailer/templates/report.html.js';
import { ArtifactManager } from '../recorders/artifact.manager.js';

export class PAFReporter implements Reporter {
  private startTime: number = 0;
  private testCases: TestCaseReportResult[] = [];

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
    Logger.info(`🚀 Starting Playwright PAF Execution... Total tests: ${suite.allTests().length}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const durationMs = result.duration;
    const status = result.status;
    const title = test.titlePath().slice(1).join(' > ');

    const artifacts = ArtifactManager.getArtifactsForTest(test.title);

    const tcResult: TestCaseReportResult = {
      title,
      status,
      durationMs,
      error: result.error ? result.error.message : undefined,
      videoPath: artifacts.videoPath,
      tracePath: artifacts.tracePath,
    };

    this.testCases.push(tcResult);

    if (status === 'passed') {
      Logger.success(`PASSED: ${title} (${(durationMs / 1000).toFixed(2)}s)`);
    } else if (status === 'failed' || status === 'timedOut') {
      Logger.error(`FAILED: ${title} (${(durationMs / 1000).toFixed(2)}s) - Error: ${result.error?.message}`);
      if (artifacts.videoPath) {
        Logger.info(`   📹 Video artifact recorded: ${artifacts.videoPath}`);
      }
      if (artifacts.tracePath) {
        Logger.info(`   🔍 Trace artifact recorded: ${artifacts.tracePath}`);
      }
    } else {
      Logger.warn(`SKIPPED: ${title}`);
    }
  }

  async onEnd(result: FullResult) {
    const durationMs = Date.now() - this.startTime;
    const passed = this.testCases.filter((tc) => tc.status === 'passed').length;
    const failed = this.testCases.filter((tc) => tc.status === 'failed' || tc.status === 'timedOut').length;
    const skipped = this.testCases.filter((tc) => tc.status === 'skipped').length;
    const total = this.testCases.length;

    Logger.info('========================================');
    Logger.info('📊 PLAYWRIGHT TEST SUITE RUN COMPLETED');
    Logger.info(` Total: ${total} | Passed: ${passed} | Failed: ${failed} | Skipped: ${skipped}`);
    Logger.info(` Duration: ${(durationMs / 1000).toFixed(2)} seconds`);
    Logger.info('========================================');

    const env = getEnvConfig();

    const stats: SummaryReportStats = {
      total,
      passed,
      failed,
      skipped,
      durationMs,
      environment: env.envName,
      startTime: new Date(this.startTime).toLocaleString(),
      testCases: this.testCases,
    };

    if (env.sendMailOnFinish) {
      await EmailService.sendReportEmail(stats);
    }
  }
}

export default PAFReporter;
