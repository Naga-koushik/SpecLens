import { Phone, ComparisonRowItem } from '../types';

export const NOT_AVAILABLE = 'Not available';

interface RowDefinition {
  key: string;
  label: string;
  category: string;
  getValue: (phone: Phone) => string | null | undefined;
}

export const COMPARISON_CATEGORIES = [
  'General',
  'Display',
  'Performance',
  'Memory & Storage',
  'Camera',
  'Battery & Charging',
  'Connectivity & Network'
] as const;

const ROW_DEFINITIONS: RowDefinition[] = [
  // General
  { key: 'brand', label: 'Brand', category: 'General', getValue: (p) => p.brand },
  { key: 'releaseDate', label: 'Release Date', category: 'General', getValue: (p) => p.releaseDate },
  { key: 'operatingSystem', label: 'Operating System', category: 'General', getValue: (p) => p.operatingSystem },
  { key: 'dimensions', label: 'Dimensions', category: 'General', getValue: (p) => p.dimensions },
  { key: 'weight', label: 'Weight', category: 'General', getValue: (p) => p.weight },

  // Display
  { key: 'displaySize', label: 'Screen Size', category: 'Display', getValue: (p) => p.display?.size },
  { key: 'displayRes', label: 'Resolution', category: 'Display', getValue: (p) => p.display?.resolution },
  { key: 'displayType', label: 'Display Type', category: 'Display', getValue: (p) => p.display?.type },
  { key: 'displayRefresh', label: 'Refresh Rate', category: 'Display', getValue: (p) => p.display?.refreshRate },
  { key: 'displayProt', label: 'Protection', category: 'Display', getValue: (p) => p.display?.protection },

  // Performance
  { key: 'chipset', label: 'Chipset', category: 'Performance', getValue: (p) => p.processor?.chipset },
  { key: 'cpu', label: 'CPU', category: 'Performance', getValue: (p) => p.processor?.cpu },
  { key: 'gpu', label: 'GPU', category: 'Performance', getValue: (p) => p.processor?.gpu },

  // Memory & Storage
  { key: 'ram', label: 'RAM', category: 'Memory & Storage', getValue: (p) => p.memory?.ramOptions },
  { key: 'storage', label: 'Internal Storage', category: 'Memory & Storage', getValue: (p) => p.storage?.storageOptions },
  { key: 'cardSlot', label: 'Card Slot', category: 'Memory & Storage', getValue: (p) => p.memory?.cardSlot },

  // Camera
  { key: 'rearCamModules', label: 'Rear Camera', category: 'Camera', getValue: (p) => p.rearCamera?.modules },
  { key: 'rearCamVideo', label: 'Rear Video', category: 'Camera', getValue: (p) => p.rearCamera?.video },
  { key: 'frontCamModules', label: 'Front Camera', category: 'Camera', getValue: (p) => p.frontCamera?.modules },
  { key: 'frontCamVideo', label: 'Front Video', category: 'Camera', getValue: (p) => p.frontCamera?.video },

  // Battery & Charging
  { key: 'batteryCap', label: 'Battery Capacity', category: 'Battery & Charging', getValue: (p) => p.battery?.capacity },
  { key: 'batteryType', label: 'Battery Type', category: 'Battery & Charging', getValue: (p) => p.battery?.type },
  { key: 'charging', label: 'Charging Speed', category: 'Battery & Charging', getValue: (p) => p.charging },

  // Connectivity & Network
  { key: 'networkTech', label: 'Network Tech', category: 'Connectivity & Network', getValue: (p) => p.network?.technologies },
  { key: 'simType', label: 'SIM Type', category: 'Connectivity & Network', getValue: (p) => p.network?.simType },
  { key: 'wifi', label: 'Wi-Fi', category: 'Connectivity & Network', getValue: (p) => p.connectivity?.wifi },
  { key: 'bluetooth', label: 'Bluetooth', category: 'Connectivity & Network', getValue: (p) => p.connectivity?.bluetooth },
  { key: 'nfc', label: 'NFC', category: 'Connectivity & Network', getValue: (p) => p.connectivity?.nfc },
  { key: 'usb', label: 'USB Port', category: 'Connectivity & Network', getValue: (p) => p.connectivity?.usb }
];

/**
 * Pure function to build grouped, diff-highlighted rows for 2-4 phones.
 */
export function buildComparisonRows(phones: Phone[]): ComparisonRowItem[] {
  if (!phones || phones.length === 0) return [];

  return ROW_DEFINITIONS.map((def) => {
    const values: Record<string | number, string> = {};
    const validNonMissingValues = new Set<string>();

    phones.forEach((phone) => {
      const rawVal = def.getValue(phone);
      const cleaned = rawVal !== null && rawVal !== undefined && rawVal.trim() !== ''
        ? rawVal.trim()
        : NOT_AVAILABLE;

      values[phone.id] = cleaned;

      if (cleaned !== NOT_AVAILABLE) {
        validNonMissingValues.add(cleaned.toLowerCase());
      }
    });

    // A row is considered different if there is more than 1 distinct non-missing value
    // or if some phones have a value and others are 'Not available'
    const allValues = Object.values(values);
    const hasDifferentValues = new Set(allValues).size > 1;

    return {
      key: def.key,
      label: def.label,
      category: def.category,
      values,
      isDifferent: hasDifferentValues && phones.length > 1
    };
  });
}
