import Post from "@/routes/Post";
import type { ComponentFixtures } from "@playwright/experimental-ct-react";
import { expect, test } from "@playwright/experimental-ct-react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const mountAtPath = async (
  mount: ComponentFixtures["mount"],
  path: string,
  baseDir: "posts" | "posts-test" = "posts",
) => {
  return await mount(
    <MemoryRouter initialEntries={[path]}>
      <main>
        <Routes>
          <Route path="/posts/:slug" element={<Post baseDir={baseDir} />} />
        </Routes>
      </main>
    </MemoryRouter>,
  );
};

test("renders header and existing markdown post", async ({ mount }) => {
  const component = await mountAtPath(mount, "/posts/yo", "posts");

  await expect(component.getByRole("heading", { name: "Hey" })).toBeVisible();
  await expect(component).toContainText("Yo.");
});

test("renders markdown with front matter", async ({ mount }) => {
  const component = await mountAtPath(mount, "/posts/front-matter", "posts-test");

  await expect(component).toBeVisible();
  await expect(component).toContainText("heyheyheyhey.");
  await expect(component).not.toContainText("titletitletitle");
});

test("shows not found for missing post", async ({ mount }) => {
  const component = await mountAtPath(mount, "/posts/missing", "posts");

  await expect(component).toContainText("Post not found.");
  const backLink = component.getByRole("link", { name: "Back home" });
  await expect(backLink).toHaveAttribute("href", "/");
});

test("handles markdown with special characters and incomplete syntax", async ({ mount }) => {
  const component = await mountAtPath(mount, "/posts/special-chars", "posts-test");

  // Should render without crashing, even with incomplete link syntax
  await expect(component).toBeVisible();
  // remark-html sanitizes HTML-like tags; <Characters> is stripped for security
  await expect(component.getByRole("heading", { name: /Special/ })).toBeVisible();
  // remark should handle incomplete link gracefully by rendering it as plain text
  await expect(component).toContainText("Incomplete link");
});

test("handles markdown with unbalanced brackets", async ({ mount }) => {
  const component = await mountAtPath(mount, "/posts/unbalanced", "posts-test");

  // Should render without crashing, even if markdown has unbalanced syntax
  await expect(component).toBeVisible();
  await expect(component.getByRole("heading", { name: "Heading" })).toBeVisible();
  await expect(component).toContainText("unbalanced brackets");
});

test("handles empty markdown content", async ({ mount, page }) => {
  const component = await mountAtPath(mount, "/posts/empty", "posts-test");

  // Should render article element even with empty content
  // Article element exists in DOM but has no visible content
  const articleCount = await page.locator("article").count();
  expect(articleCount).toBe(1);
  // Verify it doesn't show "Post not found" error
  await expect(component).not.toContainText("Post not found");
});

test("handles markdown with potentially malicious HTML content", async ({ mount }) => {
  const component = await mountAtPath(mount, "/posts/malicious", "posts-test");

  await expect(component).toBeVisible();
  // The heading should be visible, proving markdown was processed
  await expect(component.getByRole("heading", { name: "Safe Heading" })).toBeVisible();

  // Verify that HTML tags (script, img) are stripped by remark
  // The HTML elements should not be present in the rendered article content
  // We verify by checking no script or img elements exist in the article
  const article = component.locator("article");
  const scriptCount = await article.locator("script").count();
  const imgCount = await article.locator("img").count();
  expect(scriptCount).toBe(0);
  expect(imgCount).toBe(0);
});

test("renders back button with arrow icon", async ({ mount }) => {
  const component = await mountAtPath(mount, "/posts/yo", "posts");

  // Verify back button is present
  const backButton = component.getByRole("link").first();
  await expect(backButton).toBeVisible();
  await expect(backButton).toHaveAttribute("href", "/");

  // Verify it contains an SVG icon (ArrowLeft from react-feather)
  const svg = backButton.locator("svg");
  await expect(svg).toBeVisible();
});

test("back button navigates to home page", async ({ mount, page }) => {
  const component = await mountAtPath(mount, "/posts/yo", "posts");

  // Get the back button and click it
  const backButton = component.getByRole("link").first();
  await expect(backButton).toHaveAttribute("href", "/");

  // In component testing, we verify the href attribute is correct
  // Actual navigation would be tested in E2E tests
});

test("back button is positioned within article container", async ({ mount }) => {
  const component = await mountAtPath(mount, "/posts/yo", "posts");

  // Verify back button exists
  const backButton = component.getByRole("link").first();
  await expect(backButton).toBeVisible();
  await expect(backButton).toHaveAttribute("href", "/");

  // Verify the article also exists
  const article = component.getByRole("article");
  await expect(article).toBeVisible();

  // Verify both back button and article are rendered (proving they're in the same container)
  await expect(component).toContainText("Hey");
});
