import { FinderCriteria } from '../types';
import { SCREEN_BANDS } from '../constants/finderControls';

export interface ParsedFinder { criteria: FinderCriteria; understood: string[]; unknown: string[]; }
const brands = ['apple', 'samsung', 'google', 'oneplus', 'xiaomi', 'motorola'];
export function parseFinderPhrase(input: string, knownBrands = brands): ParsedFinder {
  const text = input.toLowerCase(); const criteria: FinderCriteria = {}; const understood: string[] = []; const unknown: string[] = [];
  const addRange = (key: 'size' | 'battery' | 'ram' | 'storage' | 'refresh' | 'weight' | 'year' | 'price', min: number | undefined, max: number | undefined) => {
    criteria[key] = { min, max, mode: 'nice', weight: 3 }; understood.push(key);
  };
  const between = text.match(/between\s+([\d.]+)\s+and\s+([\d.]+)\s*(inch|in|["'])/);
  if (between) addRange('size', Number(between[1]), Number(between[2]));
  const size = text.match(/([\d.]+)\s*(?:inch|in|["'])/);
  if (size && !between) {
    const value = Number(size[1]);
    const band = SCREEN_BANDS.find((item) => (item.min === undefined || value >= item.min) && (item.max === undefined || value <= item.max));
    if (band) criteria.sizeBuckets = { ids: [band.id], mode: 'nice', weight: 3 };
    understood.push('size');
  }
  const battery = text.match(/([\d,]+)\s*m(?:ah|illiamp)/); if (battery) addRange('battery', Number(battery[1].replace(',', '')), undefined);
  const ram = text.match(/(\d+)\s*gb\s*ram/); if (ram) addRange('ram', Number(ram[1]), undefined);
  const storage = text.match(/(\d+)\s*gb\s*(?:storage|rom)/); if (storage) addRange('storage', Number(storage[1]), undefined);
  const refresh = text.match(/(\d+)\s*hz/); if (refresh) addRange('refresh', Number(refresh[1]), undefined);
  const price = text.match(/(?:under|below|less than)\s*(?:₹|rs\.?|inr)?\s*([\d.]+)\s*k?/);
  if (price) addRange('price', undefined, Number(price[1]) * (text.slice(price.index ?? 0).includes('k') ? 1000 : 1));
  const display = ['amoled', 'ltpo', 'oled', 'ips', 'lcd'].filter((item) => text.includes(item));
  if (display.length) { criteria.display = { anyOf: display.map((item) => item.toUpperCase()), mode: 'nice', weight: 3 }; understood.push('display'); }
  const brand = knownBrands.find((item) => text.includes(item.toLowerCase()));
  if (brand) { criteria.brand = { anyOf: [brand], mode: 'nice', weight: 3 }; understood.push('brand'); }
  const words = text.split(/\s+/).filter(Boolean);
  words.filter((word) => !/^(under|below|less|than|and|with|phone|smartphone|in|the|a|at|least|above|over|between|[\d.,]+|inch|in|gb|ram|storage|rom|hz|mah|k?)$/i.test(word) && !understood.some((item) => word.includes(item))).slice(0, 10).forEach((word) => {
    if (!brands.includes(word) && !display.includes(word)) unknown.push(word);
  });
  return { criteria, understood: [...new Set(understood)], unknown: [...new Set(unknown)] };
}
