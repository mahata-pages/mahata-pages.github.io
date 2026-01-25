import { Component, type ReactNode, type ErrorInfo } from "react";

const MAX_ERROR_MESSAGE_LENGTH = 500;

type ErrorBoundaryProps = Readonly<{
  children: ReactNode;
  fallback?: ReactNode;
}>;

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div role="alert">
          <p>Something went wrong. Please try again later.</p>
          {this.state.error && (
            <details>
              <summary>Error details</summary>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {String(this.state.error?.message ?? this.state.error ?? 'Unknown error').substring(0, MAX_ERROR_MESSAGE_LENGTH)}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
