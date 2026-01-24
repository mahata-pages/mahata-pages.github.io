import { test, expect } from '@playwright/experimental-ct-react'
import type { ComponentFixtures } from '@playwright/experimental-ct-react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '@/Header'
import { Home } from '@/pages/Home'

const mountHome = async (mount: ComponentFixtures['mount']) => {
  return await mount(
    <MemoryRouter initialEntries={['/']}>
      <>
        <Header />
        <main>
          <Home />
        </main>
      </>
    </MemoryRouter>,
  )
}

test('should render header, post list and pagination', async ({ mount }) => {
  const component = await mountHome(mount)

  // Check header is rendered
  await expect(component.locator('header')).toBeVisible()

  // Wait for posts to load - find the list by looking for the first post link
  await expect(component.getByRole('link').filter({ hasText: /.+/ }).first()).toBeVisible()

  // Check pagination controls exist
  await expect(component.locator('nav')).toBeVisible()
})
