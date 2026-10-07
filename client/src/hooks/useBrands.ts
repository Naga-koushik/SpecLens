import { useQuery } from '@tanstack/react-query';
import { brandService } from '../services/brandService';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => brandService.getBrands(),
    staleTime: 24 * 60 * 60 * 1000 // 24 hours
  });
}
