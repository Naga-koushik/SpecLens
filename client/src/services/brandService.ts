import { apiClient } from '../api/client';
import { Brand, BrandResponse } from '../types';

export const brandService = {
  async getBrands(): Promise<Brand[]> {
    const res = await apiClient<{ brands: Brand[] }>('/brands');
    return res.brands || [];
  },

  async getPhonesByBrand(brand: string, page = 1): Promise<BrandResponse> {
    return apiClient<BrandResponse>(`/brands/${encodeURIComponent(brand)}?page=${page}`);
  }
};
