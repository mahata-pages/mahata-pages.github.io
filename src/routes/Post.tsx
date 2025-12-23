import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { remark } from 'remark'
import html from 'remark-html'

type PostProps = Readonly<{
  baseDir?: 'posts' | 'posts-test'
}>

const prodPosts = import.meta.glob('../../posts/*.md', {
  query: '?raw',
  import: 'default',
})

const testPosts = import.meta.glob('../../posts-test/*.md', {
  query: '?raw',
  import: 'default',
})

export default function Post({ baseDir = 'posts' }: PostProps) {
  const { slug = '' } = useParams()
  const [markdown, setMarkdown] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    const posts = baseDir === 'posts-test' ? testPosts : prodPosts
    const postPath =
      baseDir === 'posts-test'
        ? `../../posts-test/${slug}.md`
        : `../../posts/${slug}.md`

    const loadPost = posts[postPath]

    let isCancelled = false

    Promise.resolve()
      .then(() => {
        if (!loadPost) {
          return null
        }
        return loadPost()
      })
      .then((content) => {
        if (!isCancelled) {
          setMarkdown(content as string | null)
        }
      })
      .catch((error) => {
        console.error('Error loading post:', error)
        if (!isCancelled) {
          setMarkdown(null)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [baseDir, slug])

  const renderedHtml = useMemo(() => {
    if (markdown === undefined || markdown === null) return ''
    try {
      const processed = remark().use(html).processSync(markdown)
      return String(processed)
    } catch (error) {
      console.error('Error processing markdown:', error)
      return '<p>Error rendering post content.</p>'
    }
  }, [markdown])

  if (markdown === undefined) {
    return (
      <div role="status" aria-live="polite">
        <p>Loading...</p>
      </div>
    )
  }

  if (markdown === null) {
    return (
      <div>
        <p>Post not found.</p>
        <p>
          <Link to="/">Back home</Link>
        </p>
      </div>
    )
  }

  return (
    <article dangerouslySetInnerHTML={{ __html: renderedHtml }} />
  )
}
