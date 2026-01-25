import { test, expect } from "@playwright/experimental-ct-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  ErrorTrigger,
  ErrorTriggerWithCustomFallback,
  ThrowError,
  ThrowLongError,
  ThrowErrorWithoutMessage,
} from "./ErrorBoundary.stories";

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

test("should render error details section when error occurs", async ({ mount }) => {
  const component = await mount(<ErrorTrigger />);

  // Trigger the error
  await component.getByRole("button", { name: "Trigger Error" }).click();

  // Should display error details section
  await expect(component.locator("details")).toBeVisible();
  await expect(component.locator("summary")).toHaveText("Error details");
});

test("should display formatted error message in details", async ({ mount }) => {
  const component = await mount(<ErrorTrigger />);

  // Trigger the error
  await component.getByRole("button", { name: "Trigger Error" }).click();

  // Expand the details element
  await component.locator("summary").click();

  // Should display the error message
  await expect(component.locator("pre")).toBeVisible();
  await expect(component.locator("pre")).toContainText("Test error");
});

test("should truncate error messages longer than 500 characters", async ({ mount }) => {
  const component = await mount(
    <ErrorBoundary showErrorDetails={true}>
      <ThrowLongError />
    </ErrorBoundary>,
  );

  // Expand the details element
  await component.locator("summary").click();

  // Should truncate to 500 characters
  const errorText = await component.locator("pre").textContent();
  expect(errorText?.length).toBe(500);
  expect(errorText).toBe("A".repeat(500));
});

test("should handle errors without message property", async ({ mount }) => {
  const component = await mount(
    <ErrorBoundary showErrorDetails={true}>
      <ThrowErrorWithoutMessage />
    </ErrorBoundary>,
  );

  // Expand the details element
  await component.locator("summary").click();

  // Should display "Unknown error" as fallback
  await expect(component.locator("pre")).toContainText("Unknown error");
});

test("should not render error details when custom fallback is provided", async ({ mount }) => {
  const component = await mount(<ErrorTriggerWithCustomFallback />);

  // Trigger the error
  await component.getByRole("button", { name: "Trigger Error" }).click();

  // Should display custom fallback without error details
  await expect(component.getByText("Custom error message")).toBeVisible();
  await expect(component.locator("details")).not.toBeVisible();
});
