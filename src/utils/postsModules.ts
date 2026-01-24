// Automatically import all markdown files as raw strings (front matter parsing expects raw content)
const posts = import.meta.glob("../../posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const postsModules: Record<string, () => Promise<{ default: string }>> = Object.fromEntries(
  Object.entries(posts).map(([key, value]) => [key, () => Promise.resolve({ default: value })]),
);
