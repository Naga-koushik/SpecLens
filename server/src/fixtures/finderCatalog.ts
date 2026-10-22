/**
 * DEMO DATA: the Finder catalogue is intentionally local and deterministic.
 * Prices are illustrative and must never be presented as verified market data.
 * A generated live snapshot can replace this module when a key is available.
 */
import { Phone } from '../types/index.js';
import { MOCK_PHONES } from './mockData.js';

const demoVariants: Array<[string, string, number, number, number, number, number, number, string]> = [
  ['Samsung Galaxy A15', 'Samsung', 6.5, 5000, 6, 128, 90, 2024, 'Android 14'],
  ['Samsung Galaxy A25', 'Samsung', 6.5, 5000, 8, 256, 120, 2024, 'Android 14'],
  ['Samsung Galaxy S23 FE', 'Samsung', 6.4, 4500, 8, 256, 120, 2023, 'Android 13'],
  ['Samsung Galaxy Z Flip5', 'Samsung', 6.7, 3700, 8, 256, 120, 2023, 'Android 13'],
  ['Google Pixel 7a', 'Google', 6.1, 4385, 8, 128, 90, 2023, 'Android 13'],
  ['Google Pixel 8a', 'Google', 6.1, 4492, 8, 128, 120, 2024, 'Android 14'],
  ['Google Pixel 9 Pro', 'Google', 6.3, 4700, 16, 256, 120, 2024, 'Android 14'],
  ['OnePlus Nord CE 4', 'OnePlus', 6.7, 5500, 8, 128, 120, 2024, 'Android 14'],
  ['OnePlus Nord 4', 'OnePlus', 6.74, 5500, 12, 256, 120, 2024, 'Android 14'],
  ['OnePlus 11', 'OnePlus', 6.7, 5000, 12, 256, 120, 2023, 'Android 13'],
  ['Xiaomi Redmi Note 13', 'Xiaomi', 6.67, 5000, 8, 256, 120, 2024, 'Android 13'],
  ['Xiaomi Poco X6 Pro', 'Xiaomi', 6.67, 5000, 12, 512, 120, 2024, 'Android 14'],
  ['Xiaomi 14', 'Xiaomi', 6.36, 4610, 12, 512, 120, 2024, 'Android 14'],
  ['Motorola Moto G54', 'Motorola', 6.5, 6000, 8, 128, 120, 2023, 'Android 13'],
  ['Motorola Edge 50 Fusion', 'Motorola', 6.7, 5000, 12, 256, 144, 2024, 'Android 14'],
  ['Nothing Phone 2a', 'Nothing', 6.7, 5000, 8, 128, 120, 2024, 'Android 14'],
  ['Nothing Phone 2', 'Nothing', 6.7, 4700, 12, 256, 120, 2023, 'Android 13'],
  ['ASUS ROG Phone 8', 'ASUS', 6.78, 5500, 16, 512, 165, 2024, 'Android 14'],
  ['ASUS Zenfone 10', 'ASUS', 5.92, 4300, 8, 128, 144, 2023, 'Android 13'],
  ['Sony Xperia 1 V', 'Sony', 6.5, 5000, 12, 256, 120, 2023, 'Android 13'],
  ['Sony Xperia 5 V', 'Sony', 6.1, 5000, 8, 128, 120, 2023, 'Android 13'],
  ['Oppo Reno 11', 'Oppo', 6.7, 5000, 12, 256, 120, 2024, 'Android 14'],
  ['Vivo V30', 'Vivo', 6.78, 5000, 8, 256, 120, 2024, 'Android 14'],
  ['Realme 12 Pro+', 'Realme', 6.7, 5000, 12, 256, 120, 2024, 'Android 14'],
  ['Honor 200', 'Honor', 6.7, 5200, 12, 512, 120, 2024, 'Android 14'],
  ['Apple iPhone SE 2022', 'Apple', 4.7, 2018, 4, 64, 60, 2022, 'iOS 15'],
  ['Apple iPhone 13', 'Apple', 6.1, 3227, 4, 128, 60, 2021, 'iOS 15'],
  ['Apple iPhone 14 Pro', 'Apple', 6.1, 3200, 6, 256, 120, 2022, 'iOS 16'],
  ['Apple iPhone 15 Plus', 'Apple', 6.7, 4383, 6, 128, 60, 2023, 'iOS 17'],
  ['Apple iPhone 15 Pro Max', 'Apple', 6.7, 4441, 8, 256, 120, 2023, 'iOS 17'],
  ['Apple iPhone 16', 'Apple', 6.1, 3561, 8, 128, 60, 2024, 'iOS 18'],
  ['Apple iPhone 16 Pro', 'Apple', 6.3, 3582, 8, 256, 120, 2024, 'iOS 18'],
  ['Samsung Galaxy S22', 'Samsung', 6.1, 3700, 8, 128, 120, 2022, 'Android 12'],
  ['Samsung Galaxy S22 Ultra', 'Samsung', 6.8, 5000, 12, 256, 120, 2022, 'Android 12'],
  ['Samsung Galaxy S24+', 'Samsung', 6.7, 4900, 12, 256, 120, 2024, 'Android 14'],
  ['Google Pixel 6a', 'Google', 6.1, 4410, 6, 128, 60, 2022, 'Android 12'],
  ['OnePlus 10 Pro', 'OnePlus', 6.7, 5000, 8, 128, 120, 2022, 'Android 12'],
  ['Xiaomi 13T', 'Xiaomi', 6.67, 5000, 8, 256, 144, 2023, 'Android 13'],
  ['Motorola Razr 40', 'Motorola', 6.9, 4200, 8, 256, 144, 2023, 'Android 13'],
  ['Oppo Find X7 Ultra', 'Oppo', 6.82, 5000, 16, 512, 120, 2024, 'Android 14'],
  ['Vivo X100 Pro', 'Vivo', 6.78, 5400, 16, 512, 120, 2024, 'Android 14'],
  ['Realme GT 6', 'Realme', 6.78, 5500, 16, 512, 120, 2024, 'Android 14'],
  ['Honor Magic6 Pro', 'Honor', 6.8, 5600, 12, 512, 120, 2024, 'Android 14'],
  ['Sony Xperia 10 V', 'Sony', 6.1, 5000, 6, 128, 60, 2023, 'Android 13'],
  ['ASUS ROG Phone 7', 'ASUS', 6.78, 6000, 16, 512, 165, 2023, 'Android 13'],
  ['Nothing Phone 1', 'Nothing', 6.55, 4500, 8, 128, 120, 2022, 'Android 12'],
  ['Nokia X30', 'Nokia', 6.43, 4200, 8, 256, 90, 2022, 'Android 12'],
  ['Fairphone 5', 'Fairphone', 6.46, 4200, 8, 256, 90, 2023, 'Android 13'],
  ['TCL 40', 'TCL', 6.56, 5000, 8, 256, 90, 2023, 'Android 13']
];

const displayTypes = ['AMOLED', 'LTPO AMOLED', 'OLED', 'IPS LCD'];
export const FINDER_CATALOG: Phone[] = [
  ...MOCK_PHONES.map((phone) => ({ ...phone, price: phone.price ?? null })),
  ...demoVariants.map(([name, brand, size, battery, ram, storage, refresh, year, os], index) => {
    const template = MOCK_PHONES[index % MOCK_PHONES.length];
    return {
      ...template,
      id: 1000 + index,
      name,
      brand,
      releaseDate: String(year),
      weight: `${160 + (index % 16) * 5} g`,
      display: { size: `${size} inches`, resolution: template.display?.resolution ?? null, type: displayTypes[index % displayTypes.length], refreshRate: `${refresh}Hz`, protection: template.display?.protection ?? null },
      memory: { ramOptions: `${ram}GB`, cardSlot: template.memory?.cardSlot ?? null },
      storage: { storageOptions: `${storage}GB` },
      battery: { capacity: `${battery} mAh`, type: template.battery?.type ?? null },
      operatingSystem: os,
      price: { amount: 12000 + (index % 15) * 7000, currency: 'INR', raw: `₹${12000 + (index % 15) * 7000} DEMO DATA` }
    };
  })
];
