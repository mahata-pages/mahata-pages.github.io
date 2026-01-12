import { useEffect, useState } from 'react'
import { Header } from '@/Header'
import { PostList } from '@/components/PostList'
import type { PostMetadata } from '@/utils/posts'
import { extractPostsMetadata } from '@/utils/posts'

const postsModules = import.meta.glob('../../posts/*.md', {
  query: '?raw',
  import: 'default',
})

function App() {
  const [posts, setPosts] = useState<PostMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    extractPostsMetadata(postsModules)
      .then(setPosts)
      .catch((error) => console.error('Failed to load posts:', error))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <>
      <Header />
      <main>
        <h1>Posts</h1>
        {isLoading ? <p>Loading posts...</p> : <PostList posts={posts} />}
      </main>
    </>
  )
}

export default App
