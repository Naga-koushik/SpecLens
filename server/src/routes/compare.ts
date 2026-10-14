import { Router, Request, Response, NextFunction } from 'express';
import { mobileApiClient } from '../services/mobileApiClient.js';
import { cache } from '../services/cache.js';
import { AppError } from '../middleware/errorHandler.js';
import { Phone, CompareResponse } from '../types/index.js';

const router = Router();

/**
 * GET /api/compare?ids=1,2,3
 * Compares 2 to 4 phone IDs in parallel with cache-first lookup.
 */
router.get('/compare', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idsQuery = req.query.ids;
    if (!idsQuery || typeof idsQuery !== 'string') {
      throw new AppError('INVALID_INPUT', 'Parameter "ids" is required (comma-separated)', 400);
    }

    const rawIds = idsQuery
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    // Deduplicate IDs
    const uniqueIds = Array.from(new Set(rawIds));

    if (uniqueIds.length < 2 || uniqueIds.length > 4) {
      throw new AppError('INVALID_INPUT', 'Comparison requires between 2 and 4 distinct phone IDs', 400);
    }

    const phones: Phone[] = [];
    const missing: string[] = [];

    // Parallel fetch with cache-first lookup
    const fetchPromises = uniqueIds.map(async (id) => {
      // 1. Check cache first
      const cached = cache.getDetail<Phone>(id);
      if (cached) {
        return { id, phone: cached, success: true };
      }

      // 2. Fetch from client
      try {
        const phone = await mobileApiClient.getPhoneById(id);
        cache.setDetail(id, phone);
        return { id, phone, success: true };
      } catch (err) {
        return { id, phone: null, success: false };
      }
    });

    const results = await Promise.all(fetchPromises);

    for (const resItem of results) {
      if (resItem.success && resItem.phone) {
        phones.push(resItem.phone);
      } else {
        missing.push(resItem.id);
      }
    }

    if (phones.length === 0) {
      throw new AppError('NOT_FOUND', 'None of the requested phones could be found for comparison', 404);
    }

    const response: CompareResponse = {
      phones,
      missing
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
