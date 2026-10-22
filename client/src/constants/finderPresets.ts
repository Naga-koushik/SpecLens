import { FinderCriteria } from '../types';

export interface FinderPreset { name: string; description: string; criteria: FinderCriteria; }
export const finderPresets: FinderPreset[] = [
  { name: 'Gamer', description: 'Prioritises RAM, refresh rate and a large battery.', criteria: { ram: { min: 8, mode: 'nice', weight: 5 }, refresh: { min: 120, mode: 'nice', weight: 5 }, battery: { min: 4500, mode: 'nice', weight: 4 } } },
  { name: 'Camera lover', description: 'Keeps display quality and newer phones important.', criteria: { display: { anyOf: ['AMOLED', 'OLED', 'LTPO'], mode: 'nice', weight: 4 }, year: { min: 2022, mode: 'nice', weight: 3 } } },
  { name: 'Battery first', description: 'Ranks phones with larger batteries higher.', criteria: { battery: { min: 5000, mode: 'nice', weight: 5 } } },
  { name: 'One-hand friendly', description: 'Prefers compact, light phones.', criteria: { size: { max: 6.3, mode: 'nice', weight: 5 }, weight: { max: 200, mode: 'nice', weight: 4 } } },
  { name: 'Budget student', description: 'Keeps price and useful memory in focus.', criteria: { price: { max: 30000, mode: 'must', weight: 5 }, ram: { min: 6, mode: 'nice', weight: 3 } } },
  { name: 'Big-screen media', description: 'Prefers larger screens and high refresh rates.', criteria: { size: { min: 6.5, mode: 'nice', weight: 5 }, refresh: { min: 90, mode: 'nice', weight: 3 } } }
];
