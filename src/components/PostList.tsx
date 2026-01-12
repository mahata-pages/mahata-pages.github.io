import { Link } from 'react-router-dom'
import type { PostMetadata } from '@/utils/posts'
import './PostList.css'

type PostListProps = Readonly<{
  posts: PostMetadata[]
}>

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p>No posts found.</p>
  }

  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.slug} className="post-list-item">
          <Link to={`/posts/${post.slug}`} className="post-link">
            {post.title}
          </Link>
          <time className="post-date" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </li>
      ))}
    </ul>
  )
}
