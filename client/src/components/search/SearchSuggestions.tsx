import React from 'react';
import { AutocompleteSuggestion } from '../../types';
import { Smartphone, ArrowUpRight } from 'lucide-react';

interface SearchSuggestionsProps {
  suggestions: AutocompleteSuggestion[];
  activeIndex: number;
  onSelect: (suggestion: AutocompleteSuggestion) => void;
  isLoading?: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  activeIndex,
  onSelect,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 px-4 z-50 text-sm text-slate-500 flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span>Finding smartphones...</span>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <ul
      role="listbox"
      id="search-suggestions-list"
      aria-label="Search suggestions"
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 overflow-hidden divide-y divide-slate-100 max-h-80 overflow-y-auto"
    >
      {suggestions.map((item, idx) => {
        const isSelected = idx === activeIndex;
        return (
          <li
            key={item.id}
            id={`suggestion-option-${idx}`}
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(item)}
            className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
              isSelected ? 'bg-emerald-50 text-emerald-950 font-medium' : 'hover:bg-slate-50 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                <Smartphone className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-slate-500">{item.brand}</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          </li>
        );
      })}
    </ul>
  );
};
