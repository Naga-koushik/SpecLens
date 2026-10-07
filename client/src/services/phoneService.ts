import { apiClient } from '../api/client';
import { Phone, PhoneSummary, SearchResponse, AutocompleteSuggestion, CompareResponse } from '../types';

export const phoneService = {
  async search(query: string, page = 1): Promise<SearchResponse> {
    return apiClient<SearchResponse>(`/phones/search?q=${encodeURIComponent(query)}&page=${page}`);
  },

  async autocomplete(query: string, limit = 5): Promise<AutocompleteSuggestion[]> {
    const res = await apiClient<{ suggestions: AutocompleteSuggestion[] }>(
      `/phones/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return res.suggestions || [];
  },

  async getPopular(): Promise<PhoneSummary[]> {
    const res = await apiClient<{ phones: PhoneSummary[] }>('/phones/popular');
    return res.phones || [];
  },

  async getById(id: string | number): Promise<Phone> {
    return apiClient<Phone>(`/phones/${id}`);
  },

  async compare(ids: Array<string | number>): Promise<CompareResponse> {
    return apiClient<CompareResponse>(`/compare?ids=${ids.join(',')}`);
  }
};
