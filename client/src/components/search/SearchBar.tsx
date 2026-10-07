import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useAutocomplete } from '../../hooks/useAutocomplete';
import { SearchSuggestions } from './SearchSuggestions';
import { AutocompleteSuggestion } from '../../types';

interface SearchBarProps {
  initialValue?: string;
  variant?: 'hero' | 'compact';
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  variant = 'hero',
  placeholder = 'Search by smartphone name (e.g., iPhone 15 Pro, Galaxy S24)...',
  autoFocus = false
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 350);
  const { data: suggestions = [], isLoading } = useAutocomplete(debouncedQuery, 5);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Open suggestions when query >= 2 and results exist
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2 && suggestions.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    setActiveIndex(-1);
  }, [debouncedQuery, suggestions.length]);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectSuggestion = (suggestion: AutocompleteSuggestion) => {
    setIsOpen(false);
    navigate(`/phones/${suggestion.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearchSubmit(query);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSelectSuggestion(suggestions[activeIndex]);
        } else {
          handleSearchSubmit(query);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit(query);
        }}
        className="relative flex items-center w-full"
      >
        <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center justify-center">
          <Search className={isHero ? 'w-6 h-6' : 'w-4 h-4'} aria-hidden="true" />
        </div>

        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="search-suggestions-list"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-option-${activeIndex}` : undefined}
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (debouncedQuery.trim().length >= 2 && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-white text-slate-900 border border-slate-200/90 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
            isHero
              ? 'py-4 pl-12 pr-28 text-base md:text-lg rounded-2xl shadow-md hover:shadow-lg'
              : 'py-2 pl-10 pr-20 text-sm rounded-xl'
          }`}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search input"
            className={`absolute ${isHero ? 'right-20' : 'right-16'} text-slate-400 hover:text-slate-600 p-1.5 rounded-full transition-colors`}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}

        <button
          type="submit"
          className={`absolute right-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            isHero ? 'py-2.5 text-sm md:text-base' : 'py-1.5 text-xs'
          }`}
        >
          Search
        </button>
      </form>

      {isOpen && (
        <SearchSuggestions
          suggestions={suggestions}
          activeIndex={activeIndex}
          onSelect={handleSelectSuggestion}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
