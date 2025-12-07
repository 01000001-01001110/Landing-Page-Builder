// Playwright Configuration
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './',
  testMatch: 'test_app.js',
  timeout: 60000,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:8000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'python server.py',
    port: 8000,
    timeout: 10000,
    reuseExistingServer: true,
  },
});
