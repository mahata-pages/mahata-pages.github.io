import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { remark } from 'remark'
import html from 'remark-html'

const posts = import.meta.glob('../../posts/*.md', {
  query: '?raw',
  import: 'default',
})

export default function Post() {
  const { slug = '' } = useParams()
  const [markdown, setMarkdown] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    const postPath = `../../posts/${slug}.md`
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
  }, [slug])

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
    return <p>Loading...</p>
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
