import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Phone } from '../../types';
import { buildComparisonRows, COMPARISON_CATEGORIES } from '../../utils/comparison';
import { ComparisonRow } from './ComparisonRow';
import { PhoneSelectorModal } from './PhoneSelectorModal';
import { X, Plus, Smartphone, Share2, Check, Filter, Trash2 } from 'lucide-react';

interface ComparisonTableProps {
  phones: Phone[];
  onRemovePhone: (id: string | number) => void;
  onAddPhone: (id: string | number) => void;
  onClearAll?: () => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  phones,
  onRemovePhone,
  onAddPhone,
  onClearAll
}) => {
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const rows = useMemo(() => buildComparisonRows(phones), [phones]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2500);
  };

  // Group rows by category
  const groupedRows = useMemo(() => {
    const groups: Record<string, typeof rows> = {};
    for (const cat of COMPARISON_CATEGORIES) {
      groups[cat] = rows.filter((r) => r.category === cat);
    }
    return groups;
  }, [rows]);

  const canAddMore = phones.length < 4;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden my-6 relative">
      {/* Table Toolbar */}
      <div className="p-4 md:p-6 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showDifferencesOnly}
              onChange={(e) => setShowDifferencesOnly(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Show differences only</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          {onClearAll && phones.length > 0 && (
            <button
              onClick={onClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 hover:border-red-200 text-xs font-semibold rounded-xl shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-red-400"
              title="Clear all compared smartphones"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>Clear all</span>
            </button>
          )}

          {canAddMore && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <Plus className="w-4 h-4" />
              <span>Add Phone ({phones.length}/4)</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-slate-400"
            title="Copy shareable comparison link"
          >
            {copiedShareLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Floating Confirmation Toast for Copy Link */}
      {copiedShareLink && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Comparison link copied to clipboard!</span>
        </div>
      )}

      {/* Horizontal Scroll Table Container */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Smartphone specifications side-by-side comparison table</caption>

          {/* Table Header: Devices */}
          <thead>
            <tr className="border-b border-slate-200 bg-white">
              <th
                scope="col"
                className="sticky left-0 z-20 bg-white p-4 text-xs font-bold text-slate-400 uppercase tracking-wider min-w-[160px] max-w-[200px] border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] align-bottom"
              >
                Specification
              </th>

              {phones.map((phone) => (
                <th
                  key={phone.id}
                  scope="col"
                  className="p-4 align-top min-w-[220px] max-w-[280px]"
                >
                  <div className="flex flex-col items-center text-center p-2 relative group">
                    {/* Remove Button */}
                    <button
                      onClick={() => onRemovePhone(phone.id)}
                      aria-label={`Remove ${phone.name} from comparison`}
                      className="absolute -top-1 -right-1 p-1 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full transition-colors z-10"
                      title={`Remove ${phone.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Image */}
                    <Link to={`/phones/${phone.id}`} className="w-24 h-32 mb-2 flex items-center justify-center">
                      {phone.image ? (
                        <img
                          src={phone.image}
                          alt={`${phone.brand} ${phone.name}`}
                          className="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
                        />
                      ) : (
                        <Smartphone className="w-16 h-16 text-slate-300" />
                      )}
                    </Link>

                    {/* Brand & Name */}
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                      {phone.brand}
                    </span>
                    <Link
                      to={`/phones/${phone.id}`}
                      className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-2"
                    >
                      {phone.name}
                    </Link>
                  </div>
                </th>
              ))}

              {canAddMore && (
                <th
                  scope="col"
                  className="p-4 align-middle min-w-[180px] text-center border-l border-dashed border-slate-200 bg-slate-50/30"
                >
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl w-full text-slate-400 hover:text-emerald-700 hover:bg-emerald-50/40 transition-all group"
                  >
                    <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Add another phone</span>
                  </button>
                </th>
              )}
            </tr>
          </thead>

          {/* Grouped Rows Body */}
          <tbody>
            {COMPARISON_CATEGORIES.map((category) => {
              const categoryRows = groupedRows[category] || [];
              const visibleRows = showDifferencesOnly
                ? categoryRows.filter((r) => r.isDifferent)
                : categoryRows;

              if (visibleRows.length === 0) return null;

              return (
                <React.Fragment key={category}>
                  {/* Category Header Row */}
                  <tr className="bg-slate-100/80 border-y border-slate-200">
                    <th
                      scope="row"
                      colSpan={phones.length + 1 + (canAddMore ? 1 : 0)}
                      className="py-2.5 px-4 text-xs font-extrabold uppercase tracking-wider text-slate-700"
                    >
                      {category}
                    </th>
                  </tr>

                  {/* Spec Rows */}
                  {visibleRows.map((row) => (
                    <ComparisonRow
                      key={row.key}
                      row={row}
                      phones={phones}
                      showDifferencesOnly={showDifferencesOnly}
                      canAddMore={canAddMore}
                    />
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* In-page Phone Selection Modal */}
      <PhoneSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(newId) => {
          onAddPhone(newId);
          setIsModalOpen(false);
        }}
        existingIds={phones.map((p) => p.id)}
      />
    </div>
  );
};
