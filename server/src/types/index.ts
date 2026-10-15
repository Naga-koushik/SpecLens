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

export interface RawDeviceInput {
  id?: string | number | null;
  _id?: string | number | null;
  name?: string | null;
  brand?: string | { id?: number; name?: string } | null;
  manufacturer_name?: string | null;
  manufacturer?: { id?: number; name?: string } | string | null;
  image?: string | null;
  image_url?: string | null;
  thumbnail?: string | null;
  image_b64?: string | null;
  main_image_b64?: string | null;
  releaseDate?: string | null;
  release_date?: string | null;
  dimensions?: string | null;
  weight?: string | null;
  body?: { dimensions?: string | null; weight?: string | null } | null;
  display?: (Partial<DisplaySpec> & { refresh_rate?: string | null }) | null;
  screen_size?: string | null;
  screen_resolution?: string | null;
  processor?: Partial<ProcessorSpec> | null;
  hardware?: string | null;
  memory?: (Partial<MemorySpec> & { ram_options?: string | null; card_slot?: string | null }) | null;
  ram?: string | null;
  storage?: (Partial<StorageSpec> & { storage_options?: string | null }) | string | null;
  rearCamera?: Partial<CameraSpec> | null;
  camera?: string | null;
  frontCamera?: Partial<CameraSpec> | null;
  selfie_camera?: string | null;
  battery?: (Partial<BatterySpec> & { charging?: string | null }) | null;
  battery_capacity?: string | null;
  charging?: string | null;
  operatingSystem?: string | null;
  operating_system?: string | null;
  os?: string | null;
  network?: (Partial<NetworkSpec> & { sim_type?: string | null }) | null;
  network_technology?: string | null;
  sim?: string | null;
  connectivity?: Partial<ConnectivitySpec> | null;
  wlan?: string | null;
}

export type DeviceInput = RawDeviceInput;

export interface ApiErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
  };
}

