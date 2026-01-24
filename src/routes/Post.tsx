import { Suspense, use, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { remark } from 'remark'
import html from 'remark-html'
import frontmatter from 'remark-frontmatter'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import styles from './Post.module.css'

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
  return (
    <ErrorBoundary fallback={<NotFound />}>
      <Suspense fallback={<Loading />}>
        <PostContent baseDir={baseDir} slug={slug} />
      </Suspense>
    </ErrorBoundary>
  )
}

function PostContent({
  baseDir,
  slug,
}: PostProps & { slug: string }) {
  const posts = baseDir === 'posts-test' ? testPosts : prodPosts
  const postPath =
    baseDir === 'posts-test'
      ? `../../posts-test/${slug}.md`
      : `../../posts/${slug}.md`

  const loadPost = posts[postPath]

  if (!slug) {
    throw new Error('Post slug is missing')
  }

  if (!loadPost) {
    throw new Error('Post not found')
  }

  const markdown = use(loadPost()) as string

  const renderedHtml = useMemo(() => {
    try {
      const processed = remark()
        .use(frontmatter)
        .use(html)
        .processSync(markdown)
      return String(processed)
    } catch (error) {
      console.error('Error processing markdown:', error)
      return '<p>Error rendering post content.</p>'
    }
  }, [markdown])

  return (
    <article className={styles.article} dangerouslySetInnerHTML={{ __html: renderedHtml }} />
  )
}

function Loading() {
  return (
    <article className={styles.article} role="status" aria-live="polite">
      <p>Loading...</p>
    </article>
  )
}

function NotFound() {
  return (
    <div>
      <p>Post not found.</p>
      <p>
        <Link to="/">Back home</Link>
      </p>
    </div>
  )
}
