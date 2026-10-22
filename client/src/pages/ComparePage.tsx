import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCompare } from '../hooks/useCompare';
import { ComparisonTable } from '../components/compare/ComparisonTable';
import { PhoneSelectorModal } from '../components/compare/PhoneSelectorModal';
import { ComparisonTableSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { Scale, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { AssistantPanel } from '../components/assistant/AssistantPanel';
import { AssistantSummary } from '../types';
import { apiClient } from '../api/client';

export const ComparePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [summary, setSummary] = useState<AssistantSummary | null>(null);

  // Parse IDs from URL
  const idsQuery = searchParams.get('ids') || '';
  const ids = idsQuery
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  const { data, isLoading, isError, error, refetch } = useCompare(ids);

  const handleRemovePhone = (removeId: string | number) => {
    const remaining = ids.filter((id) => id !== String(removeId));
    if (remaining.length > 0) {
      setSearchParams({ ids: remaining.join(',') });
    } else {
      setSearchParams({});
    }
  };

  const handleAddPhone = (newId: string | number) => {
    const stringId = String(newId);
    if (ids.includes(stringId)) return;
    if (ids.length >= 4) {
      alert('You can compare a maximum of 4 smartphones.');
      return;
    }
    const updated = [...ids, stringId];
    setSearchParams({ ids: updated.join(',') });
  };

  const handleQuickCompare = (presetIds: string[]) => {
    setSearchParams({ ids: presetIds.join(',') });
  };

  const loadSummary = async () => {
    const result = await apiClient<AssistantSummary>('/assistant/compare-summary', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ phoneIds: ids, language: 'en' }) });
    setSummary(result);
  };

  return (
    <div className="space-y-8">
      {/* Compare Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Smartphone Comparison
              </h1>
            </div>
            <p className="text-slate-500 text-sm max-w-xl">
              Inspect side-by-side technical specifications for 2 to 4 devices. Differences are clearly tagged and highlighted.
            </p>
          </div>

          {ids.length < 4 && ids.length >= 2 && (
            <button
              onClick={() => setIsSelectorOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Smartphone</span>
            </button>
          )}
        </div>
      </div>

      {/* State: Fewer than 2 phones selected */}
      {ids.length < 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-10 md:p-14 text-center max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Select at least 2 smartphones to compare
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto mb-8">
            You currently have {ids.length} device selected. Choose 2 to 4 smartphones to view full side-by-side spec differences.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => setIsSelectorOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Choose Smartphones to Compare</span>
            </button>

            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400 block mb-2 font-medium">Or try a popular flagship matchup:</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handleQuickCompare(['43', '123'])}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  iPhone 15 Pro vs S24 Ultra
                </button>
                <button
                  onClick={() => handleQuickCompare(['43', '123', '150'])}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  iPhone 15 Pro vs S24 Ultra vs Pixel 8 Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {ids.length >= 2 && isLoading && <ComparisonTableSkeleton />}

      {/* Error State */}
      {ids.length >= 2 && isError && (
        <ErrorState
          title="Comparison Failed"
          message={(error as any)?.message || 'Could not load smartphone comparison details.'}
          onRetry={() => refetch()}
        />
      )}

      {/* Missing Devices Warning Banner */}
      {ids.length >= 2 && !isLoading && !isError && data?.missing && data.missing.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-sm">
            <span className="font-semibold">Some devices could not be loaded:</span>{' '}
            Device ID(s) {data.missing.join(', ')} were not found or are currently unavailable.
          </div>
        </div>
      )}

      {/* State: Insufficient valid phones returned */}
      {ids.length >= 2 && !isLoading && !isError && data && data.phones.length < 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center max-w-xl mx-auto shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Insufficient Devices for Comparison</h3>
          <p className="text-sm text-slate-600 mb-6">
            Only {data.phones.length} of the requested smartphones could be retrieved. Please add another device to view the comparison table.
          </p>
          <button
            onClick={() => setIsSelectorOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add a Smartphone</span>
          </button>
        </div>
      )}

      {/* Comparison Table */}
      {ids.length >= 2 && !isLoading && !isError && data && data.phones.length >= 2 && (
        <ComparisonTable
          phones={data.phones}
          onRemovePhone={handleRemovePhone}
          onAddPhone={handleAddPhone}
          onClearAll={() => setSearchParams({})}
        />
      )}
      {summary && <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/40"><h2 className="text-xl font-bold dark:text-white">{summary.headline}</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{summary.bestFor.map((item) => <div key={`${item.need}-${item.phoneId}`} className="rounded-xl bg-white p-3 dark:bg-slate-900 dark:text-slate-100"><strong>{item.need}</strong><p className="text-sm">{item.reason}</p></div>)}</div><p className="mt-3 text-sm dark:text-slate-200">{summary.caveat}</p></section>}

      {/* Selection Modal */}
      <PhoneSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={(selectedId) => {
          handleAddPhone(selectedId);
          setIsSelectorOpen(false);
        }}
        existingIds={ids}
      />
      {ids.length >= 2 && <AssistantPanel phoneIds={ids} compare onSummary={() => { void loadSummary(); }} />}
    </div>
  );
};
