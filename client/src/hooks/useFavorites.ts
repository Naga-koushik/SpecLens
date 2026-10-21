import { useState, useEffect, useCallback } from 'react';
import { PhoneSummary } from '../types';

const STORAGE_KEY = 'speclens_favorites';
const EVENT_NAME = 'speclens_favorites_updated';

function getStoredFavorites(): PhoneSummary[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<PhoneSummary[]>(() => {
    if (typeof window === 'undefined') return [];
    return getStoredFavorites();
  });

  useEffect(() => {
    const updateFavorites = () => {
      setFavorites(getStoredFavorites());
    };

    window.addEventListener('storage', updateFavorites);
    window.addEventListener(EVENT_NAME, updateFavorites);

    return () => {
      window.removeEventListener('storage', updateFavorites);
      window.removeEventListener(EVENT_NAME, updateFavorites);
    };
  }, []);

  const saveFavorites = useCallback(
    (updater: PhoneSummary[] | ((prev: PhoneSummary[]) => PhoneSummary[])) => {
      setFavorites((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          window.dispatchEvent(new Event(EVENT_NAME));
        } catch {
          // Ignore quota errors
        }
        return next;
      });
    },
    []
  );

  const isFavorite = useCallback(
    (id: string | number): boolean => {
      return favorites.some((item) => String(item.id) === String(id));
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (phone: PhoneSummary) => {
      saveFavorites((prev) => {
        const exists = prev.some((item) => String(item.id) === String(phone.id));
        if (exists) {
          return prev.filter((item) => String(item.id) !== String(phone.id));
        }
        return [...prev, phone];
      });
    },
    [saveFavorites]
  );

  const addFavorite = useCallback(
    (phone: PhoneSummary) => {
      saveFavorites((prev) => {
        if (prev.some((item) => String(item.id) === String(phone.id))) {
          return prev;
        }
        return [...prev, phone];
      });
    },
    [saveFavorites]
  );

  const removeFavorite = useCallback(
    (id: string | number) => {
      saveFavorites((prev) => prev.filter((item) => String(item.id) !== String(id)));
    },
    [saveFavorites]
  );

  const clearFavorites = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setFavorites([]);
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch {
      setFavorites([]);
    }
  }, []);

  return {
    favorites,
    favoritesCount: favorites.length,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites
  };
}
