import { test, expect } from "@playwright/experimental-ct-react";
import Health from "@/routes/Health";

test("Health shows OK", async ({ mount }) => {
  const component = await mount(<Health />);
  await expect(component).toContainText("OK");
});
