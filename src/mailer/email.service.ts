import nodemailer from 'nodemailer';
import { getEnvConfig } from '../config/env.config.js';
import { Logger } from '../utils/logger.js';
import { generateEmailHtmlReport, SummaryReportStats } from './templates/report.html.js';
import { EmailReporterRegistry } from './custom.reporter.interface.js';

export class EmailService {
  /**
   * Sends execution report email using custom reporter if registered, or standard Nodemailer transporter
   */
  public static async sendReportEmail(stats: SummaryReportStats): Promise<boolean> {
    // 1. Check if user provided a pluggable custom email reporter
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

    // 2. Fall back to standard Nodemailer transport
    const env = getEnvConfig();
    if (!env.smtpHost || !env.smtpUser || !env.smtpPass || !env.mailTo) {
      Logger.warn(
        'Email reporting skipped. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and MAIL_TO in environment variables or register a custom email reporter.'
      );
      return false;
    }

    try {
      const transporter = nodemailer.createTransport({
        host: env.smtpHost,
        port: env.smtpPort,
        secure: env.smtpSecure,
        auth: {
          user: env.smtpUser,
          pass: env.smtpPass,
        },
      });

      const htmlContent = generateEmailHtmlReport(stats);
      const passRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
      const statusIcon = stats.failed === 0 ? '✅' : '❌';
      const subject = `${statusIcon} PAF Test Report [${env.envName.toUpperCase()}] - ${stats.passed}/${stats.total} Passed (${passRate}%)`;

      Logger.info(`Sending zero-attachment email report to ${env.mailTo}...`);

      const info = await transporter.sendMail({
        from: env.mailFrom,
        to: env.mailTo,
        subject,
        html: htmlContent,
      });

      Logger.success(`Report email sent successfully! MessageId: ${info.messageId}`);
      return true;
    } catch (error) {
      Logger.error('Failed to send report email:', error);
      return false;
    }
  }
}
