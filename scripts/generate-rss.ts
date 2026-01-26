import { Feed } from "feed";
import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { parse } from "yaml";

interface PostFrontMatter {
  title?: string;
  date?: string;
}

interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
  filename: string;
}

const SITE_URL = process.env.SITE_URL || "https://blog.mahata.or";
const POSTS_DIR = join(process.cwd(), "posts");
const OUTPUT_DIR = join(process.cwd(), "public");
const OUTPUT_FILE = join(OUTPUT_DIR, "rss.xml");

async function extractPosts(): Promise<Post[]> {
  const files = await readdir(POSTS_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));
  const posts: Post[] = [];

  for (const filename of mdFiles) {
    try {
      const filePath = join(POSTS_DIR, filename);
      const content = await readFile(filePath, "utf-8");

      // Extract front matter YAML block
      const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
      const frontMatterMatch = frontMatterRegex.exec(content);
      if (!frontMatterMatch) continue;

      const frontMatter = parse(frontMatterMatch[1]) as PostFrontMatter;
      if (!frontMatter.title || !frontMatter.date) continue;

      // Extract slug from filename (e.g., 'my-post.md' -> 'my-post')
      const slug = filename.replace(".md", "");
      if (!slug) continue;

      // Extract content after front matter
      const contentStart = frontMatterMatch[0].length;
      const postContent = content.substring(contentStart).trim();

      posts.push({
        slug,
        title: frontMatter.title,
        date: frontMatter.date,
        content: postContent,
        filename,
      });
    } catch (error) {
      console.error(`Failed to parse post at ${filename}:`, error);
    }
  }

  // Sort by date, newest first
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

async function generateRssFeed(posts: Post[]): Promise<void> {
  const feed = new Feed({
    title: "mahata.or blog",
    description: "A blog about software engineering, programming, and life",
    id: SITE_URL,
    link: SITE_URL,
    language: "en",
    copyright: `© ${new Date().getFullYear()} mahata.or`,
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/posts/${post.slug}`,
      link: `${SITE_URL}/posts/${post.slug}`,
      description: post.content,
      date: new Date(post.date),
      published: new Date(post.date),
    });
  }

  await writeFile(OUTPUT_FILE, feed.rss2());
  console.log(`✓ RSS feed generated: ${OUTPUT_FILE}`);
}

async function main(): Promise<void> {
  try {
    console.log(`Generating RSS feed from ${POSTS_DIR}...`);
    const posts = await extractPosts();
    console.log(`Found ${posts.length} posts`);
    await generateRssFeed(posts);
  } catch (error) {
    console.error("Failed to generate RSS feed:", error);
    process.exit(1);
  }
}

main();
