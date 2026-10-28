import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['steps/**/*.ts', 'utils/fixtures.ts'],
});

export default defineConfig({
  testDir,
  timeout: 150000,
  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    cucumberReporter('html', {
      outputFile: 'cucumber-report/report.html',
    }),
    cucumberReporter('json', {
      outputFile: 'cucumber-report/report.json',
    }),
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    headless: false,
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://www.avianca.com/en',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    storageState: {
      cookies: [
        {
          name: 'cookie_consent',
          value: 'true',
          domain: '.avianca.com',
          path: '/',
          expires: -1,
          httpOnly: false,
          secure: true,
          sameSite: 'Lax',
        },
      ],
      origins: [],
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chrome',
      use: {
        // sin devices para no forzar un userAgent distinto al Chrome real
        channel: 'chrome',
        viewport: { width: 1920, height: 1080 },
        locale: 'en-US',
        launchOptions: {
          ignoreDefaultArgs: ['--enable-automation'],
          args: [
            '--disable-blink-features=AutomationControlled',
          ],
        },
      },
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
