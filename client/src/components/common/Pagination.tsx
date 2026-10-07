import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  hasMore: boolean;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  hasMore,
  onPageChange,
  isLoading = false
}) => {
  if (currentPage === 1 && !hasMore) {
    return null;
  }

  return (
    <nav aria-label="Pagination navigation" className="flex items-center justify-center gap-3 my-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
        aria-label="Previous page"
        className="min-w-[44px] min-h-[44px] px-4 py-2 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        <span>Previous</span>
      </button>

      <span className="min-h-[44px] px-4 py-2 flex items-center justify-center text-sm font-medium text-slate-700 bg-slate-100 rounded-xl">
        Page {currentPage}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore || isLoading}
        aria-label="Next page"
        className="min-w-[44px] min-h-[44px] px-4 py-2 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </nav>
  );
};
