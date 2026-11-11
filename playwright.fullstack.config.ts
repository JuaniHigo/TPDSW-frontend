import { defineConfig } from '@playwright/test';
import base from './playwright.config';
export default defineConfig({
  ...base,
  testDir: './tests/fullstack',
  globalTeardown: './tests/fullstack/teardown.ts',
  webServer: [
    {
      command: 'node tests/e2e-server.cjs',
      cwd: '../TPDSW-backend',
      url: 'http://127.0.0.1:5180/health',
      reuseExistingServer: false,
      timeout: 60000,
    },
    {
      command:
        'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5174 --strictPort',
      url: 'http://127.0.0.1:5174',
      reuseExistingServer: false,
      env: { VITE_API_URL: 'http://127.0.0.1:5180/api' },
    },
  ],
});
