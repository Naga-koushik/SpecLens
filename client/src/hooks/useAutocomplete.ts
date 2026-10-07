import { useQuery } from '@tanstack/react-query';
import { phoneService } from '../services/phoneService';

export function useAutocomplete(query: string, limit = 5) {
  const trimmed = query.trim();
  const isEnabled = trimmed.length >= 2;

  return useQuery({
    queryKey: ['autocomplete', trimmed, limit],
    queryFn: () => phoneService.autocomplete(trimmed, limit),
    enabled: isEnabled,
    staleTime: 3 * 60 * 1000,
    retry: false
  });
}
