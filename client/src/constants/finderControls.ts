export interface ScreenBand { id: string; label: string; hint: string; min?: number; max?: number; }
export const SCREEN_BANDS: ScreenBand[] = [
  { id: 'compact', label: 'Compact', hint: 'under 6.1 in', max: 6.1 },
  { id: 'standard', label: 'Standard', hint: '6.1–6.5 in', min: 6.1, max: 6.5 },
  { id: 'large', label: 'Large', hint: '6.5–6.8 in', min: 6.5, max: 6.8 },
  { id: 'extra-large', label: 'Extra large', hint: '6.8 in and above', min: 6.8 }
];
export type FinderControlKey = 'battery' | 'ram' | 'storage' | 'refresh' | 'weight' | 'year' | 'price';
export interface FinderControlDefinition {
  key: FinderControlKey;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  direction: 'atLeast' | 'atMost' | 'range';
}
export const FINDER_CONTROLS: FinderControlDefinition[] = [
  { key: 'battery', label: 'Battery', min: 2500, max: 7000, step: 100, unit: 'mAh', direction: 'atLeast' },
  { key: 'ram', label: 'RAM', min: 2, max: 24, step: 2, unit: 'GB', direction: 'atLeast' },
  { key: 'storage', label: 'Storage', min: 32, max: 2048, step: 32, unit: 'GB', direction: 'atLeast' },
  { key: 'refresh', label: 'Refresh rate', min: 60, max: 165, step: 30, unit: 'Hz', direction: 'atLeast' },
  { key: 'weight', label: 'Weight', min: 120, max: 300, step: 5, unit: 'g', direction: 'atMost' },
  { key: 'year', label: 'Release year', min: 2018, max: 2026, step: 1, unit: '', direction: 'range' },
  { key: 'price', label: 'Price', min: 5000, max: 150000, step: 1000, unit: '₹', direction: 'range' }
];
