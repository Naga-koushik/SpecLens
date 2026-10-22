import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { FinderBucket, FinderCriteria, FinderFacets, FinderRange, FinderResponse, FinderSet } from '../types';
import { FINDER_CONTROLS, FinderControlDefinition, SCREEN_BANDS } from '../constants/finderControls';
import { finderPresets } from '../constants/finderPresets';
import { parseFinderPhrase } from '../utils/finderParser';
import { useSavedSearches } from '../hooks/useSavedSearches';
import { ErrorState } from '../components/common/ErrorState';
import { PhoneCard } from '../components/phone/PhoneCard';
import { GlossaryTerm } from '../components/common/GlossaryTerm';

const setKeys = ['display', 'brand', 'os'] as const;
const encodeCriteria = (criteria: FinderCriteria): string => {
  const params = new URLSearchParams();
  if (criteria.sizeBuckets) params.set('sizeBuckets', `${criteria.sizeBuckets.ids.join(',')}`);
  if (criteria.sizeBuckets?.mode) params.set('sizeBucketsMode', criteria.sizeBuckets.mode);
  FINDER_CONTROLS.forEach(({ key }) => {
    const value = criteria[key];
    if (!value) return;
    params.set(key, `${value.min ?? ''}-${value.max ?? ''}:${value.mode}:${value.weight}`);
  });
  setKeys.forEach((key) => {
    const value = criteria[key];
    if (value) {
      params.set(key, value.anyOf.join(','));
      params.set(`${key}Mode`, value.mode);
    }
  });
  if (criteria.hideMissing) params.set('hideMissing', 'true');
  return params.toString();
};

const decodeCriteria = (params: URLSearchParams): FinderCriteria => {
  const criteria: FinderCriteria = {};
  const bucketIds = params.get('sizeBuckets');
  if (bucketIds) criteria.sizeBuckets = { ids: bucketIds.split(',').filter(Boolean), mode: params.get('sizeBucketsMode') === 'must' ? 'must' : 'nice', weight: 3 };
  FINDER_CONTROLS.forEach(({ key }) => {
    const raw = params.get(key);
    if (!raw) return;
    const [bounds, mode, weight] = raw.split(':');
    const [min, max] = bounds.split('-');
    criteria[key] = { min: min ? Number(min) : undefined, max: max ? Number(max) : undefined, mode: mode === 'must' ? 'must' : 'nice', weight: Math.min(5, Math.max(1, Number(weight) || 3)) };
  });
  setKeys.forEach((key) => {
    const raw = params.get(key);
    if (raw) criteria[key] = { anyOf: raw.split(',').filter(Boolean), mode: params.get(`${key}Mode`) === 'must' ? 'must' : 'nice', weight: 3 };
  });
  if (params.get('hideMissing') === 'true') criteria.hideMissing = true;
  return criteria;
};

const makeRange = (current: FinderRange | undefined, control: FinderControlDefinition, field: 'min' | 'max', value: number): FinderRange => ({
  ...(current ?? {}),
  [field]: value,
  mode: current?.mode ?? 'nice',
  weight: current?.weight ?? 3
});

const Hist = ({ values, min, max }: { values?: Record<string, number>; min: number; max: number }) => {
  const entries = Object.entries(values ?? {});
  const peak = Math.max(1, ...entries.map(([, count]) => count));
  return <div aria-hidden="true" className="flex h-6 items-end gap-px opacity-70">{entries.slice(0, 24).map(([value, count]) => <span key={value} className="flex-1 min-w-[2px] bg-emerald-400" style={{ height: `${Math.max(10, count / peak * 100)}%` }} />)}{entries.length === 0 && <span className="h-px w-full bg-slate-300 dark:bg-slate-600" />}<span className="sr-only">{min} to {max}</span></div>;
};

interface RangeControlProps { definition: FinderControlDefinition; value?: FinderRange; histogram?: Record<string, number>; onChange: (value?: FinderRange) => void; }
const RangeControl: React.FC<RangeControlProps> = ({ definition, value, histogram, onChange }) => {
  const active = Boolean(value);
  const range = value ?? { mode: 'nice' as const, weight: 3 };
  const isRange = definition.direction === 'range';
  const minValue = range.min ?? definition.min;
  const maxValue = range.max ?? definition.max;
  const human = definition.direction === 'atLeast' ? `${minValue} ${definition.unit} or more` : definition.direction === 'atMost' ? `Up to ${maxValue} ${definition.unit}` : `${minValue}–${maxValue} ${definition.unit}`;
  const change = (field: 'min' | 'max', next: number) => onChange(makeRange(range, definition, field, next));
  return <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 p-3">
    <div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{definition.label}</span><button type="button" onClick={() => onChange(active ? undefined : { mode: 'nice', weight: 3, [definition.direction === 'atMost' ? 'max' : 'min']: definition.direction === 'atMost' ? definition.max : definition.min })} className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 underline">{active ? 'Reset' : 'Any'}</button></div>
    <div className="mt-2"><Hist values={histogram} min={definition.min} max={definition.max} /><div className="relative h-8">
      <input aria-label={`${definition.label} minimum`} aria-valuetext={active ? human : 'Any'} disabled={!active} type="range" min={definition.min} max={definition.max} step={definition.step} value={minValue} onChange={(event) => change('min', Number(event.target.value))} className="absolute inset-x-0 top-1/2 w-full accent-emerald-600 disabled:opacity-40" />
      {isRange && <input aria-label={`${definition.label} maximum`} aria-valuetext={active ? human : 'Any'} disabled={!active} type="range" min={definition.min} max={definition.max} step={definition.step} value={maxValue} onChange={(event) => change('max', Number(event.target.value))} className="absolute inset-x-0 top-1/2 w-full accent-emerald-600 disabled:opacity-40" />}
    </div><div className="flex justify-between text-xs text-slate-500 dark:text-slate-300"><span>{active ? human : 'Any'}</span><span>{definition.unit}</span></div></div>
    <MustNice value={range} onChange={(next) => onChange({ ...range, ...next })} />
  </div>;
};

const MustNice: React.FC<{ value: { mode: 'must' | 'nice'; weight: number }; onChange: (value: { mode: 'must' | 'nice'; weight: number }) => void }> = ({ value, onChange }) => <div className="mt-3 flex flex-wrap items-center gap-2">
  <div role="group" aria-label="Requirement strength" className="inline-flex rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden">
    {(['must', 'nice'] as const).map((mode) => <button key={mode} type="button" aria-pressed={value.mode === mode} onClick={() => onChange({ mode, weight: mode === 'must' ? value.weight : value.weight || 3 })} className={`min-h-[44px] px-3 text-xs font-bold focus-visible:ring-2 focus-visible:ring-emerald-500 ${value.mode === mode ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'}`}>{mode === 'must' ? 'Must have' : 'Nice to have'}</button>)}
  </div>
  {value.mode === 'nice' && <div role="group" aria-label="Importance" className="flex gap-1">{[['Low', 1], ['Medium', 3], ['High', 5]].map(([label, weight]) => <button key={String(label)} type="button" aria-pressed={value.weight === weight} onClick={() => onChange({ mode: 'nice', weight: Number(weight) })} className={`min-h-[44px] rounded-lg px-2 text-xs font-semibold border ${value.weight === weight ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'}`}>{label}</button>)}</div>}
</div>;

export const FinderPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [criteria, setCriteria] = useState<FinderCriteria>(() => decodeCriteria(params));
  const [phrase, setPhrase] = useState('');
  const [response, setResponse] = useState<FinderResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { save } = useSavedSearches();
  const parsed = useMemo(() => parseFinderPhrase(phrase), [phrase]);
  const facets = useQuery({ queryKey: ['finder-facets'], queryFn: () => apiClient<FinderFacets>('/finder/facets'), staleTime: 300000 });
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const query = encodeCriteria(criteria);
      setParams(new URLSearchParams(query), { replace: true });
      apiClient<FinderResponse>(`/finder/search?${query}`).then(setResponse).catch((err: unknown) => setError(err instanceof Error ? err : new Error('Finder request failed')));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [criteria, setParams]);
  const setRange = (key: FinderControlDefinition['key'], value?: FinderRange) => setCriteria((current) => ({ ...current, [key]: value }));
  const setSet = (key: typeof setKeys[number], values: string[]) => setCriteria((current) => ({ ...current, [key]: values.length ? { anyOf: values, mode: current[key]?.mode ?? 'nice', weight: current[key]?.weight ?? 3 } : undefined }));
  const applyPreset = (preset: typeof finderPresets[number]) => setCriteria(preset.criteria);
  const setBucketMode = (bucket: FinderBucket, mode: FinderBucket['mode']) => setCriteria((current) => ({ ...current, sizeBuckets: { ...bucket, mode } }));
  return <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
    <aside className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-24 lg:h-fit">
      <div><h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Find my phone</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Must-haves set the boundary. Nice-to-haves explain the ranking.</p></div>
      <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">Describe it in plain English<input value={phrase} onChange={(event) => setPhrase(event.target.value)} placeholder="6.5 inch amoled 5000mah under 30k" className="mt-2 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" /></label>
      {phrase && <div className="space-y-2 rounded-xl bg-slate-100 p-3 text-xs dark:bg-slate-800"><p>Editable chips: {parsed.understood.length ? parsed.understood.map((item) => <button key={item} type="button" onClick={() => setCriteria(parsed.criteria)} className="mr-1 rounded-full bg-emerald-100 px-2 py-1 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">{item} ×</button>) : 'none'}</p>{parsed.unknown.length > 0 && <p className="text-amber-700 dark:text-amber-300">Not understood: {parsed.unknown.join(', ')}</p>}<button type="button" onClick={() => setCriteria(parsed.criteria)} className="font-semibold text-emerald-700 underline dark:text-emerald-400">Apply parsed criteria</button></div>}
      <div><h2 className="mb-2 font-bold text-slate-900 dark:text-white">Starting profiles</h2><div className="grid grid-cols-2 gap-2">{finderPresets.map((preset) => <button key={preset.name} type="button" title={preset.description} onClick={() => applyPreset(preset)} className="min-h-[44px] rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:border-emerald-500 dark:border-slate-600 dark:text-slate-100">{preset.name}</button>)}</div></div>
      <div className="space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"><div className="mb-2 flex items-center justify-between"><span className="text-sm font-semibold dark:text-white">Screen size</span><button type="button" onClick={() => setCriteria((current) => ({ ...current, sizeBuckets: undefined }))} className="text-xs text-emerald-700 underline dark:text-emerald-400">Reset</button></div><div className="grid grid-cols-2 gap-2">{SCREEN_BANDS.map((band) => { const selected = criteria.sizeBuckets?.ids.includes(band.id); return <button key={band.id} type="button" aria-pressed={selected} onClick={() => { const ids = selected ? criteria.sizeBuckets!.ids.filter((id) => id !== band.id) : [...(criteria.sizeBuckets?.ids ?? []), band.id]; setCriteria((current) => ({ ...current, sizeBuckets: ids.length ? { ids, mode: current.sizeBuckets?.mode ?? 'nice', weight: current.sizeBuckets?.weight ?? 3 } : undefined })); }} className={`min-h-[56px] rounded-xl border p-2 text-left text-xs ${selected ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950' : 'border-slate-300 dark:border-slate-600'}`}><strong className="block dark:text-white">{band.label}</strong><span className="text-slate-500 dark:text-slate-300">{band.hint} ({facets.data?.histograms.size ? Object.entries(facets.data.histograms.size).filter(([size]) => (band.min === undefined || Number(size) >= band.min) && (band.max === undefined || Number(size) <= band.max)).reduce((sum, [, count]) => sum + count, 0) : 0})</span></button>; })}</div>{criteria.sizeBuckets && <MustNice value={criteria.sizeBuckets} onChange={(next) => setBucketMode(criteria.sizeBuckets!, next.mode)} />}</div>
        {FINDER_CONTROLS.filter((control) => control.key !== 'price' || facets.data?.priceUsable).map((control) => <RangeControl key={control.key} definition={control} value={criteria[control.key]} histogram={facets.data?.histograms[control.key]} onChange={(value) => setRange(control.key, value)} />)}
        {!facets.data?.priceUsable && <p className="text-xs text-slate-500 dark:text-slate-300">Price data is limited for this data source.</p>}
      </div>
      {(['display', 'os'] as const).map((key) => <div key={key}><h2 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{key === 'display' ? <GlossaryTerm term="AMOLED">Display type</GlossaryTerm> : 'Operating system'}</h2><div className="flex flex-wrap gap-2">{(key === 'display' ? ['AMOLED', 'LTPO', 'OLED', 'IPS', 'LCD'] : ['Android', 'iOS']).map((option) => { const selected = criteria[key]?.anyOf.includes(option); return <button key={option} type="button" aria-pressed={selected} onClick={() => setSet(key, selected ? criteria[key]!.anyOf.filter((item) => item !== option) : [...(criteria[key]?.anyOf ?? []), option])} className={`min-h-[44px] rounded-xl border px-3 text-xs font-semibold ${selected ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'border-slate-300 dark:border-slate-600 dark:text-slate-100'}`}>{option} ({facets.data?.[key === 'display' ? 'display' : 'display']?.[option] ?? 0})</button>; })}</div>{criteria[key] && <MustNice value={criteria[key]!} onChange={(next) => setCriteria((current) => ({ ...current, [key]: { ...current[key]!, ...next } }))} />}</div>)}
      <div><h2 className="mb-2 text-sm font-semibold dark:text-white">Brand</h2><div className="max-h-36 space-y-1 overflow-auto">{Object.entries(facets.data?.brand ?? {}).map(([brand, count]) => <label key={brand} className="flex min-h-[44px] items-center gap-2 text-sm dark:text-slate-100"><input type="checkbox" checked={criteria.brand?.anyOf.includes(brand) ?? false} onChange={(event) => setSet('brand', event.target.checked ? [...(criteria.brand?.anyOf ?? []), brand] : criteria.brand!.anyOf.filter((item) => item !== brand))} />{brand} ({count})</label>)}</div></div>
      <label className="flex min-h-[44px] items-center gap-2 text-sm dark:text-slate-100"><input type="checkbox" checked={criteria.hideMissing ?? false} onChange={(event) => setCriteria((current) => ({ ...current, hideMissing: event.target.checked }))} /> Hide phones with missing data</label>
      <button type="button" className="min-h-[44px] w-full rounded-xl bg-emerald-600 font-semibold text-white" onClick={() => { const name = window.prompt('Name this search'); if (name) save(name, criteria); }}>Save this search</button>
    </aside>
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><div aria-live="polite"><h2 className="text-2xl font-bold dark:text-white">Your matches</h2><p className="text-sm text-slate-500 dark:text-slate-300">{response?.total ?? 0} phones match</p></div>{response && response.results.length >= 3 && <Link to={`/compare?ids=${response.results.slice(0, 3).map((item) => item.phone.id).join(',')}`} className="min-h-[44px] rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Compare top 3</Link>}</div>
      {error && <ErrorState title="Finder failed" message={error.message} onRetry={() => { setError(null); setCriteria({ ...criteria }); }} />}
      {!error && response?.demoData && <p className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Demo data — prices are unverified</p>}
      {!error && response?.results.length === 0 && response?.nearMisses.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-slate-500 dark:bg-slate-900 dark:text-slate-300">No exact matches. Try changing a Must to Nice; the closest phones will remain visible when available.</p>}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{response?.results.map((result) => <article key={String(result.phone.id)} className="space-y-2"><PhoneCard phone={result.phone} /><div className="rounded-xl border bg-white p-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"><div className="flex justify-between text-sm font-bold"><span>{result.score}/100</span><span>{result.summary}</span></div><div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${result.score}%` }} /></div>{result.explanations.map((item) => <div key={item.criterion} className="mt-1 text-xs">{item.status === 'matched' ? '✓ Matched' : item.status === 'missed' ? '✗ Missed' : '? Unknown'} — {item.criterion}: {item.actual} (asked {item.asked})</div>)}</div></article>)}</div>
      {response && response.nearMisses.length > 0 && <div><h2 className="mb-3 text-xl font-bold dark:text-white">Almost matches</h2><div className="grid gap-4 sm:grid-cols-2">{response.nearMisses.map((result) => <div key={String(result.phone.id)} className="rounded-2xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900"><Link className="font-bold text-emerald-700 dark:text-emerald-400" to={`/phones/${result.phone.id}`}>{result.phone.name}</Link>{result.explanations.filter((item) => item.status === 'missed').map((item) => <p key={item.criterion} className="mt-2 text-sm text-amber-700 dark:text-amber-300">Misses {item.criterion}: {item.actual} (asked {item.asked})</p>)}</div>)}</div></div>}
      <div className="flex flex-wrap gap-3">{response?.hints.map((hint) => <button key={hint.criterion} type="button" className="text-sm text-emerald-700 underline dark:text-emerald-400" onClick={() => setCriteria((current) => { const next = { ...current }; delete next[hint.criterion as keyof FinderCriteria]; return next; })}>{hint.label}</button>)}</div>
    </section>
  </div>;
};
