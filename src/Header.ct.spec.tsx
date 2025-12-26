import { test, expect } from '@playwright/experimental-ct-react'
import { Header } from '@/Header'

test('should render heading with correct text', async ({ mount }) => {
  const component = await mount(<Header />)
  
  await expect(component.getByRole('heading', { name: 'Welcome to SpappLog' })).toBeVisible()
})
