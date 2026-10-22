import { FinderCriteria, FinderRange, FinderSet, FinderBucket, Phone, PhoneSummary } from '../types/index.js';
import { extractSpecs, ExtractedSpecs } from './specExtractor.js';
import { normalizePhoneSummary } from '../normalizers/phoneNormalizer.js';

type Criterion = keyof FinderCriteria;
export interface FinderExplanation { criterion: string; status: 'matched' | 'missed' | 'unknown'; actual: string; asked: string; }
export interface FinderResult { phone: PhoneSummary; score: number; explanations: FinderExplanation[]; summary: string; }
export interface FinderOutput { results: FinderResult[]; nearMisses: FinderResult[]; hints: Array<{ criterion: string; value: number | string; count: number; label: string }>; }

const numericKeys: Record<string, keyof ExtractedSpecs> = {
  size: 'screenInches', battery: 'batteryMah', ram: 'ramGbOptions', storage: 'storageGbOptions',
  refresh: 'refreshHz', weight: 'weightG', year: 'releaseYear', price: 'priceAmount'
};
const labels: Record<string, string> = { size: 'Screen size', battery: 'Battery', ram: 'RAM', storage: 'Storage', refresh: 'Refresh rate', weight: 'Weight', year: 'Release year', price: 'Price', display: 'Display', brand: 'Brand', os: 'OS' };
const screenBuckets: Record<string, { min?: number; max?: number }> = {
  compact: { max: 6.1 }, standard: { min: 6.1, max: 6.5 }, large: { min: 6.5, max: 6.8 }, 'extra-large': { min: 6.8 }
};

function valueFor(key: Criterion, spec: ExtractedSpecs, phone: Phone): number | string | null {
  if (key === 'sizeBuckets') return spec.screenInches;
  if (key === 'brand') return phone.brand;
  if (key === 'os') return spec.os;
  if (key === 'display') return spec.displayFamily;
  const value = spec[numericKeys[key]];
  return Array.isArray(value) ? (value.length ? Math.max(...value) : null) : value as number | null;
}
function format(value: number | string | null, key: string): string {
  if (value === null) return 'Unknown';
  return `${value}${key === 'battery' ? ' mAh' : key === 'size' ? ' in' : key === 'weight' ? ' g' : key === 'price' ? ' INR' : key === 'refresh' ? ' Hz' : ''}`;
}
function rangeScore(value: number | null, range: FinderRange): { score: number; status: FinderExplanation['status']; gap: number } {
  if (value === null) return { score: 0.5, status: 'unknown', gap: 0 };
  const min = range.min ?? -Infinity; const max = range.max ?? Infinity;
  if (value >= min && value <= max) return { score: 1, status: 'matched', gap: 0 };
  const edge = value < min ? min - value : value - max;
  const width = Math.max((Number.isFinite(min) && Number.isFinite(max) ? max - min : Math.abs(Number.isFinite(min) ? min : max) * 0.1), 1);
  return { score: Math.max(0, 1 - edge / (width * 0.1)), status: 'missed', gap: edge };
}
function setScore(value: string | null, set: FinderSet): { score: number; status: FinderExplanation['status'] } {
  if (!value) return { score: 0.5, status: 'unknown' };
  const matched = set.anyOf.some((item) => value.toLowerCase().includes(item.toLowerCase()));
  return { score: matched ? 1 : 0, status: matched ? 'matched' : 'missed' };
}
function bucketScore(value: number | null, bucket: FinderBucket): { score: number; status: FinderExplanation['status']; gap: number } {
  if (value === null) return { score: 0.5, status: 'unknown', gap: 0 };
  const matched = bucket.ids.some((id) => {
    const band = screenBuckets[id]; return band && (band.min === undefined || value >= band.min) && (band.max === undefined || value <= band.max);
  });
  return matched ? { score: 1, status: 'matched', gap: 0 } : { score: 0, status: 'missed', gap: 0.1 };
}

export function rankPhones(phones: Phone[], criteria: FinderCriteria): FinderOutput {
  const ranked: FinderResult[] = []; const near: FinderResult[] = []; const failures = new Map<string, number>(); const failureValues = new Map<string, number[]>();
  for (const phone of phones) {
    const spec = extractSpecs(phone); const explanations: FinderExplanation[] = []; let weighted = 0; let weights = 0; let mustFails = 0; let nearGap = 0;
    for (const [key, criterion] of Object.entries(criteria)) {
      if (key === 'hideMissing' || !criterion) continue;
      const typed = criterion as FinderRange | FinderSet | FinderBucket; const value = valueFor(key as Criterion, spec, phone);
      let status: FinderExplanation['status']; let score: number; let gap = 1;
      if ('ids' in typed) {
        const bucketResult = bucketScore(spec.screenInches, typed);
        status = bucketResult.status; score = bucketResult.score; gap = bucketResult.gap;
      } else if ('anyOf' in typed) {
        const setResult = setScore(value as string | null, typed);
        status = setResult.status; score = status === 'matched' ? 1 : status === 'missed' ? 0 : 0.5;
      } else {
        const rangeResult = rangeScore(value as number | null, typed);
        status = rangeResult.status; score = rangeResult.score; gap = rangeResult.gap;
      }
      explanations.push({ criterion: labels[key] ?? key.replace('Buckets', ''), status, actual: format(value, key), asked: 'ids' in typed ? typed.ids.join(', ') : 'anyOf' in typed ? typed.anyOf.join(', ') : `${typed.min ?? 'any'}–${typed.max ?? 'any'}` });
      if (typed.mode === 'must' && status === 'missed') {
        mustFails++; nearGap += gap; failures.set(key, (failures.get(key) ?? 0) + 1);
        if (typeof value === 'number') failureValues.set(key, [...(failureValues.get(key) ?? []), value]);
      }
      if (typed.mode === 'nice') { weighted += score * typed.weight; weights += typed.weight; }
    }
    if (criteria.hideMissing && explanations.some((item) => item.status === 'unknown')) continue;
    const result: FinderResult = { phone: normalizePhoneSummary(phone), score: Math.round((weights ? weighted / weights : 1) * 100), explanations, summary: `Matches ${explanations.filter((item) => item.status === 'matched').length} of ${explanations.length} criteria` };
    if (mustFails === 0) ranked.push(result);
    else if (mustFails === 1 && nearGap <= 100) near.push(result);
  }
  const sort = (a: FinderResult, b: FinderResult) => b.score - a.score || String(b.phone.releaseDate ?? '').localeCompare(String(a.phone.releaseDate ?? '')) || a.phone.name.localeCompare(b.phone.name);
  ranked.sort(sort); near.sort(sort);
  const hints = [...failures.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([criterion, count]) => {
    const values = failureValues.get(criterion) ?? [];
    const typed = criteria[criterion as keyof FinderCriteria] as FinderRange | undefined;
    const value = values.length ? (typed?.min !== undefined ? Math.max(...values) : Math.min(...values)) : 'remove limit';
    return { criterion, value, count, label: `Relax ${labels[criterion] ?? criterion} to ${value}${criterion === 'battery' ? ' mAh' : criterion === 'size' ? ' in' : criterion === 'weight' ? ' g' : ''} — ${count} more phones` };
  });
  return { results: ranked, nearMisses: near, hints };
}
