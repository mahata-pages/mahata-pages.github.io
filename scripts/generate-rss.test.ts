import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readdir, readFile, writeFile, mkdir, rm } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import {
  extractFrontMatter,
  isValidFrontMatter,
  extractContentAfterFrontMatter,
} from "../src/utils/frontMatter.js";

interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
  filename: string;
}

async function extractPosts(postsDir: string): Promise<Post[]> {
  const files = await readdir(postsDir);
  const mdFiles = files.filter((f) => f.endsWith(".md"));
  const posts: Post[] = [];

  for (const filename of mdFiles) {
    try {
      const filePath = join(postsDir, filename);
      const content = await readFile(filePath, "utf-8");

      // Extract and validate front matter
      const frontMatter = extractFrontMatter(content);
      if (!isValidFrontMatter(frontMatter)) continue;

      // Extract slug from filename (e.g., 'my-post.md' -> 'my-post')
      const slug = filename.replace(".md", "");
      if (!slug) continue;

      // Extract content after front matter
      const postContent = extractContentAfterFrontMatter(content);

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

describe("RSS Feed Generation - extractPosts", () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join("/tmp", `test-rss-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    if (existsSync(testDir)) {
      await rm(testDir, { recursive: true, force: true });
    }
  });

  describe("valid posts", () => {
    it("should correctly parse valid posts with front matter", async () => {
      const validPost = `---
title: "Test Post"
date: "2024-01-15"
---

This is the post content.`;

      await writeFile(join(testDir, "test-post.md"), validPost);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(1);
      expect(posts[0]).toMatchObject({
        slug: "test-post",
        title: "Test Post",
        date: "2024-01-15",
        content: "This is the post content.",
      });
    });

    it("should extract content after front matter correctly", async () => {
      const postWithContent = `---
title: "Post Title"
date: "2024-01-15"
---

First paragraph.

Second paragraph with **markdown**.`;

      await writeFile(join(testDir, "content-post.md"), postWithContent);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(1);
      expect(posts[0].content).toBe("First paragraph.\n\nSecond paragraph with **markdown**.");
    });

    it("should handle posts with special characters in front matter", async () => {
      const specialCharsPost = `---
title: "Title with \\"quotes\\" and symbols: & < >"
date: "2024-01-15"
---

Content.`;

      await writeFile(join(testDir, "special.md"), specialCharsPost);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Title with "quotes" and symbols: & < >');
    });

    it("should handle posts with unicode characters", async () => {
      const unicodePost = `---
title: "International Title with Ümläuts and Émojis"
date: "2024-01-15"
---

Content.`;

      await writeFile(join(testDir, "unicode.md"), unicodePost);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe("International Title with Ümläuts and Émojis");
    });
  });

  describe("posts with missing front matter fields", () => {
    it("should skip posts with missing title", async () => {
      const noTitlePost = `---
date: "2024-01-15"
---

Content without title.`;

      await writeFile(join(testDir, "no-title.md"), noTitlePost);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(0);
    });

    it("should skip posts with missing date", async () => {
      const noDatePost = `---
title: "Post Without Date"
---

Content without date.`;

      await writeFile(join(testDir, "no-date.md"), noDatePost);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(0);
    });

    it("should skip posts with no front matter", async () => {
      const noFrontMatter = `# Just a title

This post has no front matter.`;

      await writeFile(join(testDir, "no-front-matter.md"), noFrontMatter);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(0);
    });

    it("should skip posts with incomplete front matter (missing closing ---)", async () => {
      const incompleteFrontMatter = `---
title: "Incomplete"
date: "2024-01-15"

Content without closing front matter delimiter.`;

      await writeFile(join(testDir, "incomplete.md"), incompleteFrontMatter);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(0);
    });
  });

  describe("posts with invalid YAML", () => {
    it("should handle posts with invalid YAML and log error", async () => {
      const invalidYaml = `---
title: "Bad YAML
date: [invalid
---

Content.`;

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await writeFile(join(testDir, "bad-yaml.md"), invalidYaml);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to parse post at"),
        expect.anything(),
      );

      consoleErrorSpy.mockRestore();
    });

    it("should continue processing when one post fails to parse", async () => {
      const validPost = `---
title: "Valid Post"
date: "2024-01-15"
---

Content.`;

      const invalidPost = `---
title: [invalid
---

Bad content.`;

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await writeFile(join(testDir, "valid-1.md"), validPost);
      await writeFile(join(testDir, "invalid.md"), invalidPost);
      await writeFile(join(testDir, "valid-2.md"), validPost);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(2);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to parse post at"),
        expect.anything(),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("invalid dates", () => {
    it("should handle invalid date formats", async () => {
      const invalidDatePost = `---
title: "Invalid Date"
date: "not-a-date"
---

Content.`;

      await writeFile(join(testDir, "invalid-date.md"), invalidDatePost);

      const posts = await extractPosts(testDir);

      // Post should be included - date validation happens during sorting
      expect(posts).toHaveLength(1);
      expect(posts[0].date).toBe("not-a-date");
    });

    it("should handle posts with various date formats", async () => {
      const isoDatePost = `---
title: "ISO Date"
date: "2024-01-15T10:00:00Z"
---

Content.`;

      const simpleDatePost = `---
title: "Simple Date"
date: "2024-01-10"
---

Content.`;

      await writeFile(join(testDir, "iso.md"), isoDatePost);
      await writeFile(join(testDir, "simple.md"), simpleDatePost);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(2);
      // ISO date should be newer and appear first
      expect(posts[0].title).toBe("ISO Date");
      expect(posts[1].title).toBe("Simple Date");
    });
  });

  describe("empty files", () => {
    it("should skip empty files", async () => {
      await writeFile(join(testDir, "empty.md"), "");

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(0);
    });

    it("should skip files with only whitespace", async () => {
      await writeFile(join(testDir, "whitespace.md"), "   \n\n  \n");

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(0);
    });
  });

  describe("proper sorting", () => {
    it("should sort posts by date with newest first", async () => {
      const oldPost = `---
title: "Old Post"
date: "2024-01-10"
---

Old content.`;

      const newPost = `---
title: "New Post"
date: "2024-01-20"
---

New content.`;

      const middlePost = `---
title: "Middle Post"
date: "2024-01-15"
---

Middle content.`;

      await writeFile(join(testDir, "old.md"), oldPost);
      await writeFile(join(testDir, "new.md"), newPost);
      await writeFile(join(testDir, "middle.md"), middlePost);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(3);
      expect(posts[0].title).toBe("New Post");
      expect(posts[1].title).toBe("Middle Post");
      expect(posts[2].title).toBe("Old Post");
    });

    it("should handle posts with same date", async () => {
      const post1 = `---
title: "Post 1"
date: "2024-01-15"
---

Content 1.`;

      const post2 = `---
title: "Post 2"
date: "2024-01-15"
---

Content 2.`;

      await writeFile(join(testDir, "post-1.md"), post1);
      await writeFile(join(testDir, "post-2.md"), post2);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(2);
      // Both posts should have the same date
      expect(posts[0].date).toBe("2024-01-15");
      expect(posts[1].date).toBe("2024-01-15");
    });

    it("should maintain sort order with many posts", async () => {
      // Create multiple posts with different dates
      for (let i = 1; i <= 10; i++) {
        const dayOfMonth = String(i).padStart(2, "0");
        const post = `---
title: "Post ${i}"
date: "2024-01-${dayOfMonth}"
---

Content ${i}.`;
        await writeFile(join(testDir, `post-${i}.md`), post);
      }

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(10);

      // Verify sorting - dates should be in descending order
      for (let i = 0; i < posts.length - 1; i++) {
        const date1 = new Date(posts[i].date).getTime();
        const date2 = new Date(posts[i + 1].date).getTime();
        expect(date1).toBeGreaterThanOrEqual(date2);
      }
    });
  });

  describe("edge cases", () => {
    it("should skip non-markdown files", async () => {
      const validPost = `---
title: "Valid Post"
date: "2024-01-15"
---

Content.`;

      await writeFile(join(testDir, "post.md"), validPost);
      await writeFile(join(testDir, "readme.txt"), "This is a text file");
      await writeFile(join(testDir, "image.png"), "fake-image-data");

      const posts = await extractPosts(testDir);

      // Should only process .md files
      expect(posts).toHaveLength(1);
      expect(posts[0].slug).toBe("post");
    });

    it("should handle directory with no markdown files", async () => {
      await writeFile(join(testDir, "readme.txt"), "This is a text file");
      await writeFile(join(testDir, "config.json"), "{}");

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(0);
    });

    it("should handle front matter with extra fields", async () => {
      const extraFieldsPost = `---
title: "Extra Fields"
date: "2024-01-15"
author: "Test Author"
tags: ["tag1", "tag2"]
---

Content.`;

      await writeFile(join(testDir, "extra-fields.md"), extraFieldsPost);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(1);
      expect(posts[0]).toMatchObject({
        slug: "extra-fields",
        title: "Extra Fields",
        date: "2024-01-15",
      });
    });

    it("should handle posts with Windows line endings (CRLF)", async () => {
      const windowsPost =
        '---\r\ntitle: "Windows Post"\r\ndate: "2024-01-15"\r\n---\r\n\r\nContent.';

      await writeFile(join(testDir, "windows.md"), windowsPost);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe("Windows Post");
    });

    it("should handle front matter with extra whitespace", async () => {
      const whitespacePost = `---
title:    "Whitespace Post"   
date:   "2024-01-15"  
---

Content.`;

      await writeFile(join(testDir, "whitespace.md"), whitespacePost);

      const posts = await extractPosts(testDir);

      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe("Whitespace Post");
    });
  });
});
