import { useState } from "react";
import type { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function ThrowError({ shouldThrow }: Readonly<{ shouldThrow: boolean }>): ReactNode {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
}

export function ThrowLongError(): never {
  const longMessage = "A".repeat(600);
  throw new Error(longMessage);
}

export function ThrowErrorWithoutMessage(): never {
  const error = new Error();
  error.message = "";
  throw error;
}

export function ErrorTrigger() {
  const [shouldThrow, setShouldThrow] = useState(false);

  return (
    <div>
      <button onClick={() => setShouldThrow(true)}>Trigger Error</button>
      <ErrorBoundary showErrorDetails={true}>
        <ThrowError shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  );
}

export function ErrorTriggerWithCustomFallback() {
  const [shouldThrow, setShouldThrow] = useState(false);

  return (
    <div>
      <button onClick={() => setShouldThrow(true)}>Trigger Error</button>
      <ErrorBoundary fallback={<div>Custom error message</div>}>
        <ThrowError shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  );
}
