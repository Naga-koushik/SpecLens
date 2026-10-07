import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useBrandPhones } from '../hooks/useBrandPhones';
import { PhoneGrid } from '../components/phone/PhoneGrid';
import { Pagination } from '../components/common/Pagination';
import { PhoneCardSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { ChevronRight } from 'lucide-react';

export const BrandDetailPage: React.FC = () => {
  const { brand } = useParams<{ brand: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, isLoading, isError, error, refetch } = useBrandPhones(brand, page);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const results = data?.results || [];
  const hasMore = data?.hasMore || false;
  const brandName = data?.brand || (brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : 'Brand');

  return (
    <div className="space-y-8">
      {/* Breadcrumb & Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <Link to="/" className="hover:text-slate-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/brands" className="hover:text-slate-600 transition-colors">Brands</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-semibold">{brandName}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {brandName} Smartphones
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore specifications and compare devices from {brandName}.
        </p>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PhoneCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorState
          title={`Error loading ${brandName} phones`}
          message={(error as any)?.message || 'Failed to retrieve phone lineup.'}
          onRetry={() => refetch()}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && results.length === 0 && (
        <EmptyState
          title={`No phones found for ${brandName}`}
          message="We could not find any models recorded for this brand in the current catalog."
          actionText="Browse other brands"
          actionHref="/brands"
        />
      )}

      {/* Phones Grid & Pagination */}
      {!isLoading && !isError && results.length > 0 && (
        <>
          <PhoneGrid phones={results} />
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
