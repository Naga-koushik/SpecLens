import { useQuery } from '@tanstack/react-query';
import { phoneService } from '../services/phoneService';
import { ApiError } from '../api/client';

export function usePhoneSearch(query: string, page = 1) {
  const trimmed = query.trim();
  const isEnabled = trimmed.length >= 2;

  return useQuery({
    queryKey: ['phones', 'search', trimmed, page],
    queryFn: () => phoneService.search(trimmed, page),
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        return false; // Never retry on 4xx errors
      }
      return failureCount < 2;
    }
  });
}
