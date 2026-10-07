import { useQuery } from '@tanstack/react-query';
import { phoneService } from '../services/phoneService';

export function usePopularPhones() {
  return useQuery({
    queryKey: ['phones', 'popular'],
    queryFn: () => phoneService.getPopular(),
    staleTime: 60 * 60 * 1000 // 1 hour
  });
}
