import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PhoneSummary } from '../../types';
import { Smartphone, Plus, Check, Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';

interface PhoneCardProps {
  phone: PhoneSummary;
  onCompareToggle?: (id: string | number) => void;
  isComparing?: boolean;
}

export const PhoneCard: React.FC<PhoneCardProps> = ({
  phone,
  onCompareToggle,
  isComparing = false
}) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(phone.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(phone);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onCompareToggle) {
      onCompareToggle(phone.id);
      return;
    }

    // Default behavior: read existing ids from compare URL or navigate to compare
    const params = new URLSearchParams(location.search);
    const existingIds = (params.get('ids') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const stringId = String(phone.id);
    let newIds: string[];

    if (existingIds.includes(stringId)) {
      newIds = existingIds.filter((id) => id !== stringId);
    } else {
      if (existingIds.length >= 4) {
        alert('You can compare a maximum of 4 smartphones at a time.');
        return;
      }
      newIds = [...existingIds, stringId];
    }

    if (newIds.length > 0) {
      navigate(`/compare?ids=${newIds.join(',')}`);
    } else {
      navigate('/compare');
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full relative">
      {/* Favorite Button */}
      <button
        type="button"
        onClick={handleFavoriteClick}
        aria-label={isFav ? `Remove ${phone.name} from favorites` : `Add ${phone.name} to favorites`}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-sm transition-all focus-visible:ring-2 focus-visible:ring-rose-500 ${
          isFav
            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shadow-sm border border-rose-200 dark:border-rose-900'
            : 'bg-white/90 dark:bg-slate-800/90 text-slate-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700 shadow-xs border border-slate-200/60 dark:border-slate-700'
        }`}
      >
        <Heart
          className={`w-4 h-4 transition-transform active:scale-125 ${isFav ? 'fill-rose-500 stroke-rose-500' : 'stroke-current'}`}
          aria-hidden="true"
        />
      </button>

      {/* Phone Image Container */}
      <Link
        to={`/phones/${phone.id}`}
        className="w-full h-48 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-4 flex items-center justify-center p-4 overflow-hidden relative"
      >
        {!imageError && phone.thumbnail ? (
          <img
            src={phone.thumbnail}
            alt={`${phone.brand} ${phone.name}`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <Smartphone className="w-16 h-16 stroke-1 mb-1" aria-hidden="true" />
            <span className="text-xs font-medium">Image unavailable</span>
          </div>
        )}
      </Link>

      {/* Brand & Name */}
      <div className="mb-3">
        <Link
          to={`/brands/${phone.brand.toLowerCase()}`}
          className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full mb-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
        >
          {phone.brand}
        </Link>
        <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
          <Link to={`/phones/${phone.id}`}>{phone.name}</Link>
        </h3>
      </div>

      {/* Highlights List */}
      <div className="space-y-1.5 mb-5 flex-1">
        {phone.highlights && phone.highlights.length > 0 ? (
          phone.highlights.slice(0, 3).map((h, i) => (
            <div key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 line-clamp-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>{h}</span>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 italic">Specifications available inside</p>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
        <Link
          to={`/phones/${phone.id}`}
          className="min-h-[44px] flex items-center justify-center px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 text-center"
        >
          View Specs
        </Link>
        <button
          type="button"
          onClick={handleCompareClick}
          aria-label={isComparing ? `Remove ${phone.name} from comparison` : `Add ${phone.name} to comparison`}
          className={`min-h-[44px] flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 text-center ${
            isComparing
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
              : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-600'
          }`}
        >
          {isComparing ? (
            <>
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Compare</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
