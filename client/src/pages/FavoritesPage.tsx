import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { PhoneGrid } from '../components/phone/PhoneGrid';
import { FilterSortBar } from '../components/phone/FilterSortBar';
import { EmptyState } from '../components/common/EmptyState';
import { Heart, Trash2, Scale } from 'lucide-react';
import { PhoneSummary } from '../types';

export const FavoritesPage: React.FC = () => {
  const { favorites, clearFavorites } = useFavorites();
  const [filteredFavorites, setFilteredFavorites] = useState<PhoneSummary[]>(favorites);

  const compareUrl =
    favorites.length > 0
      ? `/compare?ids=${favorites.slice(0, 4).map((f) => f.id).join(',')}`
      : '/compare';

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-600" aria-hidden="true" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              My Favorites
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
              {favorites.length}
            </span>
          </div>
          <p className="text-slate-500 text-sm max-w-xl">
            Smartphones you have bookmarked for quick reference. Stored locally in your browser for privacy.
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {favorites.length >= 2 && (
              <Link
                to={compareUrl}
                className="min-h-[42px] inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <Scale className="w-4 h-4" aria-hidden="true" />
                <span>Compare Favorites ({Math.min(favorites.length, 4)})</span>
              </Link>
            )}
            <button
              type="button"
              onClick={clearFavorites}
              className="min-h-[42px] inline-flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold text-xs rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <EmptyState
          title="No Favorite Phones Yet"
          message="You haven't bookmarked any phones yet. Browse or search phones and click the heart icon on any device card to save your favorites here."
          actionText="Browse Popular Phones"
          actionHref="/"
        />
      ) : (
        <>
          <FilterSortBar
            phones={favorites}
            onFilteredChange={setFilteredFavorites}
            showBrandFilter={true}
          />

          {filteredFavorites.length === 0 ? (
            <EmptyState
              title="No favorites match your active filters"
              message="No saved devices match your selected filters. Try loosening or clearing your filter criteria."
              actionText="Reset Filters"
              onAction={() => setFilteredFavorites(favorites)}
            />
          ) : (
            <PhoneGrid phones={filteredFavorites} />
          )}
        </>
      )}
    </div>
  );
};
