import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  // Maximum time one test can run for.
  timeout: 30 * 1000,
  expect: {
    // Maximum time expect() should wait for the condition to be met.
    // For example in `await expect(locator).toHaveText();`
    timeout: 5000,
  },
  // Run tests in files in parallel
  fullyParallel: false,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // Retry on CI only
  retries: process.env.CI ? 3 : 0,
  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['github'], // GitHub Actions specific reporter
  ],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure', // Video on failed tests
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // CI környezetben headless mode
        launchOptions: {
          args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
        },
      },
    },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run start',
        url: 'http://localhost:4200',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
        stdout: 'ignore', // don't spam log during CI
        stderr: 'pipe',
      },
  outputDir: 'test-results/',
});
