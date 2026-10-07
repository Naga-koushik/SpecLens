import React from 'react';
import { Link } from 'react-router-dom';
import { useBrands } from '../hooks/useBrands';
import { ErrorState } from '../components/common/ErrorState';
import { Layers, ArrowRight } from 'lucide-react';

export const BrandsPage: React.FC = () => {
  const { data: brands = [], isLoading, isError, error, refetch } = useBrands();

  return (
    <div className="space-y-8">
      {/* Brands Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Smartphone Brands
          </h1>
        </div>
        <p className="text-slate-500 text-sm max-w-xl">
          Browse our catalog of smartphone manufacturers to explore current lineups, flagship devices, and technical specifications.
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          title="Could not load brands"
          message={(error as any)?.message || 'Failed to fetch manufacturer list.'}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              to={`/brands/${brand.slug}`}
              className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col items-center justify-between text-center min-h-[120px]"
            >
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="font-bold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">
                  {brand.name}
                </span>
                {brand.deviceCount && (
                  <span className="text-xs text-slate-400 mt-1">
                    {brand.deviceCount} models cataloged
                  </span>
                )}
              </div>

              <div className="pt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>View Phones</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
