import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message?: string;
  code?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this data. Please check your connection and try again.',
  code,
  onRetry,
  showHomeButton = true
}) => {
  return (
    <div
      role="alert"
      className="bg-white rounded-2xl border border-red-100 p-8 text-center max-w-lg mx-auto shadow-sm my-8"
    >
      <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-7 h-7" aria-hidden="true" />
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
      {code && (
        <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-red-100 text-red-800 rounded-full mb-3">
          Error Code: {code}
        </span>
      )}
      <p className="text-slate-600 text-sm leading-relaxed mb-6">{message}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
        )}
        {showHomeButton && (
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Back to Home
          </Link>
        )}
      </div>
    </div>
  );
};
