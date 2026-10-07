import React from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/search/SearchBar';
import { PhoneGrid } from '../components/phone/PhoneGrid';
import { PhoneCardSkeleton } from '../components/common/Skeleton';
import { usePopularPhones } from '../hooks/usePopularPhones';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useBrands } from '../hooks/useBrands';
import { Sparkles, History, Layers, ArrowRight, Trash2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { data: popularPhones = [], isLoading: isPopularLoading } = usePopularPhones();
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const { data: brands = [], isLoading: isBrandsLoading } = useBrands();

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-6 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Compare 2 to 4 smartphones side by side</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Discover & Compare <br />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Smartphones with Clarity
          </span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed">
          Search comprehensive phone specifications, browse top brands, and inspect side-by-side differences with zero marketing fluff.
        </p>

        {/* Hero Search Bar */}
        <div className="max-w-2xl mx-auto shadow-xl shadow-slate-200/50 rounded-2xl">
          <SearchBar variant="hero" autoFocus />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
          <span className="font-medium text-slate-400">Popular searches:</span>
          {['iPhone 15 Pro', 'Galaxy S24 Ultra', 'Pixel 8 Pro', 'OnePlus 12'].map((q) => (
            <Link
              key={q}
              to={`/search?q=${encodeURIComponent(q)}`}
              className="px-2.5 py-1 bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 rounded-lg transition-colors"
            >
              {q}
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Phones Section */}
      <section aria-labelledby="popular-phones-heading">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h2 id="popular-phones-heading" className="text-2xl font-bold text-slate-900">
              Popular Smartphones
            </h2>
          </div>
          <Link
            to="/brands"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>All Brands</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {isPopularLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <PhoneCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <PhoneGrid phones={popularPhones} />
        )}
      </section>

      {/* Recently Viewed Phones Section */}
      {recentlyViewed.length > 0 && (
        <section aria-labelledby="recent-phones-heading" className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-slate-500" />
              <h2 id="recent-phones-heading" className="text-xl font-bold text-slate-900">
                Recently Viewed
              </h2>
            </div>
            <button
              onClick={clearRecentlyViewed}
              className="text-xs font-semibold text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors"
              title="Clear browsing history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          <PhoneGrid phones={recentlyViewed} />
        </section>
      )}

      {/* Popular Brands Grid */}
      <section aria-labelledby="popular-brands-heading">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h2 id="popular-brands-heading" className="text-2xl font-bold text-slate-900">
              Browse by Brand
            </h2>
          </div>
          <Link
            to="/brands"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {isBrandsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {brands.slice(0, 6).map((brand) => (
              <Link
                key={brand.slug}
                to={`/brands/${brand.slug}`}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md text-center transition-all group flex flex-col items-center justify-center"
              >
                <span className="font-bold text-slate-800 text-base group-hover:text-emerald-700 transition-colors">
                  {brand.name}
                </span>
                <span className="text-xs text-slate-400 mt-1">Explore Lineup</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
