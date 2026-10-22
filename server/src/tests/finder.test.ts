import { describe, expect, it } from 'vitest';
import { extractSpecs } from '../finder/specExtractor.js';
import { rankPhones } from '../finder/engine.js';
import { Phone } from '../types/index.js';

const phone = (overrides: Partial<Phone> = {}): Phone => ({
  id: 1, name: 'Test Phone', brand: 'Test', image: null, releaseDate: '2024-01-24', dimensions: null, weight: '232 g',
  display: { size: '6.8", 1440 x 3120 pixels', resolution: null, type: 'Dynamic AMOLED', refreshRate: '120Hz', protection: null },
  processor: null, memory: { ramOptions: '12GB', cardSlot: null }, storage: { storageOptions: '256GB, 512GB, 1TB UFS 4.0' },
  rearCamera: null, frontCamera: null, battery: { capacity: '5000 mAh', type: null }, charging: null, operatingSystem: 'Android 14', network: null, connectivity: null, ...overrides
});

describe('Finder extraction and ranking', () => {
  it('extracts messy specification strings without guessing', () => {
    const specs = extractSpecs(phone());
    expect(specs.screenInches).toBe(6.8);
    expect(specs.batteryMah).toBe(5000);
    expect(specs.ramGbOptions).toEqual([12]);
    expect(specs.storageGbOptions).toEqual([256, 512, 1024]);
    expect(specs.refreshHz).toBe(120);
    expect(specs.weightG).toBe(232);
    expect(specs.releaseYear).toBe(2024);
    expect(specs.displayFamily).toBe('AMOLED');
  });
  it('keeps unknown values neutral and ranks nice-to-haves', () => {
    const output = rankPhones([phone(), phone({ id: 2, name: 'Unknown Phone', battery: null })], { battery: { min: 5000, mode: 'nice', weight: 5 } });
    expect(output.results[0].phone.id).toBe(1);
    expect(output.results[1].score).toBe(50);
  });
  it('returns a near miss for one small must failure', () => {
    const output = rankPhones([phone({ battery: { capacity: '4900 mAh', type: null } })], { battery: { min: 5000, mode: 'must', weight: 3 } });
    expect(output.results).toHaveLength(0);
    expect(output.nearMisses).toHaveLength(1);
  });
});
