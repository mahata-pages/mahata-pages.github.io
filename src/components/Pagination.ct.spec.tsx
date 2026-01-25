import { test, expect } from "@playwright/experimental-ct-react";
import type { ComponentFixtures } from "@playwright/experimental-ct-react";
import { MemoryRouter } from "react-router-dom";
import { Pagination } from "@/components/Pagination";

const mountPagination = async (
  mount: ComponentFixtures["mount"],
  currentPage: number,
  totalPages: number,
  initialPath = "/",
) => {
  return await mount(
    <MemoryRouter initialEntries={[initialPath]}>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </MemoryRouter>,
  );
};

test("should not render when totalPages is 1", async ({ mount }) => {
  const component = await mountPagination(mount, 1, 1);

  await expect(component.locator(".pagination")).not.toBeVisible();
});

test("should not render when totalPages is 0", async ({ mount }) => {
  const component = await mountPagination(mount, 1, 0);

  await expect(component.locator(".pagination")).not.toBeVisible();
});

test("should render pagination navigation", async ({ mount }) => {
  const component = await mountPagination(mount, 2, 3);

  // Verify pagination renders with expected links
  await expect(component.getByRole("link", { name: "← Previous" })).toBeVisible();
  await expect(component.getByRole("link", { name: "Next →" })).toBeVisible();
  await expect(component.getByRole("link", { name: "1" })).toBeVisible();
  await expect(component.getByRole("link", { name: "3" })).toBeVisible();
});

test("should render all page numbers", async ({ mount }) => {
  const component = await mountPagination(mount, 2, 5);

  // Check that all 5 page numbers are rendered - page 1 and 3-5 are links, page 2 is current (span)
  await expect(component.getByRole("link", { name: "1" })).toBeVisible();
  await expect(component.locator('[aria-current="page"]', { hasText: "2" })).toBeVisible();
  await expect(component.getByRole("link", { name: "3" })).toBeVisible();
  await expect(component.getByRole("link", { name: "4" })).toBeVisible();
  await expect(component.getByRole("link", { name: "5" })).toBeVisible();
});

test("should highlight current page with aria-current", async ({ mount }) => {
  const component = await mountPagination(mount, 3, 5);

  const currentPage = component.locator('[aria-current="page"]');
  await expect(currentPage).toBeVisible();
  await expect(currentPage).toHaveText("3");
  await expect(currentPage).toHaveClass(/paginationCurrent/);
});

test("should not show Previous link on first page", async ({ mount }) => {
  const component = await mountPagination(mount, 1, 5);

  await expect(component.getByRole("link", { name: "← Previous" })).not.toBeVisible();
});

test("should show Previous link on pages after first", async ({ mount }) => {
  const component = await mountPagination(mount, 2, 5);

  const prevLink = component.getByRole("link", { name: "← Previous" });
  await expect(prevLink).toBeVisible();
  await expect(prevLink).toHaveAttribute("href", "/?page=1");
});

test("should not show Next link on last page", async ({ mount }) => {
  const component = await mountPagination(mount, 5, 5);

  await expect(component.getByRole("link", { name: "Next →" })).not.toBeVisible();
});

test("should show Next link on pages before last", async ({ mount }) => {
  const component = await mountPagination(mount, 2, 5);

  const nextLink = component.getByRole("link", { name: "Next →" });
  await expect(nextLink).toBeVisible();
  await expect(nextLink).toHaveAttribute("href", "/?page=3");
});

test("should generate correct page links", async ({ mount }) => {
  const component = await mountPagination(mount, 1, 3);

  await expect(component.getByRole("link", { name: "2" })).toHaveAttribute("href", "/?page=2");
  await expect(component.getByRole("link", { name: "3" })).toHaveAttribute("href", "/?page=3");
});

test("should preserve existing query parameters", async ({ mount }) => {
  const component = await mountPagination(mount, 1, 3, "/?filter=test");

  const page2Link = component.getByRole("link", { name: "2" });
  const href = await page2Link.getAttribute("href");

  // Should contain both page and filter parameters
  expect(href).toContain("page=2");
  expect(href).toContain("filter=test");
});

test("should render pagination with correct styling", async ({ mount }) => {
  const component = await mountPagination(mount, 2, 4);

  // Check all pagination elements render correctly
  await expect(component.getByRole("link", { name: "← Previous" })).toBeVisible();
  await expect(component.getByRole("link", { name: "Next →" })).toBeVisible();
  const currentPageSpan = component.locator('[aria-current="page"]');
  await expect(currentPageSpan).toBeVisible();
  await expect(currentPageSpan).toHaveText("2");
});

test("should render only Next link on first page of many", async ({ mount }) => {
  const component = await mountPagination(mount, 1, 10);

  await expect(component.getByRole("link", { name: "← Previous" })).not.toBeVisible();
  await expect(component.getByRole("link", { name: "Next →" })).toBeVisible();
});

test("should render only Previous link on last page", async ({ mount }) => {
  const component = await mountPagination(mount, 10, 10);

  await expect(component.getByRole("link", { name: "← Previous" })).toBeVisible();
  await expect(component.getByRole("link", { name: "Next →" })).not.toBeVisible();
});

test("should render both Previous and Next on middle pages", async ({ mount }) => {
  const component = await mountPagination(mount, 5, 10);

  await expect(component.getByRole("link", { name: "← Previous" })).toBeVisible();
  await expect(component.getByRole("link", { name: "Next →" })).toBeVisible();
});
