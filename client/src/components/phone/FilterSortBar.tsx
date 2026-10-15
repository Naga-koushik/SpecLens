import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PhoneSummary } from '../../types';
import { ArrowUpDown, Filter, RotateCcw, Info } from 'lucide-react';

interface FilterSortBarProps {
  phones: PhoneSummary[];
  onFilteredChange: (filtered: PhoneSummary[]) => void;
  showBrandFilter?: boolean;
  availableBrands?: string[];
}

export type SortOption = 'relevance' | 'newest' | 'name';

export const FilterSortBar: React.FC<FilterSortBarProps> = ({
  phones,
  onFilteredChange,
  showBrandFilter = true,
  availableBrands
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = (searchParams.get('sort') as SortOption) || 'relevance';
  const brand = searchParams.get('brand') || '';
  const minRam = searchParams.get('minRam') || '';
  const year = searchParams.get('year') || '';

  // Extract all unique brands from loaded phones if not provided
  const brandsList = React.useMemo(() => {
    if (availableBrands && availableBrands.length > 0) return availableBrands;
    const bSet = new Set<string>();
    phones.forEach((p) => {
      if (p.brand) bSet.add(p.brand);
    });
    return Array.from(bSet).sort();
  }, [phones, availableBrands]);

  // Extract all unique release years from loaded phones
  const yearsList = React.useMemo(() => {
    const ySet = new Set<string>();
    phones.forEach((p) => {
      if (p.releaseDate) {
        const match = p.releaseDate.match(/\b(20\d\d)\b/);
        if (match) ySet.add(match[1]);
      } else {
        // Fallback: check name for 4 digit year
        const match = p.name.match(/\b(20\d\d)\b/);
        if (match) ySet.add(match[1]);
      }
    });
    return Array.from(ySet).sort((a, b) => Number(b) - Number(a));
  }, [phones]);

  // Helper to update search params
  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'relevance' && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('sort');
    newParams.delete('brand');
    newParams.delete('minRam');
    newParams.delete('year');
    setSearchParams(newParams);
  };

  const hasActiveFilters = Boolean(
    (sort && sort !== 'relevance') || brand || minRam || year
  );

  // Apply Filtering & Sorting Client-Side
  React.useEffect(() => {
    let result = [...phones];

    // Filter by Brand
    if (brand && brand !== 'all') {
      result = result.filter(
        (p) => p.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    // Filter by Year
    if (year && year !== 'all') {
      result = result.filter((p) => {
        const text = `${p.releaseDate || ''} ${p.name}`;
        return text.includes(year);
      });
    }

    // Filter by Min RAM
    if (minRam && minRam !== 'all') {
      const minRamNum = parseFloat(minRam);
      result = result.filter((p) => {
        // Check p.ram first
        let ramStr = p.ram || '';
        if (!ramStr) {
          // Check highlights
          const ramHighlight = p.highlights.find((h) => /\b\d+\s*GB\b/i.test(h));
          if (ramHighlight) ramStr = ramHighlight;
        }

        const matches = [...ramStr.matchAll(/(\d+)\s*(?:GB|MB)/gi)];
        if (matches.length === 0) return true; // keep if unknown

        const maxRam = Math.max(
          ...matches.map((m) =>
            m[0].toUpperCase().includes('MB')
              ? parseFloat(m[1]) / 1024
              : parseFloat(m[1])
          )
        );
        return maxRam >= minRamNum;
      });
    }

    // Sort
    if (sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'newest') {
      result.sort((a, b) => {
        const yearA = parseInt(a.releaseDate?.match(/\b(20\d\d)\b/)?.[1] || '0', 10);
        const yearB = parseInt(b.releaseDate?.match(/\b(20\d\d)\b/)?.[1] || '0', 10);
        return yearB - yearA;
      });
    }

    onFilteredChange(result);
  }, [phones, sort, brand, minRam, year]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm mb-6 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Controls container */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <label htmlFor="filter-sort-select" className="font-semibold text-slate-700">
              Sort:
            </label>
            <select
              id="filter-sort-select"
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          {/* Brand Filter */}
          {showBrandFilter && brandsList.length > 1 && (
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-brand-select" className="font-semibold text-slate-700">
                Brand:
              </label>
              <select
                id="filter-brand-select"
                value={brand}
                onChange={(e) => updateParam('brand', e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="all">All Brands</option>
                {brandsList.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Min RAM Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-ram-select" className="font-semibold text-slate-700">
              Min RAM:
            </label>
            <select
              id="filter-ram-select"
              value={minRam}
              onChange={(e) => updateParam('minRam', e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">Any RAM</option>
              <option value="6">6 GB+</option>
              <option value="8">8 GB+</option>
              <option value="12">12 GB+</option>
              <option value="16">16 GB+</option>
            </select>
          </div>

          {/* Year Filter */}
          {yearsList.length > 0 && (
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-year-select" className="font-semibold text-slate-700">
                Year:
              </label>
              <select
                id="filter-year-select"
                value={year}
                onChange={(e) => updateParam('year', e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="all">Any Year</option>
                {yearsList.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-red-600 font-medium px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Disclaimer Note */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Filters apply to loaded results on this page</span>
        </div>
      </div>
    </div>
  );
};
