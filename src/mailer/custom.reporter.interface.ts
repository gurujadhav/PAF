import { SummaryReportStats } from './templates/report.html.js';
import { Logger } from '../utils/logger.js';

export interface ICustomEmailReporter {
  /**
   * Name identifier of custom email reporter
   */
  name: string;

  /**
   * Send function receiving test summary stats and returning boolean success status
   */
  sendReport(stats: SummaryReportStats): Promise<boolean>;
}

export class EmailReporterRegistry {
  private static customReporter?: ICustomEmailReporter;

  /**
   * Registers a custom user-defined email reporter
   */
  public static registerCustomReporter(reporter: ICustomEmailReporter): void {
    Logger.info(`Registered Custom Email Reporter: "${reporter.name}"`);
    this.customReporter = reporter;
  }

  /**
   * Get active custom reporter if registered
   */
  public static getCustomReporter(): ICustomEmailReporter | undefined {
    return this.customReporter;
  }

  /**
   * Clears custom reporter
   */
  public static clear(): void {
    this.customReporter = undefined;
  }
}
