import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  outputDir: './coverage/test-results',
  reporter: [['html', { outputFolder: './coverage/playwright-report' }]],

  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'setup clerk',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },

      dependencies: ['setup clerk'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },

      dependencies: ['setup clerk'],
    },
  ],

  webServer: {
    command: 'pnpm dev',
    reuseExistingServer: !process.env.CI,
    url: 'http://localhost:3000',
  },
});
