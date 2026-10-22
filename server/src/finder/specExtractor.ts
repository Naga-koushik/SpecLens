import { Phone } from '../types/index.js';

export interface ExtractedSpecs {
  screenInches: number | null;
  batteryMah: number | null;
  ramGbOptions: number[];
  storageGbOptions: number[];
  refreshHz: number | null;
  weightG: number | null;
  releaseYear: number | null;
  displayFamily: 'AMOLED' | 'LTPO' | 'OLED' | 'IPS' | 'LCD' | 'Other' | 'Unknown';
  os: string | null;
  priceAmount: number | null;
  original: Record<string, string | null>;
}

const number = (value: string | null | undefined, pattern: RegExp): number | null => {
  const match = value?.match(pattern);
  if (!match) return null;
  const result = Number(match[1].replace(/,/g, ''));
  return Number.isFinite(result) ? result : null;
};

const numbers = (value: string | null | undefined, pattern: RegExp): number[] =>
  [...(value?.matchAll(pattern) ?? [])].map((match) => Number(match[1].replace(/,/g, ''))).filter(Number.isFinite);

export function extractSpecs(phone: Phone): ExtractedSpecs {
  const display = phone.display?.size;
  const displayType = phone.display?.type;
  const family = displayType?.toLowerCase();
  let displayFamily: ExtractedSpecs['displayFamily'] = 'Unknown';
  if (family) {
    if (family.includes('ltpo')) displayFamily = 'LTPO';
    else if (family.includes('amoled')) displayFamily = 'AMOLED';
    else if (family.includes('oled')) displayFamily = 'OLED';
    else if (family.includes('ips')) displayFamily = 'IPS';
    else if (family.includes('lcd')) displayFamily = 'LCD';
    else displayFamily = 'Other';
  }
  const releaseYear = number(phone.releaseDate, /\b(20\d{2})\b/);
  return {
    screenInches: number(display, /(\d+(?:\.\d+)?)\s*(?:["”]|in(?:ches?)?)/i) ?? number(display, /^\s*(\d+(?:\.\d+)?)/),
    batteryMah: number(phone.battery?.capacity, /(\d[\d,]*)\s*mAh/i),
    ramGbOptions: numbers(phone.memory?.ramOptions, /(\d+(?:\.\d+)?)\s*GB\b/gi),
    storageGbOptions: numbers(phone.storage?.storageOptions, /(\d+(?:\.\d+)?)\s*(GB|TB)\b/gi)
      .map((value, index) => /TB/i.test(phone.storage?.storageOptions?.match(/(\d+(?:\.\d+)?)\s*(GB|TB)\b/gi)?.[index] ?? '') ? value * 1024 : value),
    refreshHz: number(phone.display?.refreshRate, /(\d+(?:\.\d+)?)\s*Hz/i),
    weightG: number(phone.weight, /(\d+(?:\.\d+)?)\s*g\b/i),
    releaseYear,
    displayFamily,
    os: phone.operatingSystem,
    priceAmount: phone.price?.amount ?? null,
    original: {
      display: [phone.display?.size, phone.display?.type].filter(Boolean).join(', ') || null,
      battery: phone.battery?.capacity ?? null,
      ram: phone.memory?.ramOptions ?? null,
      storage: phone.storage?.storageOptions ?? null,
      refresh: phone.display?.refreshRate ?? null,
      weight: phone.weight ?? null,
      year: phone.releaseDate ?? null,
      price: phone.price?.raw ?? null
    }
  };
}
