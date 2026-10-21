import React from 'react';
import { SearchX, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  message = 'We could not find any smartphones matching your criteria. Try adjusting your query or check popular devices.',
  actionText = 'Browse all brands',
  actionHref = '/brands',
  onAction,
  icon
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-10 text-center max-w-lg mx-auto shadow-sm my-8 transition-colors">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon || <SearchX className="w-8 h-8" aria-hidden="true" />}
      </div>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">{message}</p>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {actionText}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      )}

      {actionText && !onAction && actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {actionText}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
};
