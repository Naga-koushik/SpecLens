/**
 * Spec Glossary Definitions
 * Plain-language explanations for complex technical smartphone specifications
 */

export interface GlossaryEntry {
  term: string;
  definition: string;
  category?: string;
}

export const GLOSSARY_TERMS: Record<string, GlossaryEntry> = {
  amoled: {
    term: 'AMOLED',
    definition: 'Active-Matrix Organic Light-Emitting Diode. A display technology with individual self-lit pixels, offering vibrant colors, true blacks, infinite contrast, and lower battery consumption.'
  },
  ltpo: {
    term: 'LTPO',
    definition: 'Low-Temperature Polycrystalline Oxide. Advanced display backplane that dynamically scales refresh rates (e.g., 1Hz to 120Hz) based on content to significantly conserve battery.'
  },
  'refresh rate': {
    term: 'Refresh Rate',
    definition: 'How many times per second the display redraws the image (measured in Hertz / Hz). A 120Hz screen appears much smoother and more fluid than a standard 60Hz panel.'
  },
  chipset: {
    term: 'Chipset',
    definition: 'The main processor / System-on-Chip (SoC) combining CPU, GPU, modem, and AI processors. Dictates overall smartphone speed, gaming performance, and energy efficiency.'
  },
  ufs: {
    term: 'UFS',
    definition: 'Universal Flash Storage. High-speed internal flash storage standard (e.g., UFS 3.1 or 4.0) that enables rapid app opening, fast booting, and speedy photo/video saving.'
  },
  nfc: {
    term: 'NFC',
    definition: 'Near Field Communication. Short-range wireless connectivity allowing instant contactless mobile payments (Google Pay, Apple Pay) and tap-to-pair functionality.'
  },
  esim: {
    term: 'eSIM',
    definition: 'Embedded SIM. A digital SIM chip built directly into the phone motherboard, enabling carrier activation and dual-SIM functionality without swapping physical cards.'
  },
  'ip rating': {
    term: 'IP Rating',
    definition: 'Ingress Protection rating defining resistance to dust and liquids. For instance, IP68 denotes dust-tight protection and survival during freshwater immersion (typically 1.5m for 30 minutes).'
  },
  ppi: {
    term: 'PPI',
    definition: 'Pixels Per Inch. A measurement of display pixel density. Displays above 350-400 PPI provide razor-sharp text and images where individual pixels are indistinguishable to the human eye.'
  },
  ram: {
    term: 'RAM',
    definition: 'Random Access Memory. High-speed temporary memory used to keep running apps, background tasks, and browser tabs ready for instant switching without reloading.'
  },
  battery: {
    term: 'Battery Capacity',
    definition: 'Measured in milliampere-hours (mAh). Higher numbers typically correlate with longer runtimes between recharges, depending on display size and chipset efficiency.'
  },
  hdr: {
    term: 'HDR',
    definition: 'High Dynamic Range (e.g., HDR10+, Dolby Vision). Expands the range of brightness and color tones in videos and photos, revealing deep shadow details and bright highlights.'
  },
  ois: {
    term: 'OIS',
    definition: 'Optical Image Stabilization. Physical camera lens stabilization using gyro-sensors to counteract hand tremors, producing sharper low-light photos and steady video recordings.'
  }
};

/**
 * Find glossary definition for a given label or technical term (case-insensitive)
 */
export function findGlossaryTerm(text: string): GlossaryEntry | null {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  // Direct lookup
  if (GLOSSARY_TERMS[clean]) {
    return GLOSSARY_TERMS[clean];
  }

  // Partial match in keys
  for (const [key, entry] of Object.entries(GLOSSARY_TERMS)) {
    if (clean.includes(key) || key.includes(clean)) {
      return entry;
    }
  }

  return null;
}
