import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PhoneSummary } from '../../types';
import { Smartphone, Plus, Check } from 'lucide-react';

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
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full relative">
      {/* Phone Image Container */}
      <Link
        to={`/phones/${phone.id}`}
        className="w-full h-48 bg-slate-50 rounded-xl mb-4 flex items-center justify-center p-4 overflow-hidden relative"
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
          className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1 hover:bg-emerald-100 transition-colors"
        >
          {phone.brand}
        </Link>
        <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors line-clamp-1">
          <Link to={`/phones/${phone.id}`}>{phone.name}</Link>
        </h3>
      </div>

      {/* Highlights List */}
      <div className="space-y-1.5 mb-5 flex-1">
        {phone.highlights && phone.highlights.length > 0 ? (
          phone.highlights.slice(0, 3).map((h, i) => (
            <div key={i} className="text-xs text-slate-600 flex items-center gap-1.5 line-clamp-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>{h}</span>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 italic">Specifications available inside</p>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-slate-100">
        <Link
          to={`/phones/${phone.id}`}
          className="min-h-[44px] flex items-center justify-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 text-center"
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
              : 'border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
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
