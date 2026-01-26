import { test, expect } from "@playwright/experimental-ct-react";
import { MemoryRouter } from "react-router-dom";

import { Header } from "@/Header";

test("should show logo image in header", async ({ mount }) => {
  const component = await mount(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

  await expect(component.getByRole("img", { name: "Logo" })).toBeVisible();
});

test("logo link points to root", async ({ mount }) => {
  const component = await mount(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

  const logoLink = component.getByRole("link", { name: "Go to home" });
  await expect(logoLink).toHaveAttribute("href", "/");
});
