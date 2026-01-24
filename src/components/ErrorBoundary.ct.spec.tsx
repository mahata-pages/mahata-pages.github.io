import { test, expect } from "@playwright/experimental-ct-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorTrigger, ErrorTriggerWithCustomFallback, ThrowError } from "./ErrorBoundary.stories";

test("should render children when no error occurs", async ({ mount }) => {
  const component = await mount(
    <ErrorBoundary>
      <div>Child content</div>
    </ErrorBoundary>,
  );

  await expect(component.getByText("Child content")).toBeVisible();
});

test("should display default fallback message when an error is caught", async ({ mount }) => {
  const component = await mount(<ErrorTrigger />);

  // Initially, no error should be displayed
  await expect(component.getByText("No error")).toBeVisible();

  // Trigger the error
  await component.getByRole("button", { name: "Trigger Error" }).click();

  // Should display the default fallback message
  await expect(component.getByText("Something went wrong. Please try again later.")).toBeVisible();

  // The error component should not be visible anymore
  await expect(component.getByText("No error")).not.toBeVisible();
});

test("should display custom fallback UI when provided via props", async ({ mount }) => {
  const component = await mount(<ErrorTriggerWithCustomFallback />);

  // Initially, no error should be displayed
  await expect(component.getByText("No error")).toBeVisible();

  // Trigger the error
  await component.getByRole("button", { name: "Trigger Error" }).click();

  // Should display the custom fallback message
  await expect(component.getByText("Custom error message")).toBeVisible();

  // The error component should not be visible anymore
  await expect(component.getByText("No error")).not.toBeVisible();
});

test("should catch errors from children", async ({ mount }) => {
  const component = await mount(
    <ErrorBoundary>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>,
  );

  // Should catch the error and display fallback
  await expect(component.getByText("Something went wrong. Please try again later.")).toBeVisible();
});
