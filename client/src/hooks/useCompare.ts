import { useQuery } from '@tanstack/react-query';
import { phoneService } from '../services/phoneService';
import { ApiError } from '../api/client';

export function useCompare(ids: Array<string | number>) {
  const validIds = ids.map(String).map((id) => id.trim()).filter(Boolean);
  const isEnabled = validIds.length >= 2 && validIds.length <= 4;

  return useQuery({
    queryKey: ['compare', validIds.sort().join(',')],
    queryFn: () => phoneService.compare(validIds),
    enabled: isEnabled,
    staleTime: 30 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
      return failureCount < 2;
    }
  });
}
