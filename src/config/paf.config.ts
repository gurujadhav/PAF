import { PlaywrightTestConfig, devices } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { getEnvConfig } from './env.config.js';

export const createPAFConfig = (overrides: Partial<PlaywrightTestConfig> = {}): PlaywrightTestConfig => {
  const env = getEnvConfig();

  const cwd = process.cwd();
  const localSetup = path.resolve(cwd, 'src/core/global.setup.ts');
  const localTeardown = path.resolve(cwd, 'src/core/global.teardown.ts');

  const config: PlaywrightTestConfig = {
    testDir: './tests',
    timeout: 60 * 1000,
    expect: {
      timeout: 10 * 1000,
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : env.retries,
    workers: process.env.CI ? 2 : undefined,
    ...(fs.existsSync(localSetup) ? { globalSetup: localSetup } : {}),
    ...(fs.existsSync(localTeardown) ? { globalTeardown: localTeardown } : {}),
    reporter: [
      ['list'],
      ['html', { open: 'never' }],
      ['json', { outputFile: 'test-results/results.json' }],
    ],
    use: {
      baseURL: env.baseUrl,
      headless: env.headless,
      viewport: env.viewport,
      trace: env.recordTrace,
      video: env.recordVideo,
      screenshot: 'only-on-failure',
    },
    projects: [
      // 1. Desktop Browsers
      {
        name: 'Chromium',
        use: { browserName: 'chromium' },
      },
      {
        name: 'Firefox',
        use: { browserName: 'firefox' },
      },
      {
        name: 'WebKit',
        use: { browserName: 'webkit' },
      },

      // 2. Mobile Device Emulation Matrix
      {
        name: 'Mobile-Chrome-Pixel5',
        use: {
          ...devices['Pixel 5'],
        },
      },
      {
        name: 'Mobile-Safari-iPhone13',
        use: {
          ...devices['iPhone 13'],
        },
      },
    ],
    ...overrides,
  };

  return config;
};
