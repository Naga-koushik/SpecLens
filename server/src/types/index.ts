/**
 * Shared Type Definitions for SpecLens
 * Mirrored between Server and Client
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
}

export interface PhoneSummary {
  id: string | number;
  name: string;
  brand: string;
  thumbnail: string | null;
  highlights: string[];
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
