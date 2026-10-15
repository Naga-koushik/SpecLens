import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mobileApiClient } from '../services/mobileApiClient.js';
import { AppError } from '../middleware/errorHandler.js';

describe('Live API Path with Mocked Upstream Fetch', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    mobileApiClient.setMockModeOverride(false);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    mobileApiClient.setMockModeOverride(null);
    vi.restoreAllMocks();
  });

  it('maps 400 upstream response to INVALID_INPUT (400)', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Bad query' })
    } as any);

    await expect(mobileApiClient.searchPhones('invalid', 1, 10)).rejects.toMatchObject({
      code: 'INVALID_INPUT',
      statusCode: 400
    });
  });

  it('maps 404 upstream response to NOT_FOUND (404)', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ detail: 'Device not found' })
    } as any);

    await expect(mobileApiClient.getPhoneById(999999)).rejects.toMatchObject({
      code: 'NOT_FOUND',
      statusCode: 404
    });
  });

  it('maps 429 upstream response to RATE_LIMITED (429)', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ detail: 'Rate limit exceeded' })
    } as any);

    await expect(mobileApiClient.searchPhones('pixel')).rejects.toMatchObject({
      code: 'RATE_LIMITED',
      statusCode: 429
    });
  });

  it('maps 500/502/503 upstream errors to UPSTREAM_UNAVAILABLE (502)', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ error: 'Service Unavailable' })
    } as any);

    await expect(mobileApiClient.getBrands()).rejects.toMatchObject({
      code: 'UPSTREAM_UNAVAILABLE',
      statusCode: 502
    });
  });

  it('maps abort/timeout to UPSTREAM_TIMEOUT (504)', async () => {
    const abortErr = new Error('The operation was aborted');
    abortErr.name = 'AbortError';
    globalThis.fetch = vi.fn().mockRejectedValue(abortErr);

    await expect(mobileApiClient.getPhoneById(123)).rejects.toMatchObject({
      code: 'UPSTREAM_TIMEOUT',
      statusCode: 504
    });
  });

  it('maps malformed response body to UPSTREAM_UNAVAILABLE (502)', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error('Unexpected token < in JSON at position 0');
      }
    } as any);

    await expect(mobileApiClient.getPhoneById(123)).rejects.toMatchObject({
      code: 'UPSTREAM_UNAVAILABLE',
      statusCode: 502
    });
  });

  it('correctly maps pagination fields and devices in search', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        total: 42,
        page: 2,
        has_next: true,
        devices: [
          {
            id: 101,
            name: 'Pixel 9 Pro',
            manufacturer_name: 'Google',
            image_b64: 'mock_base64_img',
            hardware: 'Tensor G4',
            screen_resolution: '6.3 inches, 1280x2856',
            battery_capacity: '4700 mAh'
          }
        ]
      })
    } as any);

    const result = await mobileApiClient.searchPhones('Pixel', 2, 10);
    expect(result.page).toBe(2);
    expect(result.total).toBe(42);
    expect(result.hasMore).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].name).toBe('Pixel 9 Pro');
    expect(result.results[0].brand).toBe('Google');
  });

  it('correctly handles getBrands with bounded pagination', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          total: 2,
          total_pages: 1,
          has_next: false,
          manufacturers: [
            { id: 1, name: 'Apple' },
            { id: 2, name: 'Samsung' }
          ]
        })
      } as any);

    const brands = await mobileApiClient.getBrands();
    expect(brands).toEqual([
      { name: 'Apple', slug: 'apple' },
      { name: 'Samsung', slug: 'samsung' }
    ]);
  });
});
