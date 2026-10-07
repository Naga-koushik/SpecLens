import { useState, useEffect, useCallback } from 'react';
import { PhoneSummary } from '../types';

const STORAGE_KEY = 'speclens_recently_viewed';
const MAX_RECENT = 6;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<PhoneSummary[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const addRecentlyViewed = useCallback((phone: PhoneSummary) => {
    try {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((p) => String(p.id) !== String(phone.id));
        const updated = [phone, ...filtered].slice(0, MAX_RECENT);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Ignore quota errors
        }
        return updated;
      });
    } catch {
      // Ignore
    }
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRecentlyViewed([]);
    } catch {
      // Ignore
    }
  }, []);

  return {
    recentlyViewed,
    addRecentlyViewed,
    clearRecentlyViewed
  };
}
