import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCompare } from '../hooks/useCompare';
import { phoneService } from '../services/phoneService';
import { ApiError } from '../api/client';
import { CompareResponse } from '../types';

describe('useCompare Hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('is disabled when fewer than 2 phone IDs are passed', () => {
    const compareSpy = vi.spyOn(phoneService, 'compare');

    const { result } = renderHook(() => useCompare(['43']), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(compareSpy).not.toHaveBeenCalled();
  });

  it('fetches comparison data when 2 or more IDs are passed', async () => {
    const mockResponse: CompareResponse = {
      phones: [
        { id: 43, name: 'Phone 1', brand: 'Apple', image: null, releaseDate: null, dimensions: null, weight: null, display: null, processor: null, memory: null, storage: null, rearCamera: null, frontCamera: null, battery: null, charging: null, operatingSystem: null, network: null, connectivity: null },
        { id: 44, name: 'Phone 2', brand: 'Apple', image: null, releaseDate: null, dimensions: null, weight: null, display: null, processor: null, memory: null, storage: null, rearCamera: null, frontCamera: null, battery: null, charging: null, operatingSystem: null, network: null, connectivity: null }
      ],
      missing: []
    };

    const compareSpy = vi.spyOn(phoneService, 'compare').mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCompare(['43', '44']), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(compareSpy).toHaveBeenCalledWith(['43', '44']);
    expect(result.current.data?.phones).toHaveLength(2);
    expect(result.current.data?.missing).toHaveLength(0);
  });

  it('handles ApiError 404 gracefully', async () => {
    vi.spyOn(phoneService, 'compare').mockRejectedValue(
      new ApiError('NOT_FOUND', 'No devices found', 404)
    );

    const { result } = renderHook(() => useCompare(['99999', '88888']), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ApiError);
  });
});
