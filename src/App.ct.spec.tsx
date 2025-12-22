import { test, expect } from '@playwright/experimental-ct-react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

test('should render heading', async ({ mount }) => {
  const component = await mount(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )

  await expect(component.getByRole('heading', { name: 'Vite + React' })).toBeVisible()
})

test('should increment count when button is clicked', async ({ mount }) => {
  const component = await mount(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )

  const button = component.getByRole('button', { name: /count is/i })
  await expect(button).toHaveText('count is 0')

  await button.click()
  await expect(button).toHaveText('count is 1')
})

test('should render health link with correct href', async ({ mount }) => {
  const component = await mount(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )

  const link = component.getByRole('link', { name: '/health' })
  await expect(link).toHaveAttribute('href', '/health')
})
