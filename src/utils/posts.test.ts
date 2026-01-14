import { describe, it, expect, vi } from 'vitest'
import { extractPostsMetadata } from './posts'
import { createFixtureModule, loadFixture } from './test-helpers'

describe('extractPostsMetadata', () => {
  describe('correct parsing of front matter', () => {
    it('should correctly parse valid front matter with title and date', async () => {
      const modules = {
        '../../posts/test-post.md': createFixtureModule('valid-post.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-15',
      })
    })

    it('should parse front matter with unquoted values', async () => {
      const modules = {
        '../../posts/simple.md': createFixtureModule('simple-post.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Simple Title')
      expect(result[0].date).toBe('2024-01-15')
    })

    it('should handle front matter with special characters', async () => {
      const modules = {
        '../../posts/special.md': createFixtureModule('special-chars-post.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Title with "quotes" and symbols: & < >')
    })

    it('should handle front matter with unicode characters', async () => {
      const modules = {
        '../../posts/unicode.md': createFixtureModule('unicode-post.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('International Title with Ümläuts and Émojis')
    })
  })

  describe('handling of missing front matter', () => {
    it('should skip posts without front matter', async () => {
      const modules = {
        '../../posts/no-front-matter.md': createFixtureModule('no-front-matter.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(0)
    })

    it('should skip posts with incomplete front matter (missing closing ---)', async () => {
      const modules = {
        '../../posts/incomplete.md': createFixtureModule('incomplete-front-matter.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(0)
    })

    it('should skip posts with empty content', async () => {
      const modules = {
        '../../posts/empty.md': createFixtureModule('empty.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(0)
    })

    it('should skip posts missing title', async () => {
      const modules = {
        '../../posts/no-title.md': createFixtureModule('no-title.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(0)
    })

    it('should skip posts missing date', async () => {
      const modules = {
        '../../posts/no-date.md': createFixtureModule('no-date.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(0)
    })
  })

  describe('handling of malformed YAML', () => {
    it('should handle invalid YAML and log error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const modules = {
        '../../posts/bad-yaml.md': createFixtureModule('bad-yaml.md'),
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
        '../../posts/invalid.md': createFixtureModule('invalid-yaml.md'),
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
        '../../posts/my-blog-post.md': createFixtureModule('standard-path-post.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result[0].slug).toBe('my-blog-post')
    })

    it('should extract slug from path with date prefix', async () => {
      const modules = {
        '../../posts/2024-01-15-new-post.md': createFixtureModule('2024-01-15-new-post.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result[0].slug).toBe('2024-01-15-new-post')
    })

    it('should handle different path depths', async () => {
      const modules = {
        '../posts/simple.md': createFixtureModule('simple-post.md'),
        '/absolute/path/posts/absolute.md': createFixtureModule('valid-post.md'),
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
            default: loadFixture('valid-post.md'),
          }),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(0)
    })
  })

  describe('date-based sorting (newest first)', () => {
    it('should sort posts by date with newest first', async () => {
      const modules = {
        '../../posts/old.md': createFixtureModule('old-post.md'),
        '../../posts/new.md': createFixtureModule('new-post.md'),
        '../../posts/middle.md': createFixtureModule('middle-post.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(3)
      expect(result[0].title).toBe('New Post')
      expect(result[1].title).toBe('Middle Post')
      expect(result[2].title).toBe('Old Post')
    })

    it('should handle posts with same date', async () => {
      const modules = {
        '../../posts/first.md': createFixtureModule('valid-post.md'),
        '../../posts/second.md': createFixtureModule('simple-post.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(2)
      // Both posts should have the same date
      expect(result[0].date).toBe('2024-01-15')
      expect(result[1].date).toBe('2024-01-15')
    })

    it('should handle different date formats correctly', async () => {
      const modules = {
        '../../posts/iso.md': createFixtureModule('iso-date-post.md'),
        '../../posts/simple.md': createFixtureModule('simple-date-post.md'),
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
        '../../posts/valid.md': createFixtureModule('valid-post-1.md'),
        '../../posts/invalid.md': createFixtureModule('invalid-post.md'),
        '../../posts/another-valid.md': createFixtureModule('valid-post-2.md'),
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
        '../../posts/valid.md': createFixtureModule('valid-post.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Test Post')
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
        '../../posts/windows.md': createFixtureModule('windows-crlf.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Windows Post')
    })

    it('should handle front matter with extra whitespace', async () => {
      const modules = {
        '../../posts/whitespace.md': createFixtureModule('whitespace-post.md'),
      }

      const result = await extractPostsMetadata(modules)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Whitespace Post')
    })

    it('should handle front matter with additional fields', async () => {
      const modules = {
        '../../posts/extra-fields.md': createFixtureModule('extra-fields.md'),
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
      
      // Create 100 test posts dynamically (not using fixtures for performance test)
      for (let i = 0; i < 100; i++) {
        const dayOfMonth = String((i % 28) + 1).padStart(2, '0')
        modules[`../../posts/post-${i}.md`] = () =>
          Promise.resolve({
            default: `---
title: Post ${i}
date: 2024-01-${dayOfMonth}
---

Content for post ${i}`,
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
