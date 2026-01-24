import { test, expect } from '@playwright/experimental-ct-react'
import { Header } from '@/Header'


test('should show logo image in header', async ({ mount }) => {
  const component = await mount(<Header />)
  
  await expect(component.getByRole('img', { name: 'Logo' })).toBeVisible()
})
