import { Phone, PhoneSummary, RawDeviceInput } from '../types/index.js';

/**
 * Pure function to safely clean and nullify empty or placeholder strings.
 */
function cleanString(val: unknown): string | null {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  if (!str || str.toLowerCase() === 'not available' || str.toLowerCase() === 'n/a' || str === '-') {
    return null;
  }
  return str;
}

/**
 * Generate 3-4 clean summary highlights from phone specs.
 */
export function extractHighlights(phone: Partial<Phone>): string[] {
  const highlights: string[] = [];

  // 1. Display highlight
  if (phone.display?.size || phone.display?.refreshRate || phone.display?.type) {
    const parts = [
      phone.display?.size,
      phone.display?.refreshRate,
      phone.display?.type?.split(',')[0]?.trim()
    ].filter(Boolean);
    if (parts.length > 0) highlights.push(parts.join(' '));
  }

  // 2. Processor highlight
  if (phone.processor?.chipset) {
    highlights.push(phone.processor.chipset.split('(')[0]?.trim());
  }

  // 3. Camera highlight
  if (phone.rearCamera?.modules) {
    const mainCam = phone.rearCamera.modules.split('+')[0]?.split(';')[0]?.trim();
    if (mainCam) highlights.push(mainCam.replace(/\(.*?\)/g, '').trim());
  }

  // 4. Battery highlight
  if (phone.battery?.capacity) {
    highlights.push(phone.battery.capacity);
  }

  // Fallback default highlights if none could be parsed
  if (highlights.length === 0) {
    if (phone.operatingSystem) highlights.push(phone.operatingSystem);
    if (phone.storage?.storageOptions) highlights.push(phone.storage.storageOptions);
  }

  return highlights.slice(0, 4);
}

/**
 * Normalizes a raw external device object into a standard Phone model.
 * Handles both the unified mock format and raw MobileAPI.dev shapes.
 */
export function normalizePhone(raw: RawDeviceInput): Phone {
  if (!raw) {
    throw new Error('Cannot normalize null or undefined device');
  }

  // Resolve ID
  const id = raw.id ?? raw._id;

  // Resolve Name & Brand
  const name = cleanString(raw.name) ?? 'Unknown Device';
  let brand = 'Unknown Brand';
  if (typeof raw.brand === 'string') {
    brand = cleanString(raw.brand) ?? brand;
  } else if (raw.brand && typeof raw.brand.name === 'string') {
    brand = cleanString(raw.brand.name) ?? brand;
  } else if (raw.manufacturer_name) {
    brand = cleanString(raw.manufacturer_name) ?? brand;
  } else if (raw.manufacturer && typeof raw.manufacturer.name === 'string') {
    brand = cleanString(raw.manufacturer.name) ?? brand;
  }

  // Resolve Image (support image, image_url, thumbnail, base64)
  const rawImage = cleanString(
    raw.image ??
    raw.image_url ??
    raw.thumbnail ??
    raw.image_b64 ??
    raw.main_image_b64
  );

  let image: string | null = null;
  if (rawImage) {
    if (rawImage.startsWith('http://') || rawImage.startsWith('https://') || rawImage.startsWith('data:image/')) {
      image = rawImage;
    } else if (/^[A-Za-z0-9+/=]+$/.test(rawImage.replace(/\s+/g, ''))) {
      image = `data:image/jpeg;base64,${rawImage.trim()}`;
    } else {
      image = rawImage;
    }
  }

  // Release Date
  const releaseDate = cleanString(raw.releaseDate ?? raw.release_date);

  // Dimensions & Weight
  const dimensions = cleanString(raw.dimensions ?? raw.body?.dimensions);
  const weight = cleanString(raw.weight ?? raw.body?.weight);

  // Display
  let display = null;
  const displaySize = cleanString(raw.display?.size ?? raw.screen_size);
  const displayRes = cleanString(raw.display?.resolution ?? raw.screen_resolution);
  const displayType = cleanString(raw.display?.type);
  const displayRefresh = cleanString(raw.display?.refreshRate ?? raw.display?.refresh_rate);
  const displayProt = cleanString(raw.display?.protection);

  if (displaySize || displayRes || displayType || displayRefresh || displayProt) {
    display = {
      size: displaySize,
      resolution: displayRes,
      type: displayType,
      refreshRate: displayRefresh,
      protection: displayProt
    };
  }

  // Processor
  let processor = null;
  const chipset = cleanString(raw.processor?.chipset ?? raw.hardware);
  const cpu = cleanString(raw.processor?.cpu);
  const gpu = cleanString(raw.processor?.gpu);

  if (chipset || cpu || gpu) {
    processor = {
      chipset,
      cpu,
      gpu
    };
  }

  // Memory
  let memory = null;
  const ramOptions = cleanString(raw.memory?.ramOptions ?? raw.memory?.ram_options ?? raw.ram);
  const cardSlot = cleanString(raw.memory?.cardSlot ?? raw.memory?.card_slot);

  if (ramOptions || cardSlot) {
    memory = {
      ramOptions,
      cardSlot
    };
  }

  // Storage
  let storage = null;
  const storageOptions = cleanString(raw.storage?.storageOptions ?? raw.storage?.storage_options ?? (typeof raw.storage === 'string' ? raw.storage : null));
  if (storageOptions) {
    storage = {
      storageOptions
    };
  }

  // Rear Camera
  let rearCamera = null;
  const rearModules = cleanString(raw.rearCamera?.modules ?? raw.camera);
  const rearFeatures = cleanString(raw.rearCamera?.features);
  const rearVideo = cleanString(raw.rearCamera?.video);

  if (rearModules || rearFeatures || rearVideo) {
    rearCamera = {
      modules: rearModules,
      features: rearFeatures,
      video: rearVideo
    };
  }

  // Front Camera
  let frontCamera = null;
  const frontModules = cleanString(raw.frontCamera?.modules ?? raw.selfie_camera);
  const frontFeatures = cleanString(raw.frontCamera?.features);
  const frontVideo = cleanString(raw.frontCamera?.video);

  if (frontModules || frontFeatures || frontVideo) {
    frontCamera = {
      modules: frontModules,
      features: frontFeatures,
      video: frontVideo
    };
  }

  // Battery
  let battery = null;
  const batteryCap = cleanString(raw.battery?.capacity ?? raw.battery_capacity);
  const batteryType = cleanString(raw.battery?.type);

  if (batteryCap || batteryType) {
    battery = {
      capacity: batteryCap,
      type: batteryType
    };
  }

  // Charging
  const charging = cleanString(raw.charging ?? raw.battery?.charging);

  // Operating System
  const operatingSystem = cleanString(raw.operatingSystem ?? raw.operating_system ?? raw.os);

  // Network
  let network = null;
  const netTech = cleanString(raw.network?.technologies ?? raw.network_technology);
  const netSim = cleanString(raw.network?.simType ?? raw.network?.sim_type ?? raw.sim);

  if (netTech || netSim) {
    network = {
      technologies: netTech,
      simType: netSim
    };
  }

  // Connectivity
  let connectivity = null;
  const wifi = cleanString(raw.connectivity?.wifi ?? raw.wlan);
  const bluetooth = cleanString(raw.connectivity?.bluetooth);
  const nfc = cleanString(raw.connectivity?.nfc);
  const usb = cleanString(raw.connectivity?.usb);
  const positioning = cleanString(raw.connectivity?.positioning);

  if (wifi || bluetooth || nfc || usb || positioning) {
    connectivity = {
      wifi,
      bluetooth,
      nfc,
      usb,
      positioning
    };
  }

  return {
    id,
    name,
    brand,
    image,
    releaseDate,
    dimensions,
    weight,
    display,
    processor,
    memory,
    storage,
    rearCamera,
    frontCamera,
    battery,
    charging,
    operatingSystem,
    network,
    connectivity
  };
}

/**
 * Normalizes a phone into a concise PhoneSummary model for grids and search.
 * Ensures list payloads stay lightweight by stripping oversized base64 images.
 */
export function normalizePhoneSummary(raw: RawDeviceInput): PhoneSummary {
  const phone = normalizePhone(raw);
  const rawUrlThumb = cleanString(raw.thumbnail ?? raw.image_url);
  let thumbnail = rawUrlThumb && (rawUrlThumb.startsWith('http://') || rawUrlThumb.startsWith('https://'))
    ? rawUrlThumb
    : phone.image;

  // Protect list payloads: strip base64 data URIs exceeding 12KB
  if (thumbnail && !thumbnail.startsWith('http://') && !thumbnail.startsWith('https://')) {
    if (thumbnail.length > 12288) {
      thumbnail = null;
    }
  }

  return {
    id: phone.id,
    name: phone.name,
    brand: phone.brand,
    thumbnail,
    highlights: extractHighlights(phone)
  };
}

