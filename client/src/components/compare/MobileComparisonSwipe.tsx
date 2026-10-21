import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, ComparisonRowItem } from '../../types';
import { NOT_AVAILABLE, COMPARISON_CATEGORIES } from '../../utils/comparison';
import { GlossaryTerm } from '../common/GlossaryTerm';
import { ChevronLeft, ChevronRight, X, Plus, Smartphone, Award } from 'lucide-react';

interface MobileComparisonSwipeProps {
  phones: Phone[];
  rows: ComparisonRowItem[];
  groupedRows: Record<string, ComparisonRowItem[]>;
  onRemovePhone: (id: string | number) => void;
  onAddPhone: (id: string | number) => void;
  canAddMore?: boolean;
  onOpenAddModal: () => void;
  showDifferencesOnly: boolean;
}

export const MobileComparisonSwipe: React.FC<MobileComparisonSwipeProps> = ({
  phones,
  groupedRows,
  onRemovePhone,
  canAddMore = false,
  onOpenAddModal,
  showDifferencesOnly
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (phones.length === 0) return null;

  const currentPhone = phones[activeIndex] || phones[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : phones.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < phones.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const swipeThreshold = 50;
    if (diff > swipeThreshold) {
      // Swiped left -> next
      handleNext();
    } else if (diff < -swipeThreshold) {
      // Swiped right -> prev
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="block sm:hidden space-y-4"
      data-testid="mobile-comparison-swipe"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Phone Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
        {phones.map((p, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
                isCurrent
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{p.name.split(' ').slice(0, 3).join(' ')}</span>
            </button>
          );
        })}

        {canAddMore && (
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 border border-dashed border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>

      {/* Swipe Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm relative transition-colors">
        {/* Navigation arrows & pagination pill */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous smartphone"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full">
            Device {activeIndex + 1} of {phones.length} &bull; Swipe &harr;
          </span>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next smartphone"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Phone Summary */}
        <div className="flex flex-col items-center text-center relative pt-2">
          {/* Remove Phone Button */}
          <button
            type="button"
            onClick={() => onRemovePhone(currentPhone.id)}
            aria-label={`Remove ${currentPhone.name} from comparison`}
            className="absolute top-0 right-0 p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <Link to={`/phones/${currentPhone.id}`} className="w-28 h-36 mb-3 flex items-center justify-center">
            {currentPhone.image ? (
              <img
                src={currentPhone.image}
                alt={`${currentPhone.brand} ${currentPhone.name}`}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <Smartphone className="w-16 h-16 text-slate-300 dark:text-slate-600" />
            )}
          </Link>

          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full mb-1">
            {currentPhone.brand}
          </span>
          <Link
            to={`/phones/${currentPhone.id}`}
            className="text-base font-extrabold text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            {currentPhone.name}
          </Link>
        </div>
      </div>

      {/* Specifications for Active Phone grouped by category */}
      <div className="space-y-4">
        {COMPARISON_CATEGORIES.map((category) => {
          const categoryRows = groupedRows[category] || [];
          const visibleRows = showDifferencesOnly
            ? categoryRows.filter((r) => r.isDifferent)
            : categoryRows;

          if (visibleRows.length === 0) return null;

          return (
            <div
              key={category}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-sm transition-colors"
            >
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                {category}
              </h3>

              <div className="space-y-3">
                {visibleRows.map((row) => {
                  const val = row.values[currentPhone.id] || NOT_AVAILABLE;
                  const isMissing = val === NOT_AVAILABLE;
                  const isBest =
                    !isMissing &&
                    (row.bestPhoneIds?.includes(currentPhone.id) ||
                      row.bestPhoneIds?.includes(String(currentPhone.id)) ||
                      row.bestPhoneIds?.includes(Number(currentPhone.id)));

                  return (
                    <div
                      key={row.key}
                      className={`p-2.5 rounded-xl transition-colors ${
                        row.isDifferent
                          ? 'bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40'
                          : 'bg-slate-50/60 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <GlossaryTerm term={row.label} />
                        <div className="flex items-center gap-1">
                          {isBest && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded">
                              <Award className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                              <span>Best</span>
                            </span>
                          )}
                          {row.isDifferent && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded">
                              Diff
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 break-words">
                        {isMissing ? (
                          <span className="text-slate-400 dark:text-slate-500 italic">Not available</span>
                        ) : (
                          val
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
