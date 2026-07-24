import dotenv from 'dotenv';
import path from 'path';

// Load .env file if available
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface PAFEnvConfig {
  baseUrl: string;
  envName: string;
  headless: boolean;
  viewport: { width: number; height: number };
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

export const getEnvConfig = (): PAFEnvConfig => {
  return {
    baseUrl: process.env.BASE_URL || 'https://demo.playwright.dev/todomvc',
    envName: process.env.ENV || 'dev',
    headless: process.env.HEADLESS !== 'false',
    viewport: {
      width: parseInt(process.env.VIEWPORT_WIDTH || '1920', 10),
      height: parseInt(process.env.VIEWPORT_HEIGHT || '1080', 10),
    },
    retries: parseInt(process.env.RETRIES || '1', 10),
    recordVideo: (process.env.RECORD_VIDEO as any) || 'retain-on-failure',
    recordTrace: (process.env.RECORD_TRACE as any) || 'retain-on-failure',
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    smtpSecure: process.env.SMTP_SECURE === 'true',
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    mailFrom: process.env.MAIL_FROM || 'PAF Automation <no-reply@paf.com>',
    mailTo: process.env.MAIL_TO,
    sendMailOnFinish: process.env.SEND_MAIL_ON_FINISH === 'true',
    isLambdaTest: process.env.LAMBDATEST === 'true',
    ltUsername: process.env.LT_USERNAME,
    ltAccessKey: process.env.LT_ACCESS_KEY,
    ltGridUrl: process.env.LT_GRID_URL || 'hub.lambdatest.com/playwright/cdp',
  };
};
