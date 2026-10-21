import { describe, it, expect } from 'vitest';
import { getSimilarPhones } from '../utils/similarPhones';
import { Phone } from '../types';

describe('getSimilarPhones utility', () => {
  const currentPhone: Phone = {
    id: 43,
    name: 'Apple iPhone 15 Pro',
    brand: 'Apple',
    image: null,
    releaseDate: 'September 2023',
    dimensions: '146.6 x 70.6 x 8.25 mm',
    weight: '187 g',
    display: {
      size: '6.1 inches',
      resolution: '1179 x 2556 pixels',
      type: 'OLED',
      refreshRate: '120Hz',
      protection: null
    },
    processor: { chipset: 'A17 Pro', cpu: 'Hexa-core', gpu: 'Apple GPU' },
    memory: { ramOptions: '8GB', cardSlot: 'No' },
    storage: { storageOptions: '128GB' },
    rearCamera: { modules: '48MP', features: null, video: null },
    frontCamera: { modules: '12MP', features: null, video: null },
    battery: { capacity: '3274 mAh', type: 'Li-Ion' },
    charging: '25W',
    operatingSystem: 'iOS 17',
    network: { technologies: '5G', simType: 'Nano-SIM' },
    connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', nfc: 'Yes', usb: 'Type-C', positioning: 'GPS' }
  };

  it('excludes the current phone itself from similar phones', () => {
    const similar = getSimilarPhones(currentPhone);
    expect(similar.some((p) => String(p.id) === '43')).toBe(false);
  });

  it('prioritizes phones of the same brand', () => {
    const similar = getSimilarPhones(currentPhone);
    expect(similar.length).toBeGreaterThan(0);
    expect(similar.length).toBeLessThanOrEqual(4);

    // Apple candidates (iPhone 15, iPhone 14) should rank top
    const topPhone = similar[0];
    expect(topPhone.brand).toBe('Apple');
  });

  it('returns up to 4 phones', () => {
    const similar = getSimilarPhones(currentPhone);
    expect(similar.length).toBe(4);
  });

  it('handles custom pool of candidates correctly', () => {
    const customPool = [
      { id: 901, name: 'Apple Phone Old', brand: 'Apple', thumbnail: null, highlights: [], releaseDate: '2020' },
      { id: 902, name: 'Other Brand 2023', brand: 'Other', thumbnail: null, highlights: [], releaseDate: '2023' },
      { id: 43, name: 'Apple iPhone 15 Pro', brand: 'Apple', thumbnail: null, highlights: [], releaseDate: '2023' }
    ];

    const similar = getSimilarPhones(currentPhone, customPool);
    expect(similar.some((p) => String(p.id) === '43')).toBe(false);
    expect(similar[0].brand).toBe('Apple');
  });
});
