import { defineConfig, devices } from '@playwright/experimental-ct-react'
import viteConfig from './vite.config'

export default defineConfig({
  testDir: './src',
  testMatch: ['**/*.ct.spec.{ts,tsx}'],
  fullyParallel: true,
  reporter: process.env.CI
    ? [['list']]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    ctViteConfig: viteConfig,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
})
