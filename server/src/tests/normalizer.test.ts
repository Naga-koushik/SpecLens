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

  it('normalizes flat MobileAPI search response shape correctly', () => {
    const flatApiItem = {
      id: 555,
      name: 'MobileAPI Flagship 1',
      manufacturer_name: 'OnePlus',
      image_b64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      hardware: 'Snapdragon 8 Gen 3',
      screen_resolution: '6.82 inches, 1440x3168 pixels',
      battery_capacity: '5400 mAh',
      camera: '50 MP + 64 MP + 48 MP',
      weight: '220 g',
      release_date: '2024-01-23'
    };

    const phone = normalizePhone(flatApiItem);
    expect(phone.id).toBe(555);
    expect(phone.name).toBe('MobileAPI Flagship 1');
    expect(phone.brand).toBe('OnePlus');
    expect(phone.image).toContain('data:image/jpeg;base64,');
    expect(phone.processor?.chipset).toBe('Snapdragon 8 Gen 3');
    expect(phone.display?.resolution).toBe('6.82 inches, 1440x3168 pixels');
    expect(phone.battery?.capacity).toBe('5400 mAh');
    expect(phone.rearCamera?.modules).toBe('50 MP + 64 MP + 48 MP');
    expect(phone.weight).toBe('220 g');
    expect(phone.releaseDate).toBe('2024-01-23');

    const summary = normalizePhoneSummary(flatApiItem);
    expect(summary.brand).toBe('OnePlus');
    expect(summary.thumbnail).toBe(phone.image);
    expect(summary.highlights).toContain('5400 mAh');
  });

  it('handles missing, odd, and edge-case values gracefully without throwing', () => {
    const oddItem = {
      id: 'abc-123',
      name: '',
      brand: null,
      manufacturer_name: '',
      image_b64: '',
      storage: 'n/a',
      weight: '-',
      display: null,
      processor: undefined,
      battery: { capacity: '   ' }
    };

    const phone = normalizePhone(oddItem);
    expect(phone.id).toBe('abc-123');
    expect(phone.name).toBe('Unknown Device');
    expect(phone.brand).toBe('Unknown Brand');
    expect(phone.image).toBeNull();
    expect(phone.storage).toBeNull();
    expect(phone.weight).toBeNull();
    expect(phone.display).toBeNull();
    expect(phone.processor).toBeNull();
    expect(phone.battery).toBeNull();
  });

  it('throws an error when raw device is null or undefined', () => {
    expect(() => normalizePhone(null as any)).toThrow('Cannot normalize null or undefined device');
  });
});

