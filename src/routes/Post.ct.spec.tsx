import { test, expect } from '@playwright/experimental-ct-react'
import type { ComponentFixtures } from '@playwright/experimental-ct-react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Post from './Post'

const mountAtPath = async (mount: ComponentFixtures['mount'], path: string) => {
  return await mount(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/posts/:slug" element={<Post />} />
      </Routes>
    </MemoryRouter>,
  )
}

test('renders existing markdown post', async ({ mount }) => {
  const component = await mountAtPath(mount, '/posts/yo')

  await expect(component.getByRole('heading', { name: 'Hey' })).toBeVisible()
  await expect(component).toContainText('Yo.')
})

test('shows not found for missing post', async ({ mount }) => {
  const component = await mountAtPath(mount, '/posts/missing')

  await expect(component).toContainText('Post not found.')
  const backLink = component.getByRole('link', { name: 'Back home' })
  await expect(backLink).toHaveAttribute('href', '/')
})

test('handles markdown with special characters and incomplete syntax', async ({ mount }) => {
  const component = await mountAtPath(mount, '/posts/special-chars')
  
  // Should render without crashing, even with incomplete link syntax
  await expect(component).toBeVisible()
  // remark-html sanitizes HTML-like tags; <Characters> is stripped for security
  await expect(component.getByRole('heading', { name: /Special/ })).toBeVisible()
  // remark should handle incomplete link gracefully by rendering it as plain text
  await expect(component).toContainText('Incomplete link')
})

test('handles markdown with unbalanced brackets', async ({ mount }) => {
  const component = await mountAtPath(mount, '/posts/unbalanced')
  
  // Should render without crashing, even if markdown has unbalanced syntax
  await expect(component).toBeVisible()
  await expect(component.getByRole('heading', { name: 'Heading' })).toBeVisible()
  await expect(component).toContainText('unbalanced brackets')
})

test('handles empty markdown content', async ({ mount, page }) => {
  const component = await mountAtPath(mount, '/posts/empty')
  
  // Should render article element even with empty content
  // Article element exists in DOM but has no visible content
  const articleCount = await page.locator('article').count()
  expect(articleCount).toBe(1)
  // Verify it doesn't show "Post not found" error
  await expect(component).not.toContainText('Post not found')
})

test('handles markdown with potentially malicious HTML content', async ({ mount }) => {
  const component = await mountAtPath(mount, '/posts/malicious')
  
  await expect(component).toBeVisible()
  // The heading should be visible, proving markdown was processed
  await expect(component.getByRole('heading', { name: 'Safe Heading' })).toBeVisible()
  
  // Verify that HTML tags (script, img) are stripped by remark
  // The HTML elements should not be present in the rendered output
  // We verify by checking no script or img roles/elements exist
  const scriptCount = await component.locator('script').count()
  const imgCount = await component.locator('img').count()
  expect(scriptCount).toBe(0)
  expect(imgCount).toBe(0)
})
