/**
 * Comprehensive Mock Dataset for SpecLens
 * Contains 14 realistic smartphones across 6 major manufacturers.
 * Includes intentional missing / null fields to test "Not available" gracefully.
 */

import { Phone, Brand } from '../types/index.js';

export const MOCK_BRANDS: Brand[] = [
  { name: 'Apple', slug: 'apple', deviceCount: 3 },
  { name: 'Samsung', slug: 'samsung', deviceCount: 3 },
  { name: 'Google', slug: 'google', deviceCount: 2 },
  { name: 'OnePlus', slug: 'oneplus', deviceCount: 2 },
  { name: 'Xiaomi', slug: 'xiaomi', deviceCount: 2 },
  { name: 'Motorola', slug: 'motorola', deviceCount: 2 }
];

export const POPULAR_PHONE_NAMES = [
  'iPhone 15 Pro',
  'Samsung Galaxy S24 Ultra',
  'Google Pixel 8 Pro',
  'OnePlus 12',
  'Xiaomi 14 Ultra',
  'Samsung Galaxy S24'
];

export const MOCK_PHONES: Phone[] = [
  // 1. Apple iPhone 15 Pro
  {
    id: 43,
    name: 'Apple iPhone 15 Pro',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    releaseDate: 'September 2023',
    dimensions: '146.6 x 70.6 x 8.25 mm',
    weight: '187 g',
    display: {
      size: '6.1 inches',
      resolution: '1179 x 2556 pixels',
      type: 'LTPO Super Retina XDR OLED',
      refreshRate: '120Hz',
      protection: 'Ceramic Shield glass'
    },
    processor: {
      chipset: 'Apple A17 Pro (3 nm)',
      cpu: 'Hexa-core (2x3.78 GHz + 4x2.11 GHz)',
      gpu: 'Apple GPU (6-core graphics)'
    },
    memory: {
      ramOptions: '8GB',
      cardSlot: 'No'
    },
    storage: {
      storageOptions: '128GB, 256GB, 512GB, 1TB'
    },
    rearCamera: {
      modules: '48 MP (wide) + 12 MP (telephoto 3x) + 12 MP (ultrawide)',
      features: 'Dual-LED flash, HDR, Panorama, Sensor-shift OIS',
      video: '4K@60fps, 1080p@240fps, 10-bit HDR, ProRes'
    },
    frontCamera: {
      modules: '12 MP (wide) + SL 3D',
      features: 'HDR, Cinematic mode',
      video: '4K@60fps, 1080p@120fps, gyro-EIS'
    },
    battery: {
      capacity: '3274 mAh',
      type: 'Li-Ion non-removable'
    },
    charging: '25W wired (50% in 30 min), 15W wireless (MagSafe/Qi2)',
    operatingSystem: 'iOS 17, upgradable to iOS 18',
    network: {
      technologies: 'GSM / CDMA / HSPA / EVDO / LTE / 5G',
      simType: 'Nano-SIM and eSIM or Dual eSIM'
    },
    connectivity: {
      wifi: 'Wi-Fi 6E (802.11 a/b/g/n/ac/6e)',
      bluetooth: '5.3, A2DP, LE',
      nfc: 'Yes',
      usb: 'USB Type-C 3.2 Gen 2, DisplayPort',
      positioning: 'GPS, GLONASS, GALILEO, BDS, QZSS, NavIC'
    }
  },

  // 2. Apple iPhone 15
  {
    id: 44,
    name: 'Apple iPhone 15',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1695048065053-53d7f950663d?w=600&auto=format&fit=crop&q=80',
    releaseDate: 'September 2023',
    dimensions: '147.6 x 71.6 x 7.8 mm',
    weight: '171 g',
    display: {
      size: '6.1 inches',
      resolution: '1179 x 2556 pixels',
      type: 'Super Retina XDR OLED',
      refreshRate: '60Hz',
      protection: 'Ceramic Shield glass'
    },
    processor: {
      chipset: 'Apple A16 Bionic (4 nm)',
      cpu: 'Hexa-core (2x3.46 GHz + 4x2.02 GHz)',
      gpu: 'Apple GPU (5-core graphics)'
    },
    memory: {
      ramOptions: '6GB',
      cardSlot: 'No'
    },
    storage: {
      storageOptions: '128GB, 256GB, 512GB'
    },
    rearCamera: {
      modules: '48 MP (wide) + 12 MP (ultrawide)',
      features: 'Dual-LED flash, HDR, Panorama',
      video: '4K@60fps, 1080p@240fps'
    },
    frontCamera: {
      modules: '12 MP (wide)',
      features: 'HDR, Cinematic mode',
      video: '4K@60fps, 1080p@120fps'
    },
    battery: {
      capacity: '3349 mAh',
      type: 'Li-Ion non-removable'
    },
    charging: '20W wired (50% in 30 min), 15W wireless (MagSafe)',
    operatingSystem: 'iOS 17, upgradable to iOS 18',
    network: {
      technologies: 'GSM / HSPA / LTE / 5G',
      simType: 'Nano-SIM and eSIM'
    },
    connectivity: {
      wifi: 'Wi-Fi 6',
      bluetooth: '5.3',
      nfc: 'Yes',
      usb: 'USB Type-C 2.0',
      positioning: 'GPS, GLONASS, GALILEO, BDS, QZSS'
    }
  },

  // 3. Apple iPhone 14 (Intentional missing fields: protection null, video null)
  {
    id: 41,
    name: 'Apple iPhone 14',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=600&auto=format&fit=crop&q=80',
    releaseDate: 'September 2022',
    dimensions: '146.7 x 71.5 x 7.8 mm',
    weight: '172 g',
    display: {
      size: '6.1 inches',
      resolution: '1170 x 2532 pixels',
      type: 'Super Retina XDR OLED',
      refreshRate: '60Hz',
      protection: null // INTENTIONALLY NULL
    },
    processor: {
      chipset: 'Apple A15 Bionic (5 nm)',
      cpu: 'Hexa-core',
      gpu: 'Apple GPU (5-core)'
    },
    memory: {
      ramOptions: '6GB',
      cardSlot: 'No'
    },
    storage: {
      storageOptions: '128GB, 256GB, 512GB'
    },
    rearCamera: {
      modules: '12 MP (wide) + 12 MP (ultrawide)',
      features: 'Dual-LED flash, HDR',
      video: null // INTENTIONALLY NULL
    },
    frontCamera: {
      modules: '12 MP (wide)',
      features: 'HDR',
      video: '4K@60fps'
    },
    battery: {
      capacity: '3279 mAh',
      type: 'Li-Ion'
    },
    charging: '15W wireless (MagSafe), 50% in 30 min wired',
    operatingSystem: 'iOS 16',
    network: {
      technologies: 'GSM / CDMA / HSPA / EVDO / LTE / 5G',
      simType: 'Nano-SIM and eSIM'
    },
    connectivity: {
      wifi: 'Wi-Fi 6',
      bluetooth: '5.3',
      nfc: 'Yes',
      usb: 'Lightning, USB 2.0',
      positioning: 'GPS, GLONASS, GALILEO, BDS, QZSS'
    }
  },

  // 4. Samsung Galaxy S24 Ultra
  {
    id: 123,
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80',
    releaseDate: 'January 2024',
    dimensions: '162.3 x 79.0 x 8.6 mm',
    weight: '232 g',
    display: {
      size: '6.8 inches',
      resolution: '1440 x 3120 pixels',
      type: 'Dynamic LTPO AMOLED 2X',
      refreshRate: '120Hz',
      protection: 'Corning Gorilla Armor'
    },
    processor: {
      chipset: 'Snapdragon 8 Gen 3 for Galaxy (4 nm)',
      cpu: 'Octa-core (1x3.39 GHz + 5x3.1 GHz + 2x2.2 GHz)',
      gpu: 'Adreno 750 (1 GHz)'
    },
    memory: {
      ramOptions: '12GB',
      cardSlot: 'No'
    },
    storage: {
      storageOptions: '256GB, 512GB, 1TB'
    },
    rearCamera: {
      modules: '200 MP (wide) + 50 MP (periscope 5x) + 10 MP (telephoto 3x) + 12 MP (ultrawide)',
      features: 'Laser AF, LED flash, auto-HDR, panorama',
      video: '8K@30fps, 4K@120fps, 1080p@240fps, HDR10+'
    },
    frontCamera: {
      modules: '12 MP (wide)',
      features: 'Dual video call, Auto-HDR, HDR10+',
      video: '4K@60fps, 1080p@30fps'
    },
    battery: {
      capacity: '5000 mAh',
      type: 'Li-Ion non-removable'
    },
    charging: '45W wired (65% in 30 min), 15W wireless, 4.5W reverse wireless',
    operatingSystem: 'Android 14, One UI 6.1 (7 years updates)',
    network: {
      technologies: 'GSM / CDMA / HSPA / EVDO / LTE / 5G',
      simType: 'Nano-SIM and eSIM or Dual SIM'
    },
    connectivity: {
      wifi: 'Wi-Fi 7 (802.11 a/b/g/n/ac/6e/7)',
      bluetooth: '5.3, A2DP, LE',
      nfc: 'Yes',
      usb: 'USB Type-C 3.2, OTG, DisplayPort',
      positioning: 'GPS, GLONASS, BDS, GALILEO, QZSS'
    }
  },

  // 5. Samsung Galaxy S24
  {
    id: 124,
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
    releaseDate: 'January 2024',
    dimensions: '147.0 x 70.6 x 7.6 mm',
    weight: '167 g',
    display: {
      size: '6.2 inches',
      resolution: '1080 x 2340 pixels',
      type: 'Dynamic LTPO AMOLED 2X',
      refreshRate: '120Hz',
      protection: 'Corning Gorilla Glass Victus 2'
    },
    processor: {
      chipset: 'Exynos 2400 / Snapdragon 8 Gen 3',
      cpu: 'Deca-core / Octa-core',
      gpu: 'Xclipse 940 / Adreno 750'
    },
    memory: {
      ramOptions: '8GB',
      cardSlot: 'No'
    },
    storage: {
      storageOptions: '128GB, 256GB, 512GB'
    },
    rearCamera: {
      modules: '50 MP (wide) + 10 MP (telephoto 3x) + 12 MP (ultrawide)',
      features: 'LED flash, auto-HDR, panorama',
      video: '8K@30fps, 4K@60fps, 1080p@240fps'
    },
    frontCamera: {
      modules: '12 MP (wide)',
      features: 'Dual video call, Auto-HDR',
      video: '4K@60fps, 1080p@30fps'
    },
    battery: {
      capacity: '4000 mAh',
      type: 'Li-Ion non-removable'
    },
    charging: '25W wired (50% in 30 min), 15W wireless',
    operatingSystem: 'Android 14, One UI 6.1',
    network: {
      technologies: 'GSM / HSPA / LTE / 5G',
      simType: 'Nano-SIM and eSIM'
    },
    connectivity: {
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.3',
      nfc: 'Yes',
      usb: 'USB Type-C 3.2',
      positioning: 'GPS, GLONASS, BDS, GALILEO, QZSS'
    }
  },

  // 6. Samsung Galaxy A55 5G (Mid-range, has microSD card slot)
  {
    id: 126,
    name: 'Samsung Galaxy A55 5G',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    releaseDate: 'March 2024',
    dimensions: '161.1 x 77.4 x 8.2 mm',
    weight: '213 g',
    display: {
      size: '6.6 inches',
      resolution: '1080 x 2340 pixels',
      type: 'Super AMOLED',
      refreshRate: '120Hz',
      protection: 'Corning Gorilla Glass Victus+'
    },
    processor: {
      chipset: 'Exynos 1480 (4 nm)',
      cpu: 'Octa-core (4x2.75 GHz + 4x2.0 GHz)',
      gpu: 'Xclipse 530'
    },
    memory: {
      ramOptions: '8GB, 12GB',
      cardSlot: 'microSDXC (uses shared SIM slot)'
    },
    storage: {
      storageOptions: '128GB, 256GB'
    },
    rearCamera: {
      modules: '50 MP (wide) + 12 MP (ultrawide) + 5 MP (macro)',
      features: 'LED flash, panorama, HDR',
      video: '4K@30fps, 1080p@60fps, gyro-EIS'
    },
    frontCamera: {
      modules: '32 MP (wide)',
      features: 'HDR',
      video: '4K@30fps, 1080p@60fps'
    },
    battery: {
      capacity: '5000 mAh',
      type: 'Li-Ion non-removable'
    },
    charging: '25W wired',
    operatingSystem: 'Android 14, One UI 6.1',
    network: {
      technologies: 'GSM / HSPA / LTE / 5G',
      simType: 'Single SIM or Hybrid Dual SIM'
    },
    connectivity: {
      wifi: 'Wi-Fi 6',
      bluetooth: '5.3',
      nfc: 'Yes',
      usb: 'USB Type-C 2.0, OTG',
      positioning: 'GPS, GALILEO, GLONASS, BDS, QZSS'
    }
  },

  // 7. Google Pixel 8 Pro
  {
    id: 150,
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    image: 'https://images.unsplash.com/photo-1598327105854-c8674faddf79?w=600&auto=format&fit=crop&q=80',
    releaseDate: 'October 2023',
    dimensions: '162.6 x 76.5 x 8.8 mm',
    weight: '213 g',
    display: {
      size: '6.7 inches',
      resolution: '1344 x 2992 pixels',
      type: 'LTPO OLED',
      refreshRate: '120Hz',
      protection: 'Corning Gorilla Glass Victus 2'
    },
    processor: {
      chipset: 'Google Tensor G3 (4 nm)',
      cpu: 'Nona-core (1x3.0 GHz + 4x2.45 GHz + 4x2.15 GHz)',
      gpu: 'Immortalis-G715s MC10'
    },
    memory: {
      ramOptions: '12GB',
      cardSlot: 'No'
    },
    storage: {
      storageOptions: '128GB, 256GB, 512GB, 1TB'
    },
    rearCamera: {
      modules: '50 MP (wide) + 48 MP (telephoto 5x) + 48 MP (ultrawide)',
      features: 'Multi-zone Laser AF, Dual-LED flash, Pixel Shift, Ultra HDR, Best Take',
      video: '4K@60fps, 1080p@240fps, 10-bit HDR, gyro-EIS'
    },
    frontCamera: {
      modules: '10.5 MP (ultrawide)',
      features: 'Auto-HDR, panorama',
      video: '4K@60fps, 1080p@60fps'
    },
    battery: {
      capacity: '5050 mAh',
      type: 'Li-Ion non-removable'
    },
    charging: '30W wired (50% in 30 min), 23W wireless, Reverse wireless',
    operatingSystem: 'Android 14 (7 years OS updates)',
    network: {
      technologies: 'GSM / HSPA / LTE / 5G',
      simType: 'Nano-SIM and eSIM'
    },
    connectivity: {
      wifi: 'Wi-Fi 7 (802.11 a/b/g/n/ac/6e/7)',
      bluetooth: '5.3, aptX HD',
      nfc: 'Yes',
      usb: 'USB Type-C 3.2',
      positioning: 'GPS, GLONASS, GALILEO, QZSS'
    }
  },

  // 8. Google Pixel 8a (Intentional missing fields: cardSlot null, positioning null)
  {
    id: 151,
    name: 'Google Pixel 8a',
    brand: 'Google',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    releaseDate: 'May 2024',
    dimensions: '152.1 x 72.7 x 8.9 mm',
    weight: '188 g',
    display: {
      size: '6.1 inches',
      resolution: '1080 x 2400 pixels',
      type: 'OLED',
      refreshRate: '120Hz',
      protection: 'Corning Gorilla Glass 3'
    },
    processor: {
      chipset: 'Google Tensor G3 (4 nm)',
      cpu: 'Nona-core',
      gpu: 'Immortalis-G715s MC10'
    },
    memory: {
      ramOptions: '8GB',
      cardSlot: null // INTENTIONALLY NULL
    },
    storage: {
      storageOptions: '128GB, 256GB'
    },
    rearCamera: {
      modules: '64 MP (wide) + 13 MP (ultrawide)',
      features: 'Dual-LED flash, Pixel Shift, Ultra HDR',
      video: '4K@60fps, 1080p@240fps'
    },
    frontCamera: {
      modules: '13 MP (ultrawide)',
      features: 'Auto-HDR',
      video: '4K@30fps, 1080p@30fps'
    },
    battery: {
      capacity: '4492 mAh',
      type: 'Li-Ion non-removable'
    },
    charging: '18W wired, 7.5W wireless',
    operatingSystem: 'Android 14 (7 years updates)',
    network: {
      technologies: 'GSM / HSPA / LTE / 5G',
      simType: 'Nano-SIM and eSIM'
    },
    connectivity: {
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.3',
      nfc: 'Yes',
      usb: 'USB Type-C 3.2',
      positioning: null // INTENTIONALLY NULL
    }
  },

  // 9. OnePlus 12
  {
    id: 170,
    name: 'OnePlus 12',
    brand: 'OnePlus',
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80',
    releaseDate: 'January 2024',
    dimensions: '164.3 x 75.8 x 9.2 mm',
    weight: '220 g',
    display: {
      size: '6.82 inches',
      resolution: '1440 x 3168 pixels',
      type: 'LTPO AMOLED, 1B colors, Dolby Vision',
      refreshRate: '120Hz',
      protection: 'Corning Gorilla Glass Victus 2'
    },
    processor: {
      chipset: 'Qualcomm Snapdragon 8 Gen 3 (4 nm)',
      cpu: 'Octa-core (1x3.3 GHz + 5x3.2 GHz + 2x2.3 GHz)',
      gpu: 'Adreno 750'
    },
    memory: {
      ramOptions: '12GB, 16GB, 24GB',
      cardSlot: 'No'
    },
    storage: {
      storageOptions: '256GB, 512GB, 1TB UFS 4.0'
    },
    rearCamera: {
      modules: '50 MP (wide) + 64 MP (periscope 3x) + 48 MP (ultrawide)',
      features: 'Hasselblad Color Calibration, Dual-LED flash, HDR, panorama',
      video: '8K@24fps, 4K@60fps, 1080p@240fps, Dolby Vision'
    },
    frontCamera: {
      modules: '32 MP (wide)',
      features: 'Auto-HDR, panorama',
      video: '4K@30fps, 1080p@30fps'
    },
    battery: {
      capacity: '5400 mAh',
      type: 'Li-Po non-removable'
    },
    charging: '100W wired (1-100% in 26 min), 50W wireless, 10W reverse wireless',
    operatingSystem: 'Android 14, OxygenOS 14',
    network: {
      technologies: 'GSM / CDMA / HSPA / LTE / 5G',
      simType: 'Dual SIM (Nano-SIM, dual stand-by)'
    },
    connectivity: {
      wifi: 'Wi-Fi 7',
      bluetooth: '5.4, aptX HD, LHDC',
      nfc: 'Yes',
      usb: 'USB Type-C 3.2, OTG',
      positioning: 'GPS (L1+L5), GLONASS, BDS, GALILEO, QZSS, NavIC'
    }
  },

  // 10. OnePlus 12R (Intentional missing fields: wireless charging null, telephoto null)
  {
    id: 171,
    name: 'OnePlus 12R',
    brand: 'OnePlus',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    releaseDate: 'February 2024',
    dimensions: '163.3 x 75.3 x 8.8 mm',
    weight: '207 g',
    display: {
      size: '6.78 inches',
      resolution: '1264 x 2780 pixels',
      type: 'LTPO4 AMOLED, 1B colors, HDR10+',
      refreshRate: '120Hz',
      protection: 'Corning Gorilla Glass Victus 2'
    },
    processor: {
      chipset: 'Qualcomm Snapdragon 8 Gen 2 (4 nm)',
      cpu: 'Octa-core (1x3.2 GHz + 4x2.8 GHz + 3x2.0 GHz)',
      gpu: 'Adreno 740'
    },
    memory: {
      ramOptions: '8GB, 16GB',
      cardSlot: 'No'
    },
    storage: {
      storageOptions: '128GB, 256GB'
    },
    rearCamera: {
      modules: '50 MP (wide) + 8 MP (ultrawide) + 2 MP (macro)',
      features: 'LED flash, HDR, panorama',
      video: '4K@60fps, 1080p@240fps'
    },
    frontCamera: {
      modules: '16 MP (wide)',
      features: 'HDR, panorama',
      video: '1080p@30fps'
    },
    battery: {
      capacity: '5500 mAh',
      type: 'Li-Po non-removable'
    },
    charging: '100W wired (1-100% in 26 min advertised), No wireless charging',
    operatingSystem: 'Android 14, OxygenOS 14',
    network: {
      technologies: 'GSM / HSPA / LTE / 5G',
      simType: 'Dual SIM (Nano-SIM)'
    },
    connectivity: {
      wifi: 'Wi-Fi 7',
      bluetooth: '5.3',
      nfc: 'Yes',
      usb: 'USB Type-C 2.0',
      positioning: 'GPS, GLONASS, BDS, GALILEO, QZSS'
    }
  },

  // 11. Xiaomi 14 Ultra
  {
    id: 190,
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&auto=format&fit=crop&q=80',
    releaseDate: 'February 2024',
    dimensions: '161.4 x 75.3 x 9.2 mm',
    weight: '219.8 g',
    display: {
      size: '6.73 inches',
      resolution: '1440 x 3200 pixels',
      type: 'LTPO AMOLED, 68B colors, Dolby Vision',
      refreshRate: '120Hz',
      protection: 'Xiaomi Shield Glass'
    },
    processor: {
      chipset: 'Qualcomm Snapdragon 8 Gen 3 (4 nm)',
      cpu: 'Octa-core (1x3.3 GHz + 5x3.2 GHz + 2x2.3 GHz)',
      gpu: 'Adreno 750'
    },
    memory: {
      ramOptions: '12GB, 16GB',
      cardSlot: 'No'
    },
    storage: {
      storageOptions: '256GB, 512GB, 1TB UFS 4.0'
    },
    rearCamera: {
      modules: '50 MP (1-inch wide) + 50 MP (periscope 5x) + 50 MP (telephoto 3.2x) + 50 MP (ultrawide) + TOF 3D',
      features: 'Leica lenses, Dual-LED flash, HDR, panorama, 67mm filter ring support',
      video: '8K@30fps, 4K@120fps, Dolby Vision HDR 10-bit rec.'
    },
    frontCamera: {
      modules: '32 MP (wide)',
      features: 'HDR, panorama',
      video: '4K@60fps, 1080p@60fps'
    },
    battery: {
      capacity: '5000 mAh',
      type: 'Li-Po non-removable'
    },
    charging: '90W wired (100% in 33 min), 80W wireless (100% in 46 min), 10W reverse wireless',
    operatingSystem: 'Android 14, HyperOS',
    network: {
      technologies: 'GSM / CDMA / HSPA / EVDO / LTE / 5G',
      simType: 'Dual SIM (Nano-SIM, dual stand-by)'
    },
    connectivity: {
      wifi: 'Wi-Fi 7',
      bluetooth: '5.4, aptX HD, LHDC',
      nfc: 'Yes',
      usb: 'USB Type-C 3.2 Gen 2, DisplayPort, OTG',
      positioning: 'GPS (L1+L5), GLONASS, BDS, GALILEO, QZSS, NavIC'
    }
  },

  // 12. Xiaomi 13T Pro (Intentional missing fields: wireless charging null, usb version simple)
  {
    id: 191,
    name: 'Xiaomi 13T Pro',
    brand: 'Xiaomi',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    releaseDate: 'September 2023',
    dimensions: '162.2 x 75.7 x 8.49 mm',
    weight: '206 g',
    display: {
      size: '6.67 inches',
      resolution: '1220 x 2712 pixels',
      type: 'AMOLED, 68B colors, Dolby Vision, HDR10+',
      refreshRate: '144Hz',
      protection: 'Corning Gorilla Glass 5'
    },
    processor: {
      chipset: 'MediaTek Dimensity 9200+ (4 nm)',
      cpu: 'Octa-core (1x3.35 GHz + 3x3.0 GHz + 4x2.0 GHz)',
      gpu: 'Immortalis-G715 MC11'
    },
    memory: {
      ramOptions: '12GB, 16GB',
      cardSlot: 'No'
    },
    storage: {
      storageOptions: '256GB, 512GB, 1TB UFS 4.0'
    },
    rearCamera: {
      modules: '50 MP (wide) + 50 MP (telephoto 2x) + 12 MP (ultrawide)',
      features: 'Leica lens, LED flash, HDR, panorama',
      video: '8K@24fps, 4K@60fps, 10-bit LOG'
    },
    frontCamera: {
      modules: '20 MP (wide)',
      features: 'HDR',
      video: '1080p@30fps'
    },
    battery: {
      capacity: '5000 mAh',
      type: 'Li-Po non-removable'
    },
    charging: '120W wired (100% in 19 min advertised)',
    operatingSystem: 'Android 13, upgradable to Android 14, HyperOS',
    network: {
      technologies: 'GSM / HSPA / LTE / 5G',
      simType: 'Nano-SIM and eSIM'
    },
    connectivity: {
      wifi: 'Wi-Fi 7',
      bluetooth: '5.4',
      nfc: 'Yes',
      usb: 'USB Type-C 2.0, OTG',
      positioning: 'GPS, GLONASS, BDS, GALILEO, QZSS, NavIC'
    }
  },

  // 13. Motorola Edge 50 Pro (Intentional missing fields: cardSlot null, weight approx)
  {
    id: 210,
    name: 'Motorola Edge 50 Pro',
    brand: 'Motorola',
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&auto=format&fit=crop&q=80',
    releaseDate: 'April 2024',
    dimensions: '161.2 x 72.4 x 8.2 mm',
    weight: '186 g',
    display: {
      size: '6.7 inches',
      resolution: '1220 x 2712 pixels',
      type: 'OLED, 1B colors, HDR10+',
      refreshRate: '144Hz',
      protection: 'Corning Gorilla Glass'
    },
    processor: {
      chipset: 'Qualcomm Snapdragon 7 Gen 3 (4 nm)',
      cpu: 'Octa-core (1x2.63 GHz + 3x2.4 GHz + 4x1.8 GHz)',
      gpu: 'Adreno 720'
    },
    memory: {
      ramOptions: '8GB, 12GB',
      cardSlot: null // INTENTIONALLY NULL
    },
    storage: {
      storageOptions: '128GB, 256GB, 512GB'
    },
    rearCamera: {
      modules: '50 MP (wide) + 10 MP (telephoto 3x) + 13 MP (ultrawide)',
      features: 'Laser AF, Dual-LED flash, HDR, panorama',
      video: '4K@30fps, 1080p@60fps'
    },
    frontCamera: {
      modules: '50 MP (wide)',
      features: 'HDR',
      video: '4K@30fps, 1080p@60fps'
    },
    battery: {
      capacity: '4500 mAh',
      type: 'Li-Po non-removable'
    },
    charging: '125W wired (100% in 18 min), 50W wireless, 10W reverse wireless',
    operatingSystem: 'Android 14, Hello UI',
    network: {
      technologies: 'GSM / HSPA / LTE / 5G',
      simType: 'Nano-SIM and eSIM'
    },
    connectivity: {
      wifi: 'Wi-Fi 6E',
      bluetooth: '5.4',
      nfc: 'Yes',
      usb: 'USB Type-C 3.1, DisplayPort',
      positioning: 'GPS, GLONASS, BDS, GALILEO, NavIC'
    }
  },

  // 14. Motorola Razr 50 Ultra (Foldable phone, unusual dimensions, missing cardSlot)
  {
    id: 211,
    name: 'Motorola Razr 50 Ultra',
    brand: 'Motorola',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80',
    releaseDate: 'June 2024',
    dimensions: 'Unfolded: 171.4 x 74 x 7.1 mm; Folded: 88.1 x 74 x 15.3 mm',
    weight: '189 g',
    display: {
      size: '6.9 inches (main), 4.0 inches (cover)',
      resolution: '1080 x 2640 pixels (main), 1272 x 1080 (cover)',
      type: 'Foldable LTPO AMOLED, 1B colors, Dolby Vision',
      refreshRate: '165Hz',
      protection: 'Corning Gorilla Glass Victus (cover)'
    },
    processor: {
      chipset: 'Qualcomm Snapdragon 8s Gen 3 (4 nm)',
      cpu: 'Octa-core (1x3.0 GHz + 4x2.8 GHz + 3x2.0 GHz)',
      gpu: 'Adreno 735'
    },
    memory: {
      ramOptions: '12GB',
      cardSlot: 'No'
    },
    storage: {
      storageOptions: '256GB, 512GB UFS 4.0'
    },
    rearCamera: {
      modules: '50 MP (wide) + 50 MP (telephoto 2x)',
      features: 'LED flash, panorama, HDR',
      video: '4K@60fps, 1080p@60fps, HDR10+'
    },
    frontCamera: {
      modules: '32 MP (wide)',
      features: 'HDR',
      video: '4K@60fps, 1080p@60fps'
    },
    battery: {
      capacity: '4000 mAh',
      type: 'Li-Po non-removable'
    },
    charging: '45W wired, 15W wireless, 5W reverse wired',
    operatingSystem: 'Android 14, Hello UI',
    network: {
      technologies: 'GSM / HSPA / LTE / 5G',
      simType: 'Nano-SIM and eSIM'
    },
    connectivity: {
      wifi: 'Wi-Fi 7',
      bluetooth: '5.4',
      nfc: 'Yes',
      usb: 'USB Type-C 2.0',
      positioning: 'GPS, GLONASS, BDS, GALILEO, QZSS'
    }
  }
];
