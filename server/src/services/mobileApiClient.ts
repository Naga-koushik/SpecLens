import { env } from '../config/env.js';
import { Phone, PhoneSummary, Brand, AutocompleteSuggestion } from '../types/index.js';
import { MOCK_PHONES, MOCK_BRANDS, POPULAR_PHONE_NAMES } from '../fixtures/mockData.js';
import { normalizePhone, normalizePhoneSummary } from '../normalizers/phoneNormalizer.js';
import { AppError } from '../middleware/errorHandler.js';
import { cache } from './cache.js';

const BASE_URL = 'https://api.mobileapi.dev';
export const UPSTREAM_TIMEOUT_MS = 8000;

class MobileApiClient {
  private mockModeOverride: boolean | null = null;

  public setMockModeOverride(override: boolean | null): void {
    this.mockModeOverride = override;
  }

  private get isMockMode(): boolean {
    if (this.mockModeOverride !== null) {
      return this.mockModeOverride;
    }
    return env.NODE_ENV === 'test' || env.USE_MOCK || !env.MOBILEAPI_KEY;
  }

  /**
   * Helper to make authenticated upstream requests with strict timeouts.
   */
  private async fetchUpstream<T>(endpoint: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${env.MOBILEAPI_KEY}`,
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 400) {
          throw new AppError('INVALID_INPUT', 'Upstream rejected the request format', 400);
        } else if (response.status === 404) {
          throw new AppError('NOT_FOUND', 'Device or resource not found', 404);
        } else if (response.status === 429) {
          throw new AppError('RATE_LIMITED', 'Upstream rate limit reached. Please wait a moment.', 429);
        } else if (response.status >= 500) {
          throw new AppError('UPSTREAM_UNAVAILABLE', 'MobileAPI.dev is currently unavailable', 502);
        } else {
          throw new AppError('UPSTREAM_UNAVAILABLE', `Upstream error (${response.status})`, 502);
        }
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err instanceof AppError) throw err;
      if (err.name === 'AbortError') {
        throw new AppError('UPSTREAM_TIMEOUT', `Upstream request timed out after ${UPSTREAM_TIMEOUT_MS / 1000}s`, 504);
      }
      throw new AppError('UPSTREAM_UNAVAILABLE', 'Failed to communicate with external provider', 502);
    }
  }

  /**
   * Search phones by query string with pagination.
   */
  async searchPhones(query: string, page = 1, limit = 10): Promise<{ results: PhoneSummary[]; page: number; hasMore: boolean; total: number }> {
    if (this.isMockMode) {
      const cleanQ = query.toLowerCase().trim();
      const matched = MOCK_PHONES.filter(
        (p) => p.name.toLowerCase().includes(cleanQ) || p.brand.toLowerCase().includes(cleanQ)
      );

      const startIndex = (page - 1) * limit;
      const paginated = matched.slice(startIndex, startIndex + limit);
      const hasMore = startIndex + limit < matched.length;

      return {
        results: paginated.map((p) => normalizePhoneSummary(p)),
        page,
        hasMore,
        total: matched.length
      };
    }

    const data = await this.fetchUpstream<{
      total: number;
      page: number;
      has_next: boolean;
      devices: any[];
    }>(`/devices/search/?name=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);

    const results = (data.devices || []).map((d) => normalizePhoneSummary(d));
    return {
      results,
      page: data.page || page,
      hasMore: !!data.has_next,
      total: data.total || results.length
    };
  }

  /**
   * Autocomplete suggestions (min 2 chars).
   */
  async getAutocomplete(query: string, limit = 5): Promise<AutocompleteSuggestion[]> {
    if (this.isMockMode) {
      const cleanQ = query.toLowerCase().trim();
      const matches = MOCK_PHONES.filter(
        (p) => p.name.toLowerCase().includes(cleanQ) || p.brand.toLowerCase().includes(cleanQ)
      ).slice(0, limit);

      return matches.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        thumbnail: p.image
      }));
    }

    const data = await this.fetchUpstream<any[]>(
      `/devices/autocomplete/?q=${encodeURIComponent(query)}&limit=${limit}`
    );

    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      brand: typeof item.brand === 'string' ? item.brand : item.brand?.name ?? '',
      thumbnail: null
    }));
  }

  /**
   * Curated popular phones.
   */
  async getPopularPhones(): Promise<PhoneSummary[]> {
    if (this.isMockMode) {
      const popular = MOCK_PHONES.filter((p) =>
        POPULAR_PHONE_NAMES.some((name) => p.name.toLowerCase().includes(name.toLowerCase()))
      ).slice(0, 6);

      return popular.map((p) => normalizePhoneSummary(p));
    }

    // In real mode, fetch devices in a single call to protect request quota (5 req/min free tier)
    try {
      const data = await this.fetchUpstream<{ devices: any[] }>('/devices/?page=1&limit=6');
      if (data && Array.isArray(data.devices) && data.devices.length > 0) {
        return data.devices.map((d) => normalizePhoneSummary(d));
      }
    } catch {
      // Fallback if upstream device list is unreachable or throttled
    }

    // Secondary fallback to curated mock phones so the home page never renders blank
    const fallbackPopular = MOCK_PHONES.filter((p) =>
      POPULAR_PHONE_NAMES.some((name) => p.name.toLowerCase().includes(name.toLowerCase()))
    ).slice(0, 6);
    return fallbackPopular.map((p) => normalizePhoneSummary(p));
  }

  /**
   * Get full phone specification by ID.
   */
  async getPhoneById(id: string | number): Promise<Phone> {
    if (this.isMockMode) {
      const phone = MOCK_PHONES.find((p) => String(p.id) === String(id));
      if (!phone) {
        throw new AppError('NOT_FOUND', `Smartphone with ID '${id}' was not found`, 404);
      }
      return normalizePhone(phone);
    }

    const data = await this.fetchUpstream<any>(`/devices/${encodeURIComponent(String(id))}/`);
    return normalizePhone(data);
  }

  /**
   * Get brand manufacturers list.
   */
  async getBrands(): Promise<Brand[]> {
    if (this.isMockMode) {
      return MOCK_BRANDS;
    }

    const data = await this.fetchUpstream<{
      manufacturers: Array<{ id: number; name: string }>;
    }>('/manufacturers/?page=1&limit=30');

    if (!data.manufacturers || !Array.isArray(data.manufacturers)) {
      return [];
    }

    return data.manufacturers.map((m) => ({
      name: m.name,
      slug: m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }));
  }

  /**
   * Get phones by manufacturer brand with pagination.
   */
  async getPhonesByBrand(brandSlug: string, page = 1, limit = 10): Promise<{ brand: string; results: PhoneSummary[]; page: number; hasMore: boolean; total: number }> {
    if (this.isMockMode) {
      const brandMatch = MOCK_BRANDS.find(
        (b) => b.slug.toLowerCase() === brandSlug.toLowerCase() || b.name.toLowerCase() === brandSlug.toLowerCase()
      );

      const brandName = brandMatch?.name || brandSlug;
      const matched = MOCK_PHONES.filter(
        (p) => p.brand.toLowerCase() === brandName.toLowerCase()
      );

      const startIndex = (page - 1) * limit;
      const paginated = matched.slice(startIndex, startIndex + limit);
      const hasMore = startIndex + limit < matched.length;

      return {
        brand: brandName,
        results: paginated.map((p) => normalizePhoneSummary(p)),
        page,
        hasMore,
        total: matched.length
      };
    }

    let brandName = brandSlug;
    try {
      const cached = cache.getBrands<Brand[]>('all_brands');
      const brands = cached || (await this.getBrands());
      const brandMatch = brands.find(
        (b) => b.slug.toLowerCase() === brandSlug.toLowerCase() || b.name.toLowerCase() === brandSlug.toLowerCase()
      );
      if (brandMatch) {
        brandName = brandMatch.name;
      }
    } catch {
      // Fall back to slug only if not found
    }

    const data = await this.fetchUpstream<{
      manufacturer: string;
      total: number;
      page: number;
      has_next: boolean;
      devices: any[];
    }>(`/devices/by-manufacturer/?manufacturer=${encodeURIComponent(brandName)}&page=${page}&limit=${limit}`);

    const results = (data.devices || []).map((d) => normalizePhoneSummary(d));
    return {
      brand: data.manufacturer || brandName,
      results,
      page: data.page || page,
      hasMore: !!data.has_next,
      total: data.total || results.length
    };
  }
}

export const mobileApiClient = new MobileApiClient();
