import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePhoneSearch } from '../hooks/usePhoneSearch';
import { PhoneGrid } from '../components/phone/PhoneGrid';
import { FilterSortBar } from '../components/phone/FilterSortBar';
import { Pagination } from '../components/common/Pagination';
import { PhoneCardSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { SearchBar } from '../components/search/SearchBar';
import { Search } from 'lucide-react';
import { PhoneSummary } from '../types';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, isLoading, isError, error, refetch } = usePhoneSearch(query, page);

  const results = data?.results || [];
  const hasMore = data?.hasMore || false;
  const total = data?.total ?? results.length;

  const [filteredResults, setFilteredResults] = useState<PhoneSummary[]>(results);

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(newPage));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm">
        <div className="max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
            Search Smartphones
          </h1>
          <p className="text-slate-500 text-sm mb-4">
            Find technical specifications and comparison data for thousands of devices.
          </p>
          <SearchBar initialValue={query} variant="hero" />
        </div>
      </div>

      {/* Results Header / Live count */}
      {query && (
        <div className="flex items-center justify-between">
          <div aria-live="polite" aria-atomic="true">
            <h2 className="text-lg font-bold text-slate-800">
              Results for &ldquo;<span className="text-emerald-700">{query}</span>&rdquo;
            </h2>
            {!isLoading && !isError && (
              <p className="text-xs text-slate-500 mt-0.5">
                Found {total} smartphone{total === 1 ? '' : 's'} (Page {page})
              </p>
            )}
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <PhoneCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Search Failed"
          message={(error as any)?.message || 'Could not fetch search results. Please try again.'}
          onRetry={() => refetch()}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && query && results.length === 0 && (
        <EmptyState
          title={`No phones matching "${query}"`}
          message="We couldn't find any devices matching your exact search. Check your spelling or browse phones by brand."
          actionText="Browse Popular Brands"
          actionHref="/brands"
        />
      )}

      {/* Initial state if no query */}
      {!query && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800 mb-2">Type a phone name above</h2>
          <p className="text-sm text-slate-500">
            Enter at least 2 characters to search for smartphone models or specifications.
          </p>
        </div>
      )}

      {/* Results Grid & Pagination */}
      {!isLoading && !isError && results.length > 0 && (
        <>
          <FilterSortBar
            phones={results}
            onFilteredChange={setFilteredResults}
            showBrandFilter={true}
          />

          {filteredResults.length === 0 ? (
            <EmptyState
              title="No phones match your active filters"
              message="No devices loaded on this page match your selected brand, RAM, or year filters. Try loosening or resetting your filter criteria."
              actionText="Reset Filters"
              onAction={() => setSearchParams({ q: query, page: String(page) })}
            />
          ) : (
            <PhoneGrid phones={filteredResults} />
          )}

          <Pagination
            currentPage={page}
            hasMore={hasMore}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
