/**
 * Shared Type Definitions for SpecLens (Client)
 * Mirrors server domain types
 */

export interface DisplaySpec {
  size: string | null;
  resolution: string | null;
  type: string | null;
  refreshRate: string | null;
  protection: string | null;
}

export interface ProcessorSpec {
  chipset: string | null;
  cpu: string | null;
  gpu: string | null;
}

export interface MemorySpec {
  ramOptions: string | null;
  cardSlot: string | null;
}

export interface StorageSpec {
  storageOptions: string | null;
}

export interface CameraSpec {
  modules: string | null;
  features: string | null;
  video: string | null;
}

export interface BatterySpec {
  capacity: string | null;
  type: string | null;
}

export interface NetworkSpec {
  technologies: string | null;
  simType: string | null;
}

export interface ConnectivitySpec {
  wifi: string | null;
  bluetooth: string | null;
  nfc: string | null;
  usb: string | null;
  positioning: string | null;
}

export interface Phone {
  id: string | number;
  name: string;
  brand: string;
  image: string | null;
  releaseDate: string | null;
  dimensions: string | null;
  weight: string | null;
  display: DisplaySpec | null;
  processor: ProcessorSpec | null;
  memory: MemorySpec | null;
  storage: StorageSpec | null;
  rearCamera: CameraSpec | null;
  frontCamera: CameraSpec | null;
  battery: BatterySpec | null;
  charging: string | null;
  operatingSystem: string | null;
  network: NetworkSpec | null;
  connectivity: ConnectivitySpec | null;
  price?: { amount: number; currency: string; raw: string } | null;
}

export interface PhoneSummary {
  id: string | number;
  name: string;
  brand: string;
  thumbnail: string | null;
  highlights: string[];
  releaseDate?: string | null;
  ram?: string | null;
}

export interface Brand {
  name: string;
  slug: string;
  deviceCount?: number;
}

export interface AutocompleteSuggestion {
  id: string | number;
  name: string;
  brand: string;
  thumbnail: string | null;
}

export interface SearchResponse {
  results: PhoneSummary[];
  page: number;
  hasMore: boolean;
  total?: number;
}

export interface BrandResponse {
  brand: string;
  results: PhoneSummary[];
  page: number;
  hasMore: boolean;
  total?: number;
}

export interface CompareResponse {
  phones: Phone[];
  missing: string[];
}

export type ErrorCode =
  | 'INVALID_INPUT'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'UPSTREAM_UNAVAILABLE'
  | 'UPSTREAM_TIMEOUT'
  | 'INTERNAL_ERROR';

export interface ApiErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
  };
}

export type FinderMode = 'must' | 'nice';
export interface FinderRange { min?: number; max?: number; mode: FinderMode; weight: number; }
export interface FinderSet { anyOf: string[]; mode: FinderMode; weight: number; }
export interface FinderBucket { ids: string[]; mode: FinderMode; weight: number; }
export interface FinderCriteria {
  size?: FinderRange; sizeBuckets?: FinderBucket; battery?: FinderRange; ram?: FinderRange; storage?: FinderRange;
  refresh?: FinderRange; weight?: FinderRange; year?: FinderRange; price?: FinderRange;
  display?: FinderSet; brand?: FinderSet; os?: FinderSet; hideMissing?: boolean;
}
export interface FinderExplanation { criterion: string; status: 'matched' | 'missed' | 'unknown'; actual: string; asked: string; }
export interface FinderResult { phone: PhoneSummary; score: number; explanations: FinderExplanation[]; summary: string; }
export interface FinderResponse {
  total: number; results: FinderResult[]; nearMisses: FinderResult[];
  hints: Array<{ criterion: string; value: number | string; count: number; label: string }>;
  appliedCriteria: FinderCriteria; page: number; hasMore: boolean; demoData?: boolean;
}
export interface FinderFacets {
  total: number;
  brand: Record<string, number>;
  display: Record<string, number>;
  histograms: Record<string, Record<string, number>>;
  ranges?: Record<string, { min: number; max: number }>;
  priceUsable: boolean;
  demoData: boolean;
}
export interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  language?: string;
  estimate?: boolean;
}
export interface AssistantSummary {
  headline: string;
  bestFor: Array<{ need: string; phoneId: string; reason: string }>;
  tradeOffs: string[];
  caveat: string;
  demo?: boolean;
}

export interface ComparisonRowItem {
  key: string;
  label: string;
  category: string;
  values: Record<string | number, string>;
  isDifferent: boolean;
  bestPhoneIds?: Array<string | number>;
}
