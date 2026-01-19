import { test, expect } from '@playwright/experimental-ct-react'
import type { ComponentFixtures } from '@playwright/experimental-ct-react'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'

const mountApp = async (mount: ComponentFixtures['mount']) => {
  return await mount(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )
}

test('should render heading', async ({ mount }) => {
  const component = await mountApp(mount)

  await expect(component.getByRole('heading', { name: 'Posts' })).toBeVisible()
})

test('should render post list', async ({ mount }) => {
  const component = await mountApp(mount)

  // Wait for posts to load - find the list by looking for the first post link
  await expect(component.locator('a').first()).toBeVisible()
})
