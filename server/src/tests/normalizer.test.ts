import { describe, it, expect } from 'vitest';
import { normalizePhone, normalizePhoneSummary, extractHighlights } from '../normalizers/phoneNormalizer.js';

describe('Phone Normalizers', () => {
  it('normalizes raw device data and replaces missing/invalid strings with null', () => {
    const rawDevice = {
      id: 999,
      name: 'Test Phone Pro',
      brand: { name: 'TestBrand' },
      hardware: 'TestChipset Octa-Core',
      screen_resolution: '1080 x 2400',
      camera: '50 MP + 12 MP',
      battery_capacity: '5000 mAh',
      storage: 'N/A', // Should become null
      weight: 'Not available', // Should become null
      display: {
        refreshRate: '-' // Should become null
      }
    };

    const phone = normalizePhone(rawDevice);

    expect(phone.id).toBe(999);
    expect(phone.name).toBe('Test Phone Pro');
    expect(phone.brand).toBe('TestBrand');
    expect(phone.processor?.chipset).toBe('TestChipset Octa-Core');
    expect(phone.display?.resolution).toBe('1080 x 2400');
    expect(phone.rearCamera?.modules).toBe('50 MP + 12 MP');
    expect(phone.battery?.capacity).toBe('5000 mAh');

    // Missing / placeholder values must be null
    expect(phone.storage?.storageOptions ?? null).toBeNull();
    expect(phone.weight).toBeNull();
    expect(phone.display?.refreshRate).toBeNull();
    expect(phone.operatingSystem).toBeNull();
    expect(phone.network).toBeNull();
  });

  it('generates summary and concise highlights', () => {
    const rawDevice = {
      id: 101,
      name: 'SuperPhone Ultra',
      brand: 'SuperTech',
      display: {
        size: '6.7"',
        refreshRate: '120Hz',
        type: 'AMOLED'
      },
      processor: {
        chipset: 'Snapdragon 8 Gen 3 (4 nm)'
      },
      rearCamera: {
        modules: '200 MP (wide) + 12 MP'
      },
      battery: {
        capacity: '5000 mAh'
      }
    };

    const summary = normalizePhoneSummary(rawDevice);
    expect(summary.id).toBe(101);
    expect(summary.name).toBe('SuperPhone Ultra');
    expect(summary.brand).toBe('SuperTech');
    expect(summary.highlights.length).toBeGreaterThan(0);
    expect(summary.highlights[0]).toContain('6.7"');
    expect(summary.highlights[1]).toBe('Snapdragon 8 Gen 3');
  });

  it('extractHighlights falls back gracefully on empty phone object', () => {
    const highlights = extractHighlights({ name: 'Generic' });
    expect(Array.isArray(highlights)).toBe(true);
  });
});
