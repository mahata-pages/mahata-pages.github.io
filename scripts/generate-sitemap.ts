import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { extractFrontMatter, isValidFrontMatter } from "../src/utils/frontMatter.js";

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: number;
}

const SITE_URL = process.env.SITE_URL || "https://blog.mahata.org";
const POSTS_DIR = join(process.cwd(), "posts");
const OUTPUT_DIR = join(process.cwd(), "public");
const OUTPUT_FILE = join(OUTPUT_DIR, "sitemap.xml");

async function extractPostEntries(): Promise<SitemapEntry[]> {
  const files = await readdir(POSTS_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));
  const entries: SitemapEntry[] = [];

  for (const filename of mdFiles) {
    try {
      const filePath = join(POSTS_DIR, filename);
      const content = await readFile(filePath, "utf-8");

      // Extract and validate front matter
      const frontMatter = extractFrontMatter(content);
      if (!isValidFrontMatter(frontMatter)) continue;

      // Extract slug from filename (e.g., 'my-post.md' -> 'my-post')
      const slug = filename.replace(".md", "");
      if (!slug) continue;

      entries.push({
        loc: `${SITE_URL}/posts/${slug}`,
        lastmod: frontMatter.date,
        changefreq: "monthly",
        priority: 0.7,
      });
    } catch (error) {
      console.error(`Failed to parse post at ${filename}:`, error);
    }
  }

  // Sort by date, newest first
  entries.sort((a, b) => {
    if (!a.lastmod || !b.lastmod) return 0;
    return new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime();
  });

  return entries;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateSitemapXml(entries: SitemapEntry[]): string {
  const urlElements = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ""}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(SITE_URL)}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${urlElements}
</urlset>
`;
}

async function main(): Promise<void> {
  try {
    console.log(`Generating sitemap from ${POSTS_DIR}...`);
    const entries = await extractPostEntries();
    console.log(`Found ${entries.length} posts`);
    const xml = generateSitemapXml(entries);
    await writeFile(OUTPUT_FILE, xml);
    console.log(`✓ Sitemap generated: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    process.exit(1);
  }
}

main();
