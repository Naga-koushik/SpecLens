import { describe, it, expect } from 'vitest';
import { buildComparisonRows, NOT_AVAILABLE } from '../utils/comparison';
import { Phone } from '../types';

describe('buildComparisonRows', () => {
  const phoneA: Phone = {
    id: 1,
    name: 'Phone Alpha',
    brand: 'BrandA',
    image: null,
    releaseDate: '2023',
    dimensions: '150 x 70 x 8 mm',
    weight: '170 g',
    display: {
      size: '6.1 inches',
      resolution: '1080 x 2400',
      type: 'OLED',
      refreshRate: '120Hz',
      protection: 'Glass 5'
    },
    processor: {
      chipset: 'Snapdragon 8 Gen 2',
      cpu: 'Octa-core',
      gpu: 'Adreno 740'
    },
    memory: {
      ramOptions: '8GB',
      cardSlot: 'No'
    },
    storage: {
      storageOptions: '128GB'
    },
    rearCamera: {
      modules: '50 MP',
      features: null,
      video: '4K@60fps'
    },
    frontCamera: null,
    battery: {
      capacity: '4000 mAh',
      type: 'Li-Ion'
    },
    charging: '25W',
    operatingSystem: 'Android 14',
    network: null,
    connectivity: null
  };

  const phoneB: Phone = {
    id: 2,
    name: 'Phone Beta',
    brand: 'BrandB',
    image: null,
    releaseDate: '2024',
    dimensions: '160 x 75 x 9 mm',
    weight: '200 g',
    display: {
      size: '6.7 inches',
      resolution: '1080 x 2400', // SAME resolution as Phone A
      type: 'AMOLED',
      refreshRate: '120Hz', // SAME refresh rate as Phone A
      protection: null // Missing protection
    },
    processor: {
      chipset: 'Snapdragon 8 Gen 3',
      cpu: 'Octa-core',
      gpu: 'Adreno 750'
    },
    memory: {
      ramOptions: '12GB',
      cardSlot: 'No'
    },
    storage: {
      storageOptions: '256GB'
    },
    rearCamera: {
      modules: '200 MP',
      features: 'HDR',
      video: '8K@30fps'
    },
    frontCamera: {
      modules: '32 MP',
      features: null,
      video: null
    },
    battery: {
      capacity: '5000 mAh',
      type: 'Li-Po'
    },
    charging: '45W',
    operatingSystem: 'Android 14', // SAME OS as Phone A
    network: null,
    connectivity: null
  };

  it('correctly builds comparison rows with categories and detects differences', () => {
    const rows = buildComparisonRows([phoneA, phoneB]);
    expect(rows.length).toBeGreaterThan(0);

    // Screen size is 6.1" vs 6.7" -> should be marked different
    const sizeRow = rows.find((r) => r.key === 'displaySize');
    expect(sizeRow).toBeDefined();
    expect(sizeRow?.isDifferent).toBe(true);
    expect(sizeRow?.values[1]).toBe('6.1 inches');
    expect(sizeRow?.values[2]).toBe('6.7 inches');

    // Resolution is 1080 x 2400 for both -> should NOT be marked different
    const resRow = rows.find((r) => r.key === 'displayRes');
    expect(resRow).toBeDefined();
    expect(resRow?.isDifferent).toBe(false);

    // Protection is missing in Phone B -> should be Not available
    const protRow = rows.find((r) => r.key === 'displayProt');
    expect(protRow).toBeDefined();
    expect(protRow?.values[2]).toBe(NOT_AVAILABLE);
    expect(protRow?.isDifferent).toBe(true);

    // Categories must include Display, Performance, Camera
    const categories = new Set(rows.map((r) => r.category));
    expect(categories.has('Display')).toBe(true);
    expect(categories.has('Performance')).toBe(true);
    expect(categories.has('Camera')).toBe(true);
  });

  it('identifies best numeric values respecting direction (higher vs lower)', () => {
    const rows = buildComparisonRows([phoneA, phoneB]);

    // Battery: 5000 mAh > 4000 mAh -> Phone B (id 2) is best
    const batteryRow = rows.find((r) => r.key === 'batteryCap');
    expect(batteryRow?.bestPhoneIds).toBeDefined();
    expect(batteryRow?.bestPhoneIds).toContain(2);
    expect(batteryRow?.bestPhoneIds).not.toContain(1);

    // RAM: 12GB > 8GB -> Phone B (id 2) is best
    const ramRow = rows.find((r) => r.key === 'ram');
    expect(ramRow?.bestPhoneIds).toContain(2);

    // Weight: 170 g < 200 g -> Phone A (id 1) is best (lower is better)
    const weightRow = rows.find((r) => r.key === 'weight');
    expect(weightRow?.bestPhoneIds).toContain(1);
    expect(weightRow?.bestPhoneIds).not.toContain(2);

    // Refresh rate: both 120Hz -> no Best badge (identical values)
    const refreshRow = rows.find((r) => r.key === 'displayRefresh');
    expect(refreshRow?.bestPhoneIds).toBeUndefined();
  });

  it('handles empty phones array safely', () => {
    const rows = buildComparisonRows([]);
    expect(rows).toEqual([]);
  });
});
