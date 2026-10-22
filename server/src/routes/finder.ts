import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler.js';
import { cache } from '../services/cache.js';
import { catalog } from '../services/catalog/index.js';
import { FinderCriteria, FinderRange, FinderSet, FinderBucket } from '../types/index.js';
import { extractSpecs } from '../finder/specExtractor.js';
import { rankPhones } from '../finder/engine.js';

const router = Router();
const numericFields = ['size', 'battery', 'ram', 'storage', 'refresh', 'weight', 'year', 'price'] as const;
const rangePattern = /^(\d+(?:\.\d+)?|\d+(?:\.\d+)?k)?-(\d+(?:\.\d+)?|\d+(?:\.\d+)?k)?:(must|nice)(?::([1-5]))?$/i;
function parseValue(value: string): number {
  const parsed = Number(value.toLowerCase().endsWith('k') ? value.slice(0, -1) + '000' : value);
  if (!Number.isFinite(parsed) || parsed < 0) throw new AppError('INVALID_INPUT', 'Range values must be finite and non-negative', 400);
  return parsed;
}
function parseCriteria(query: Record<string, unknown>): FinderCriteria {
  const criteria: FinderCriteria = {};
  if (query.sizeBuckets !== undefined) {
    if (typeof query.sizeBuckets !== 'string') throw new AppError('INVALID_INPUT', 'sizeBuckets must be a comma-separated list', 400);
    const ids = query.sizeBuckets.split(',').filter(Boolean);
    const valid = new Set(['compact', 'standard', 'large', 'extra-large']);
    if (ids.length === 0 || ids.some((id) => !valid.has(id))) throw new AppError('INVALID_INPUT', 'Invalid size bucket id', 400);
    criteria.sizeBuckets = { ids: [...new Set(ids)].slice(0, 4), mode: query.sizeBucketsMode === 'must' ? 'must' : 'nice', weight: 3 } satisfies FinderBucket;
  }
  for (const key of numericFields) {
    const raw = query[key];
    if (raw === undefined) continue;
    if (typeof raw !== 'string') throw new AppError('INVALID_INPUT', `${key} must be a string range`, 400);
    const match = raw.match(rangePattern);
    if (!match) throw new AppError('INVALID_INPUT', `Invalid ${key} range`, 400);
    const range: FinderRange = { mode: match[3].toLowerCase() as FinderRange['mode'], weight: Number(match[4] ?? 3) };
    if (match[1]) range.min = parseValue(match[1]);
    if (match[2]) range.max = parseValue(match[2]);
    if (range.min !== undefined && range.max !== undefined && range.min > range.max) throw new AppError('INVALID_INPUT', `${key} minimum exceeds maximum`, 400);
    criteria[key] = range;
  }
  for (const key of ['display', 'brand', 'os'] as const) {
    const raw = query[key];
    if (raw === undefined) continue;
    if (typeof raw !== 'string' || !raw) throw new AppError('INVALID_INPUT', `${key} must list values`, 400);
    const parts = raw.split(',').map((part) => part.trim()).filter(Boolean);
    const mode = (query[`${key}Mode`] === 'nice' ? 'nice' : 'must') as FinderSet['mode'];
    criteria[key] = { anyOf: parts.slice(0, 12), mode, weight: 3 };
  }
  if (query.hideMissing === 'true') criteria.hideMissing = true;
  return criteria;
}
router.get('/finder/facets', (_req: Request, res: Response) => {
  const phones = catalog.getPhones();
  const counts = { brand: {} as Record<string, number>, display: {} as Record<string, number>, histograms: {} as Record<string, Record<string, number>>, ranges: {} as Record<string, { min: number; max: number }> };
  const histogramKeys = ['size', 'battery', 'ram', 'storage', 'refresh', 'weight', 'year', 'price'];
  histogramKeys.forEach((key) => { counts.histograms[key] = {}; });
  phones.forEach((phone) => {
    counts.brand[phone.brand] = (counts.brand[phone.brand] ?? 0) + 1;
    const display = extractSpecs(phone).displayFamily;
    counts.display[display] = (counts.display[display] ?? 0) + 1;
    const specs = extractSpecs(phone);
    const values: Record<string, number | null> = { size: specs.screenInches, battery: specs.batteryMah, ram: specs.ramGbOptions.length ? Math.max(...specs.ramGbOptions) : null, storage: specs.storageGbOptions.length ? Math.max(...specs.storageGbOptions) : null, refresh: specs.refreshHz, weight: specs.weightG, year: specs.releaseYear, price: specs.priceAmount };
    Object.entries(values).forEach(([key, value]) => { if (value !== null) { const bucket = String(value); counts.histograms[key][bucket] = (counts.histograms[key][bucket] ?? 0) + 1; const current = counts.ranges[key]; counts.ranges[key] = { min: current ? Math.min(current.min, value) : value, max: current ? Math.max(current.max, value) : value }; } });
  });
  res.json({ ...counts, total: phones.length, priceUsable: phones.filter((phone) => phone.price?.amount).length / Math.max(phones.length, 1) >= 0.3, demoData: catalog.isDemo });
});
router.get('/finder/search', (req: Request, res: Response, next: NextFunction) => {
  try {
    const criteria = parseCriteria(req.query as Record<string, unknown>);
    const page = Math.max(1, Math.min(100, Number(req.query.page ?? 1) || 1));
    const limit = Math.max(1, Math.min(48, Number(req.query.limit ?? 24) || 24));
    const cacheKey = `finder:${JSON.stringify(req.query)}`;
    const cached = cache.getSearch<unknown>(cacheKey);
    if (cached) { res.json(cached); return; }
    const output = rankPhones(catalog.getPhones(), criteria);
    const start = (page - 1) * limit;
    const response = { total: output.results.length, results: output.results.slice(start, start + limit), nearMisses: output.nearMisses.slice(0, 12), hints: output.hints, appliedCriteria: criteria, page, hasMore: start + limit < output.results.length, demoData: catalog.isDemo };
    cache.setSearch(cacheKey, response);
    res.json(response);
  } catch (error) { next(error); }
});
export default router;
