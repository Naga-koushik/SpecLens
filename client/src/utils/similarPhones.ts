import { Phone, PhoneSummary } from '../types';

export const FALLBACK_PHONES: PhoneSummary[] = [
  {
    id: 43,
    name: 'Apple iPhone 15 Pro',
    brand: 'Apple',
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    highlights: ['6.1 inches', 'Apple A17 Pro (3 nm)', '3274 mAh'],
    releaseDate: 'September 2023',
    ram: '8GB'
  },
  {
    id: 44,
    name: 'Apple iPhone 15',
    brand: 'Apple',
    thumbnail: 'https://images.unsplash.com/photo-1695048065053-53d7f950663d?w=600&auto=format&fit=crop&q=80',
    highlights: ['6.1 inches', 'Apple A16 Bionic (4 nm)', '3349 mAh'],
    releaseDate: 'September 2023',
    ram: '6GB'
  },
  {
    id: 41,
    name: 'Apple iPhone 14',
    brand: 'Apple',
    thumbnail: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=600&auto=format&fit=crop&q=80',
    highlights: ['6.1 inches', 'Apple A15 Bionic (5 nm)', '3279 mAh'],
    releaseDate: 'September 2022',
    ram: '6GB'
  },
  {
    id: 46,
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    highlights: ['6.8 inches', 'Snapdragon 8 Gen 3 (4 nm)', '5000 mAh'],
    releaseDate: 'January 2024',
    ram: '12GB'
  },
  {
    id: 47,
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    thumbnail: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
    highlights: ['6.2 inches', 'Exynos 2400 / Snapdragon 8 Gen 3', '4000 mAh'],
    releaseDate: 'January 2024',
    ram: '8GB'
  },
  {
    id: 48,
    name: 'Samsung Galaxy A55 5G',
    brand: 'Samsung',
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    highlights: ['6.6 inches', 'Exynos 1480 (4 nm)', '5000 mAh'],
    releaseDate: 'March 2024',
    ram: '8GB'
  },
  {
    id: 49,
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    highlights: ['6.7 inches', 'Google Tensor G3 (4 nm)', '5050 mAh'],
    releaseDate: 'October 2023',
    ram: '12GB'
  },
  {
    id: 50,
    name: 'Google Pixel 8a',
    brand: 'Google',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    highlights: ['6.1 inches', 'Google Tensor G3 (4 nm)', '4492 mAh'],
    releaseDate: 'May 2024',
    ram: '8GB'
  },
  {
    id: 51,
    name: 'OnePlus 12',
    brand: 'OnePlus',
    thumbnail: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80',
    highlights: ['6.82 inches', 'Snapdragon 8 Gen 3 (4 nm)', '5400 mAh'],
    releaseDate: 'December 2023',
    ram: '16GB'
  },
  {
    id: 52,
    name: 'OnePlus 12R',
    brand: 'OnePlus',
    thumbnail: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80',
    highlights: ['6.78 inches', 'Snapdragon 8 Gen 2 (4 nm)', '5500 mAh'],
    releaseDate: 'January 2024',
    ram: '16GB'
  },
  {
    id: 53,
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    highlights: ['6.73 inches', 'Snapdragon 8 Gen 3 (4 nm)', '5000 mAh'],
    releaseDate: 'February 2024',
    ram: '16GB'
  },
  {
    id: 54,
    name: 'Xiaomi 13T Pro',
    brand: 'Xiaomi',
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    highlights: ['6.67 inches', 'Mediatek Dimensity 9200+ (4 nm)', '5000 mAh'],
    releaseDate: 'September 2023',
    ram: '12GB'
  },
  {
    id: 55,
    name: 'Motorola Edge 50 Pro',
    brand: 'Motorola',
    thumbnail: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
    highlights: ['6.7 inches', 'Snapdragon 7 Gen 3 (4 nm)', '4500 mAh'],
    releaseDate: 'April 2024',
    ram: '12GB'
  },
  {
    id: 56,
    name: 'Motorola Razr 50 Ultra',
    brand: 'Motorola',
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    highlights: ['6.9 inches', 'Snapdragon 8s Gen 3 (4 nm)', '4000 mAh'],
    releaseDate: 'June 2024',
    ram: '12GB'
  }
];

function extractYear(dateString?: string | null): number | null {
  if (!dateString) return null;
  const match = dateString.match(/\b(20\d\d)\b/);
  return match ? parseInt(match[1], 10) : null;
}

export function getSimilarPhones(
  currentPhone: Phone,
  pool: PhoneSummary[] = FALLBACK_PHONES
): PhoneSummary[] {
  if (!currentPhone) return [];

  const targetYear = extractYear(currentPhone.releaseDate);
  const targetBrand = (currentPhone.brand || '').toLowerCase().trim();
  const currentId = String(currentPhone.id);

  // De-duplicate candidate pool
  const candidateMap = new Map<string, PhoneSummary>();
  // Pool first, then fallback
  for (const phone of [...pool, ...FALLBACK_PHONES]) {
    const idStr = String(phone.id);
    if (idStr !== currentId && !candidateMap.has(idStr)) {
      candidateMap.set(idStr, phone);
    }
  }

  const candidates = Array.from(candidateMap.values());

  const scored = candidates.map((phone) => {
    let score = 0;
    const phoneBrand = (phone.brand || '').toLowerCase().trim();
    const phoneYear = extractYear(phone.releaseDate);

    // Same brand gets high priority
    if (targetBrand && phoneBrand === targetBrand) {
      score += 20;
    }

    // Release year match or proximity
    if (targetYear && phoneYear) {
      const yearDiff = Math.abs(targetYear - phoneYear);
      if (yearDiff === 0) {
        score += 10;
      } else if (yearDiff === 1) {
        score += 5;
      }
    }

    return { phone, score };
  });

  // Sort descending by score, take top 4
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 4).map((s) => s.phone);
}
