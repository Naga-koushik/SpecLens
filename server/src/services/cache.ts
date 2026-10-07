import { LRUCache } from 'lru-cache';
import { env } from '../config/env.js';

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

class MemoryCache {
  private searchCache: LRUCache<string, CacheEntry<any>>;
  private detailCache: LRUCache<string, CacheEntry<any>>;
  private brandsCache: LRUCache<string, CacheEntry<any>>;

  constructor() {
    this.searchCache = new LRUCache({
      max: 500,
      ttl: env.CACHE_SEARCH_TTL_MS,
      allowStale: true
    });

    this.detailCache = new LRUCache({
      max: 1000,
      ttl: env.CACHE_DETAIL_TTL_MS,
      allowStale: true
    });

    this.brandsCache = new LRUCache({
      max: 100,
      ttl: env.CACHE_BRANDS_TTL_MS,
      allowStale: true
    });
  }

  // Search Cache
  getSearch<T>(key: string): T | undefined {
    const entry = this.searchCache.get(key);
    return entry?.data;
  }

  setSearch<T>(key: string, data: T): void {
    this.searchCache.set(key, { data, cachedAt: Date.now() });
  }

  // Detail Cache
  getDetail<T>(id: string | number): T | undefined {
    const entry = this.detailCache.get(String(id));
    return entry?.data;
  }

  setDetail<T>(id: string | number, data: T): void {
    this.detailCache.set(String(id), { data, cachedAt: Date.now() });
  }

  // Brands Cache
  getBrands<T>(key: string): T | undefined {
    const entry = this.brandsCache.get(key);
    return entry?.data;
  }

  setBrands<T>(key: string, data: T): void {
    this.brandsCache.set(key, { data, cachedAt: Date.now() });
  }

  // Fallback stale helper for resilience
  getStale<T>(type: 'search' | 'detail' | 'brands', key: string): T | undefined {
    let cache: LRUCache<string, CacheEntry<any>>;
    if (type === 'search') cache = this.searchCache;
    else if (type === 'detail') cache = this.detailCache;
    else cache = this.brandsCache;

    // In LRUCache, get with allowStale gives even expired entries if not evicted
    const entry = cache.get(key, { allowStale: true });
    return entry?.data;
  }

  clear(): void {
    this.searchCache.clear();
    this.detailCache.clear();
    this.brandsCache.clear();
  }
}

export const cache = new MemoryCache();
