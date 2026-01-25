import { test, expect } from "@playwright/experimental-ct-react";
import type { ComponentFixtures } from "@playwright/experimental-ct-react";
import { MemoryRouter } from "react-router-dom";
import { PostList } from "@/components/PostList";
import type { PostMetadata } from "@/utils/posts";

const mockPosts: PostMetadata[] = [
  {
    slug: "first-post",
    title: "First Post",
    date: "2022-12-01",
  },
  {
    slug: "second-post",
    title: "Second Post",
    date: "2022-11-30",
  },
];

const mountPostList = async (mount: ComponentFixtures["mount"], posts: PostMetadata[]) => {
  return await mount(
    <MemoryRouter>
      <PostList posts={posts} />
    </MemoryRouter>,
  );
};

test("should render posts list when posts are provided", async ({ mount }) => {
  const component = await mountPostList(mount, mockPosts);

  // The PostList should render links for the provided posts
  const firstLink = component.getByRole("link", { name: "First Post" });
  await expect(firstLink).toBeVisible();
});

test("should render post items with titles and dates", async ({ mount }) => {
  const component = await mountPostList(mount, mockPosts);

  await expect(component.getByRole("link", { name: "First Post" })).toBeVisible();
  await expect(component.getByRole("link", { name: "Second Post" })).toBeVisible();
});

test('should render "No posts found." when posts array is empty', async ({ mount }) => {
  const component = await mountPostList(mount, []);

  await expect(component.getByText("No posts found.")).toBeVisible();
});

test("should render post links with correct hrefs", async ({ mount }) => {
  const component = await mountPostList(mount, mockPosts);

  await expect(component.getByRole("link", { name: "First Post" })).toHaveAttribute(
    "href",
    "/posts/first-post",
  );
  await expect(component.getByRole("link", { name: "Second Post" })).toHaveAttribute(
    "href",
    "/posts/second-post",
  );
});
