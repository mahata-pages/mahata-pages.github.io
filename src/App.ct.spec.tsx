import { test, expect } from '@playwright/experimental-ct-react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

test('App renders and increments count', async ({ mount }) => {
  const component = await mount(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )

  await expect(component.getByRole('heading', { name: 'Vite + React' })).toBeVisible()

  const button = component.getByRole('button', { name: /count is/i })
  await expect(button).toHaveText('count is 0')

  await button.click()
  await expect(button).toHaveText('count is 1')

  const link = component.getByRole('link', { name: '/health' })
  await expect(link).toHaveAttribute('href', '/health')
})
