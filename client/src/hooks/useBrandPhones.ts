import { useQuery } from '@tanstack/react-query';
import { brandService } from '../services/brandService';
import { ApiError } from '../api/client';

export function useBrandPhones(brand: string | undefined, page = 1) {
  const isEnabled = Boolean(brand && brand.trim().length > 0);

  return useQuery({
    queryKey: ['brand', brand, page],
    queryFn: () => brandService.getPhonesByBrand(brand!, page),
    enabled: isEnabled,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
      return failureCount < 2;
    }
  });
}
