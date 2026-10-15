import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { mobileApiClient } from '../services/mobileApiClient.js';
import { cache } from '../services/cache.js';
import { AppError } from '../middleware/errorHandler.js';
import { Phone, PhoneSummary, SearchResponse, AutocompleteSuggestion } from '../types/index.js';

const router = Router();

const searchQuerySchema = z.object({
  q: z.string().trim().min(1, 'Search query must not be empty'),
  page: z.string().optional().default('1').transform((val) => Math.max(1, parseInt(val, 10) || 1))
});

const autocompleteQuerySchema = z.object({
  q: z.string().trim().min(2, 'Query must be at least 2 characters'),
  limit: z.string().optional().default('5').transform((val) => Math.min(10, Math.max(1, parseInt(val, 10) || 5)))
});

/**
 * GET /api/phones/search?q=&page=
 */
router.get('/phones/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = searchQueryQueryCheck(req.query);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || 'Invalid search parameters';
      throw new AppError('INVALID_INPUT', firstError, 400);
    }

    const { q, page } = parseResult.data;

    // Below 2 characters, return empty list gracefully
    if (q.length < 2) {
      res.json({ results: [], page: 1, hasMore: false, total: 0 });
      return;
    }

    const cacheKey = `search:${q.toLowerCase()}:${page}`;
    const cached = cache.getSearch<SearchResponse>(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    try {
      const data = await mobileApiClient.searchPhones(q, page);
      cache.setSearch(cacheKey, data);
      res.json(data);
    } catch (err) {
      // Fallback to stale cache if available
      const stale = cache.getStale<SearchResponse>('search', cacheKey);
      if (stale) {
        res.json(stale);
        return;
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/phones/autocomplete?q=&limit=
 */
router.get('/phones/autocomplete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = autocompleteQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      // If query is under 2 chars, return empty suggestions rather than 400 error
      res.json({ suggestions: [] });
      return;
    }

    const { q, limit } = parseResult.data;
    const cacheKey = `ac:${q.toLowerCase()}:${limit}`;
    const cached = cache.getSearch<AutocompleteSuggestion[]>(cacheKey);
    if (cached) {
      res.json({ suggestions: cached });
      return;
    }

    const suggestions = await mobileApiClient.getAutocomplete(q, limit);
    cache.setSearch(cacheKey, suggestions);
    res.json({ suggestions });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/phones/popular
 */
router.get('/phones/popular', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = 'popular_phones';
    const cached = cache.getSearch<PhoneSummary[]>(cacheKey);
    if (cached) {
      res.json({ phones: cached });
      return;
    }

    const phones = await mobileApiClient.getPopularPhones();
    cache.setSearch(cacheKey, phones);
    res.json({ phones });
  } catch (err) {
    next(err);
  }
});

const phoneIdParamSchema = z
  .string()
  .trim()
  .regex(/^\d{1,12}$/, 'Phone ID must be numeric with up to 12 digits');

/**
 * GET /api/phones/:id
 */
router.get('/phones/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = phoneIdParamSchema.safeParse(req.params.id);
    if (!parseResult.success) {
      throw new AppError('INVALID_INPUT', parseResult.error.errors[0]?.message || 'Invalid phone ID', 400);
    }

    const id = parseResult.data;

    const cached = cache.getDetail<Phone>(id);
    if (cached) {
      res.json(cached);
      return;
    }

    try {
      const phone = await mobileApiClient.getPhoneById(id);
      cache.setDetail(id, phone);
      res.json(phone);
    } catch (err) {
      const stale = cache.getStale<Phone>('detail', id);
      if (stale) {
        res.json(stale);
        return;
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

function searchQueryQueryCheck(query: unknown) {
  return searchQuerySchema.safeParse(query);
}

export default router;
