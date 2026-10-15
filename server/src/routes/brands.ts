import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { mobileApiClient } from '../services/mobileApiClient.js';
import { cache } from '../services/cache.js';
import { AppError } from '../middleware/errorHandler.js';
import { Brand, BrandResponse } from '../types/index.js';

const router = Router();

const brandPageQuerySchema = z.object({
  page: z.string().optional().default('1').transform((val) => Math.max(1, parseInt(val, 10) || 1))
});

/**
 * GET /api/brands
 */
router.get('/brands', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = 'all_brands';
    const cached = cache.getBrands<Brand[]>(cacheKey);
    if (cached) {
      res.json({ brands: cached });
      return;
    }

    try {
      const brands = await mobileApiClient.getBrands();
      cache.setBrands(cacheKey, brands);
      res.json({ brands });
    } catch (err) {
      const stale = cache.getStale<Brand[]>('brands', cacheKey);
      if (stale) {
        res.json({ brands: stale });
        return;
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/brands/:brand?page=
 */
router.get('/brands/:brand', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { brand } = req.params;
    if (!brand || brand.trim() === '') {
      throw new AppError('INVALID_INPUT', 'Brand parameter is required', 400);
    }

    const parseResult = brandPageQuerySchema.safeParse(req.query);
    const page = parseResult.success ? parseResult.data.page : 1;

    const cacheKey = `brand:${brand.toLowerCase()}:${page}`;
    const cached = cache.getBrands<BrandResponse>(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    try {
      const data = await mobileApiClient.getPhonesByBrand(brand, page);
      cache.setBrands(cacheKey, data);
      res.json(data);
    } catch (err) {
      const stale = cache.getStale<BrandResponse>('brands', cacheKey);
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

export default router;
