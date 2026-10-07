import React, { useState } from 'react';
import { X, Search, Smartphone, Plus } from 'lucide-react';
import { usePhoneSearch } from '../../hooks/usePhoneSearch';
import { usePopularPhones } from '../../hooks/usePopularPhones';
import { PhoneSummary } from '../../types';

interface PhoneSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (phoneId: string | number) => void;
  existingIds: Array<string | number>;
}

export const PhoneSelectorModal: React.FC<PhoneSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  existingIds
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: searchData, isLoading: isSearching } = usePhoneSearch(searchTerm);
  const { data: popularPhones = [], isLoading: isPopularLoading } = usePopularPhones();

  if (!isOpen) return null;

  const existingSet = new Set(existingIds.map(String));

  const displayedPhones = searchTerm.trim().length >= 2
    ? (searchData?.results || []).filter((p) => !existingSet.has(String(p.id)))
    : popularPhones.filter((p) => !existingSet.has(String(p.id)));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="select-phone-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h2 id="select-phone-modal-title" className="text-lg font-bold text-slate-900">
            Add Smartphone to Compare
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search phones to add (e.g., iPhone 15, Pixel 8)..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {/* Phones List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
          {isSearching || isPopularLoading ? (
            <div className="p-8 text-center text-sm text-slate-400">Loading phones...</div>
          ) : displayedPhones.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No matching smartphones found to add.
            </div>
          ) : (
            displayedPhones.map((phone) => (
              <div
                key={phone.id}
                onClick={() => onSelect(phone.id)}
                className="pt-2 first:pt-0 flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/60 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {phone.name}
                    </h4>
                    <span className="text-xs text-slate-500">{phone.brand}</span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Select ${phone.name}`}
                  className="px-3 py-1.5 bg-emerald-600 group-hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  Add
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
