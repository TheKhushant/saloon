import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production, forward this to an error-monitoring service (e.g. Sentry).
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center bg-card border border-primary/15 rounded-2xl p-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-heading text-xl font-bold text-foreground mb-2">Something went wrong</h1>
            <p className="text-sm text-muted-foreground mb-6">
              We hit an unexpected error. Please try reloading the page — if the problem continues,
              reach out to our support team.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 gradient-gold text-primary-foreground font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-black/20 hover:opacity-90 transition-opacity"
              >
                <RefreshCcw className="w-4 h-4" /> Reload
              </button>
              <a
                href="/"
                className="flex items-center gap-2 border border-primary/20 text-primary font-medium px-5 py-2.5 rounded-xl hover:bg-primary/10 transition-colors"
              >
                <Home className="w-4 h-4" /> Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
