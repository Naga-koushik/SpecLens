import { useQuery } from '@tanstack/react-query';
import { phoneService } from '../services/phoneService';
import { ApiError } from '../api/client';

export function usePhone(id: string | number | undefined) {
  const isEnabled = Boolean(id && String(id).trim().length > 0);

  return useQuery({
    queryKey: ['phone', id],
    queryFn: () => phoneService.getById(id!),
    enabled: isEnabled,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return failureCount < 2;
    }
  });
}
