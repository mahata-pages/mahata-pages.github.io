import { use, Suspense, useMemo } from 'react'
import { Header } from '@/Header'
import { PostList } from '@/components/PostList'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { extractPostsMetadata } from '@/utils/posts'
import { postsModules } from '@/utils/postsModules'

function PostsContent() {
  const postsPromise = useMemo(() => extractPostsMetadata(postsModules), [])
  const posts = use(postsPromise)
  return <PostList posts={posts} />
}

function App() {
  return (
    <>
      <Header />
      <main>
        <h1>Posts</h1>
        <ErrorBoundary>
          <Suspense fallback={<p>Loading posts...</p>}>
            <PostsContent />
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  )
}

export default App
