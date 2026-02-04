import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4173/';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run build && PORT=4173 node scripts/serve-static.mjs',
    url: baseURL,
    reuseExistingServer: !process.env.CI
  }
});
