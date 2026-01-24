import { Link } from "react-router-dom";
import type { PostMetadata } from "@/utils/posts";
import styles from "./PostList.module.css";

type PostListProps = Readonly<{
  posts: PostMetadata[];
}>;

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p>No posts found.</p>;
  }

  return (
    <ul className={styles.postList} aria-label="Posts">
      {posts.map((post) => (
        <li key={post.slug} className={styles.postListItem}>
          <Link to={`/posts/${post.slug}`} className={styles.postLink}>
            {post.title}
          </Link>
          <time className={styles.postDate} dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </li>
      ))}
    </ul>
  );
}
