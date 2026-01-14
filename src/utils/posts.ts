import { parse } from 'yaml'

export type PostMetadata = {
  slug: string
  title: string
  date: string
}

export async function extractPostsMetadata(
  modules: Record<string, () => Promise<unknown>>,
): Promise<PostMetadata[]> {
  const posts: PostMetadata[] = []

  for (const [path, loadModule] of Object.entries(modules)) {
    try {
      const module = (await loadModule()) as { default: string }
      const content = module.default

      // Extract front matter YAML block
      const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/
      const frontMatterMatch = frontMatterRegex.exec(content)
      if (!frontMatterMatch) continue

      const frontMatter = parse(frontMatterMatch[1]) as {
        title?: string
        date?: string
      }
      if (!frontMatter.title || !frontMatter.date) continue

      // Extract slug from path (e.g., '../../posts/my-post.md' -> 'my-post')
      const slug = path.split('/').pop()?.replace('.md', '') || ''
      if (!slug) continue

      posts.push({
        slug,
        title: frontMatter.title,
        date: frontMatter.date,
      })
    } catch (error) {
      console.error(`Failed to parse post at ${path}:`, error)
    }
  }

  // Sort by date, newest first
  posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return posts
}
