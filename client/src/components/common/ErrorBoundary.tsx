import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div role="alert" className="bg-white rounded-3xl border border-red-100 p-8 text-center max-w-lg shadow-lg">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8" aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">Unexpected View Error</h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              A problem occurred while rendering this page. You can reload the page or return to the home screen.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Reload Page
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
