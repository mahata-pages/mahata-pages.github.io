import { defineConfig, devices } from '@playwright/experimental-ct-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  testDir: './src',
  testMatch: ['**/*.ct.spec.{ts,tsx}'],
  fullyParallel: true,
  reporter: process.env.CI
    ? [['list']]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    ctViteConfig: {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        },
      },
    },
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
