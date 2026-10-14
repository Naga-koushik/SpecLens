import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { cache } from '../services/cache.js';

const app = createApp();

describe('Server API Endpoints', () => {
  beforeEach(() => {
    cache.clear();
  });

  it('GET /api/health returns 200 { status: "ok" }', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /api/phones/search returns paginated results', async () => {
    const res = await request(app).get('/api/phones/search?q=iPhone&page=1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('results');
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('hasMore');
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0]).toHaveProperty('highlights');
  });

  it('GET /api/phones/search handles short queries gracefully (< 2 chars)', async () => {
    const res = await request(app).get('/api/phones/search?q=i');
    expect(res.status).toBe(200);
    expect(res.body.results).toEqual([]);
  });

  it('GET /api/phones/autocomplete returns suggestions', async () => {
    const res = await request(app).get('/api/phones/autocomplete?q=Galaxy&limit=3');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('suggestions');
    expect(Array.isArray(res.body.suggestions)).toBe(true);
    expect(res.body.suggestions.length).toBeGreaterThan(0);
    expect(res.body.suggestions[0].name.toLowerCase()).toContain('galaxy');
  });

  it('GET /api/phones/popular returns curated popular phones', async () => {
    const res = await request(app).get('/api/phones/popular');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('phones');
    expect(Array.isArray(res.body.phones)).toBe(true);
    expect(res.body.phones.length).toBeGreaterThan(0);
  });

  it('GET /api/phones/:id returns device details', async () => {
    const res = await request(app).get('/api/phones/43');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 43);
    expect(res.body).toHaveProperty('name', 'Apple iPhone 15 Pro');
    expect(res.body).toHaveProperty('display');
    expect(res.body).toHaveProperty('processor');
  });

  it('GET /api/phones/:id returns 404 for unknown phone ID', async () => {
    const res = await request(app).get('/api/phones/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('GET /api/brands returns manufacturers list', async () => {
    const res = await request(app).get('/api/brands');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('brands');
    expect(Array.isArray(res.body.brands)).toBe(true);
    expect(res.body.brands.length).toBeGreaterThan(0);
  });

  it('GET /api/brands/:brand returns phones for brand', async () => {
    const res = await request(app).get('/api/brands/apple?page=1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('brand');
    expect(res.body).toHaveProperty('results');
    expect(res.body.results.every((p: any) => p.brand.toLowerCase() === 'apple')).toBe(true);
  });

  it('GET /api/compare handles 2 to 4 phones in parallel', async () => {
    const res = await request(app).get('/api/compare?ids=43,123');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('phones');
    expect(res.body).toHaveProperty('missing');
    expect(res.body.phones.length).toBe(2);
    expect(res.body.missing.length).toBe(0);
  });

  it('GET /api/compare rejects fewer than 2 phones with 400', async () => {
    const res = await request(app).get('/api/compare?ids=43');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_INPUT');
  });

  it('GET /api/compare rejects more than 4 phones with 400', async () => {
    const res = await request(app).get('/api/compare?ids=43,123,44,124,150');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_INPUT');
  });

  it('Caches detail lookup on second request', async () => {
    const spy = cache.getDetail('43');
    expect(spy).toBeUndefined();

    // First call sets cache
    await request(app).get('/api/phones/43');
    const cachedItem = cache.getDetail('43');
    expect(cachedItem).toBeDefined();

    // Second call gets from cache
    const secondRes = await request(app).get('/api/phones/43');
    expect(secondRes.status).toBe(200);
    expect(secondRes.body).toHaveProperty('id', 43);
  });

  it('Resolves complex brand slugs like OnePlus correctly', async () => {
    const res = await request(app).get('/api/brands/oneplus?page=1');
    expect(res.status).toBe(200);
    expect(res.body.brand).toBe('OnePlus');
    expect(res.body.results.length).toBeGreaterThan(0);
  });
});
