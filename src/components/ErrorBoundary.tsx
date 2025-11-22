import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // You can log error to an external service here
    // console.error("Unhandled error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-destructive/5">
          <div className="max-w-2xl w-full bg-card border border-border p-6 rounded-md">
            <h2 className="text-lg font-bold text-destructive mb-2">
              Application Error
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              An error occurred while rendering the application.
            </p>
            <pre className="whitespace-pre-wrap text-xs bg-muted p-3 rounded">
              {String(this.state.error?.message || "Unknown error")}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
