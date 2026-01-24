import { use, Suspense, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PostList } from '@/components/PostList'
import { Pagination } from '@/components/Pagination'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { extractPostsMetadata } from '@/utils/posts'
import { postsModules } from '@/utils/postsModules'

const POSTS_PER_PAGE = 10

function PostsContent() {
  const postsPromise = useMemo(() => extractPostsMetadata(postsModules), [])
  const posts = use(postsPromise)
  const [searchParams] = useSearchParams()

  const pageParam = searchParams.get('page')
  const currentPage = Math.max(1, Number.parseInt(pageParam || '1', 10))

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const validPage = Math.min(currentPage, totalPages || 1)

  const startIndex = (validPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const paginatedPosts = posts.slice(startIndex, endIndex)

  return (
    <>
      <PostList posts={paginatedPosts} />
      <Pagination currentPage={validPage} totalPages={totalPages} />
    </>
  )
}

export function Home() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<p>Loading posts...</p>}>
        <PostsContent />
      </Suspense>
    </ErrorBoundary>
  )
}
