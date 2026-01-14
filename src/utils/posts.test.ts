import { describe, it, expect, vi } from 'vitest'
import { extractPostsMetadata } from './posts'

describe('extractPostsMetadata', () => {
  describe('correct parsing of front matter', () => {
    it('should correctly parse valid front matter with title and date', async () => {
      const modules = {
        '../../posts/test-post.md': () =>
          Promise.resolve({
            default: `---
title: 'Test Post'
date: '2024-01-15'
---

Post content here.`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-15',
      })
    })

    it('should parse front matter without quotes', async () => {
      const modules = {
        '../../posts/simple.md': () =>
          Promise.resolve({
            default: `---
title: Simple Title
date: 2024-01-15
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Simple Title')
      expect(result[0].date).toBe('2024-01-15')
    })

    it('should handle front matter with special characters', async () => {
      const modules = {
        '../../posts/special.md': () =>
          Promise.resolve({
            default: `---
title: 'Title with "quotes" and symbols: & < >'
date: '2024-01-15'
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Title with "quotes" and symbols: & < >')
    })

    it('should handle front matter with unicode characters', async () => {
      const modules = {
        '../../posts/unicode.md': () =>
          Promise.resolve({
            default: `---
title: '大企業内の小規模チームでのお仕事'
date: '2024-01-15'
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('大企業内の小規模チームでのお仕事')
    })
  })

  describe('handling of missing front matter', () => {
    it('should skip posts without front matter', async () => {
      const modules = {
        '../../posts/no-front-matter.md': () =>
          Promise.resolve({
            default: `# Just a heading

Content without front matter.`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(0)
    })

    it('should skip posts with incomplete front matter (missing closing ---)', async () => {
      const modules = {
        '../../posts/incomplete.md': () =>
          Promise.resolve({
            default: `---
title: 'Incomplete'
date: '2024-01-15'

Content without closing delimiter`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(0)
    })

    it('should skip posts with empty content', async () => {
      const modules = {
        '../../posts/empty.md': () =>
          Promise.resolve({
            default: '',
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(0)
    })

    it('should skip posts missing title', async () => {
      const modules = {
        '../../posts/no-title.md': () =>
          Promise.resolve({
            default: `---
date: '2024-01-15'
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(0)
    })

    it('should skip posts missing date', async () => {
      const modules = {
        '../../posts/no-date.md': () =>
          Promise.resolve({
            default: `---
title: 'No Date Post'
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(0)
    })
  })

  describe('handling of malformed YAML', () => {
    it('should handle invalid YAML and log error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const modules = {
        '../../posts/bad-yaml.md': () =>
          Promise.resolve({
            default: `---
title: 'Bad YAML
date: '2024-01-15'
invalid: [unclosed bracket
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(0)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to parse post at'),
        expect.anything()
      )

      consoleErrorSpy.mockRestore()
    })

    it('should handle YAML with invalid structure', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const modules = {
        '../../posts/invalid.md': () =>
          Promise.resolve({
            default: `---
: invalid
:: double colons
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      // Should either skip or handle gracefully
      expect(result).toHaveLength(0)

      consoleErrorSpy.mockRestore()
    })
  })

  describe('slug extraction from file paths', () => {
    it('should extract slug from standard path', async () => {
      const modules = {
        '../../posts/my-blog-post.md': () =>
          Promise.resolve({
            default: `---
title: 'My Blog Post'
date: '2024-01-15'
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result[0].slug).toBe('my-blog-post')
    })

    it('should extract slug from path with date prefix', async () => {
      const modules = {
        '../../posts/2024-01-15-new-post.md': () =>
          Promise.resolve({
            default: `---
title: 'New Post'
date: '2024-01-15'
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result[0].slug).toBe('2024-01-15-new-post')
    })

    it('should handle different path depths', async () => {
      const modules = {
        '../posts/simple.md': () =>
          Promise.resolve({
            default: `---
title: 'Simple'
date: '2024-01-15'
---

Content`,
          }),
        '/absolute/path/posts/absolute.md': () =>
          Promise.resolve({
            default: `---
title: 'Absolute'
date: '2024-01-14'
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(2)
      expect(result.map(p => p.slug)).toContain('simple')
      expect(result.map(p => p.slug)).toContain('absolute')
    })

    it('should skip posts with invalid paths (no filename)', async () => {
      const modules = {
        '../../posts/': () =>
          Promise.resolve({
            default: `---
title: 'No File'
date: '2024-01-15'
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(0)
    })
  })

  describe('date-based sorting (newest first)', () => {
    it('should sort posts by date with newest first', async () => {
      const modules = {
        '../../posts/old.md': () =>
          Promise.resolve({
            default: `---
title: 'Old Post'
date: '2022-01-01'
---

Content`,
          }),
        '../../posts/new.md': () =>
          Promise.resolve({
            default: `---
title: 'New Post'
date: '2024-12-31'
---

Content`,
          }),
        '../../posts/middle.md': () =>
          Promise.resolve({
            default: `---
title: 'Middle Post'
date: '2023-06-15'
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(3)
      expect(result[0].title).toBe('New Post')
      expect(result[1].title).toBe('Middle Post')
      expect(result[2].title).toBe('Old Post')
    })

    it('should handle posts with same date', async () => {
      const modules = {
        '../../posts/first.md': () =>
          Promise.resolve({
            default: `---
title: 'First'
date: '2024-01-15'
---

Content`,
          }),
        '../../posts/second.md': () =>
          Promise.resolve({
            default: `---
title: 'Second'
date: '2024-01-15'
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(2)
      // Both posts should have the same date
      expect(result[0].date).toBe('2024-01-15')
      expect(result[1].date).toBe('2024-01-15')
    })

    it('should handle different date formats correctly', async () => {
      const modules = {
        '../../posts/iso.md': () =>
          Promise.resolve({
            default: `---
title: 'ISO Date'
date: '2024-01-15T10:00:00Z'
---

Content`,
          }),
        '../../posts/simple.md': () =>
          Promise.resolve({
            default: `---
title: 'Simple Date'
date: '2024-01-14'
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('ISO Date')
      expect(result[1].title).toBe('Simple Date')
    })
  })

  describe('error handling for invalid YAML', () => {
    it('should continue processing other posts when one has invalid YAML', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const modules = {
        '../../posts/valid.md': () =>
          Promise.resolve({
            default: `---
title: 'Valid Post'
date: '2024-01-15'
---

Content`,
          }),
        '../../posts/invalid.md': () =>
          Promise.resolve({
            default: `---
title: 'Invalid
date: unquoted string with : colon
---

Content`,
          }),
        '../../posts/another-valid.md': () =>
          Promise.resolve({
            default: `---
title: 'Another Valid'
date: '2024-01-14'
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(2)
      expect(result.map(p => p.title)).toContain('Valid Post')
      expect(result.map(p => p.title)).toContain('Another Valid')
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it('should handle module loading errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const modules = {
        '../../posts/error.md': () => Promise.reject(new Error('Failed to load module')),
        '../../posts/valid.md': () =>
          Promise.resolve({
            default: `---
title: 'Valid Post'
date: '2024-01-15'
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Valid Post')
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to parse post at'),
        expect.anything()
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('edge cases', () => {
    it('should handle empty modules object', async () => {
      const result = await extractPostsMetadata({})

      expect(result).toHaveLength(0)
    })

    it('should handle front matter with Windows line endings (CRLF)', async () => {
      const modules = {
        '../../posts/windows.md': () =>
          Promise.resolve({
            default: `---\r\ntitle: 'Windows Post'\r\ndate: '2024-01-15'\r\n---\r\n\r\nContent`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Windows Post')
    })

    it('should handle front matter with extra whitespace', async () => {
      const modules = {
        '../../posts/whitespace.md': () =>
          Promise.resolve({
            default: `---
title:    'Whitespace Post'   
date:     '2024-01-15'    
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Whitespace Post')
    })

    it('should handle front matter with additional fields', async () => {
      const modules = {
        '../../posts/extra-fields.md': () =>
          Promise.resolve({
            default: `---
title: 'Extra Fields'
date: '2024-01-15'
author: 'John Doe'
tags: ['test', 'demo']
---

Content`,
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        slug: 'extra-fields',
        title: 'Extra Fields',
        date: '2024-01-15',
      })
    })

    it('should handle multiple posts efficiently', async () => {
      const modules: Record<string, () => Promise<{ default: string }>> = {}
      
      // Create 100 test posts
      for (let i = 0; i < 100; i++) {
        modules[`../../posts/post-${i}.md`] = () =>
          Promise.resolve({
            default: `---
title: 'Post ${i}'
date: '2024-01-${String(i % 28 + 1).padStart(2, '0')}'
---

Content ${i}`,
          })
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(100)
      // Verify sorting
      for (let i = 0; i < result.length - 1; i++) {
        const date1 = new Date(result[i].date).getTime()
        const date2 = new Date(result[i + 1].date).getTime()
        expect(date1).toBeGreaterThanOrEqual(date2)
      }
    })
  })
})
