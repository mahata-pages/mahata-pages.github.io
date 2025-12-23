import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { remark } from 'remark'
import html from 'remark-html'

const postLoaders = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../posts/*.md', {
      query: '?raw',
      import: 'default',
      eager: false,
    }),
  ).map(([path, loader]) => {
    const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? ''
    return [slug, loader as () => Promise<string>]
  }),
)

export default function Post() {
  const { slug = '' } = useParams()
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let isCancelled = false

    const loadPost = async () => {
      setLoading(true)
      setNotFound(false)
      setMarkdown(null)
      
      const loader = postLoaders[slug]
      if (!loader) {
        if (!isCancelled) {
          setNotFound(true)
          setLoading(false)
        }
        return
      }

      try {
        const content = await loader()
        if (!isCancelled) {
          setMarkdown(content)
        }
      } catch (error) {
        console.error('Error loading post:', error)
        if (!isCancelled) {
          setNotFound(true)
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    loadPost()

    return () => {
      isCancelled = true
    }
  }, [slug])

  const renderedHtml = useMemo(() => {
    if (markdown === null) return ''
    try {
      const processed = remark().use(html).processSync(markdown)
      return String(processed)
    } catch (error) {
      console.error('Error processing markdown:', error)
      return '<p>Error rendering post content.</p>'
    }
  }, [markdown])

  if (loading) {
    return <div>Loading...</div>
  }

  if (notFound) {
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
