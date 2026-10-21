import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Phone, PhoneSummary, SearchResponse } from '../types';
import { getSimilarPhones } from '../utils/similarPhones';
import { useRecentlyViewed } from './useRecentlyViewed';

export function useSimilarPhones(currentPhone: Phone | undefined): PhoneSummary[] {
  const queryClient = useQueryClient();
  const { recentlyViewed } = useRecentlyViewed();

  return useMemo(() => {
    if (!currentPhone) return [];

    // Collect whatever phones are already available in React Query cache
    const cachedCandidates: PhoneSummary[] = [...recentlyViewed];

    try {
      const queries = queryClient.getQueryCache().getAll();
      for (const query of queries) {
        const data = query.state.data;
        if (!data) continue;

        // popular phones { phones: PhoneSummary[] } or brand phones { phones: PhoneSummary[] }
        if (typeof data === 'object' && 'phones' in data && Array.isArray((data as any).phones)) {
          cachedCandidates.push(...(data as any).phones);
        }
        // search results { results: PhoneSummary[] }
        if (typeof data === 'object' && 'results' in data && Array.isArray((data as any).results)) {
          cachedCandidates.push(...(data as any).results);
        }
      }
    } catch {
      // Ignore cache inspection errors
    }

    return getSimilarPhones(currentPhone, cachedCandidates);
  }, [currentPhone, queryClient, recentlyViewed]);
}
