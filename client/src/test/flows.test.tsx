import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { PhoneDetailPage } from '../pages/PhoneDetailPage';
import { ComparePage } from '../pages/ComparePage';
import { phoneService } from '../services/phoneService';
import { brandService } from '../services/brandService';
import { Phone, PhoneSummary, CompareResponse } from '../types';

describe('End-to-End User Flows', () => {
  let queryClient: QueryClient;

  const mockPhone1: Phone = {
    id: 43,
    name: 'Apple iPhone 15 Pro',
    brand: 'Apple',
    image: null,
    releaseDate: 'September 2023',
    dimensions: '146.6 x 70.6 x 8.25 mm',
    weight: '187 g',
    display: { size: '6.1 inches', resolution: '1179 x 2556 pixels', type: 'OLED', refreshRate: '120Hz', protection: null },
    processor: { chipset: 'Apple A17 Pro', cpu: 'Hexa-core', gpu: 'Apple GPU' },
    memory: { ramOptions: '8GB', cardSlot: 'No' },
    storage: { storageOptions: '128GB' },
    rearCamera: { modules: '48MP', features: null, video: null },
    frontCamera: { modules: '12MP', features: null, video: null },
    battery: { capacity: '3274 mAh', type: 'Li-Ion' },
    charging: '25W',
    operatingSystem: 'iOS 17',
    network: { technologies: '5G', simType: 'eSIM' },
    connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', nfc: 'Yes', usb: 'Type-C', positioning: 'GPS' }
  };

  const mockPhone2: Phone = {
    id: 46,
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    image: null,
    releaseDate: 'January 2024',
    dimensions: '162.3 x 79 x 8.6 mm',
    weight: '232 g',
    display: { size: '6.8 inches', resolution: '1440 x 3120 pixels', type: 'AMOLED', refreshRate: '120Hz', protection: null },
    processor: { chipset: 'Snapdragon 8 Gen 3', cpu: 'Octa-core', gpu: 'Adreno 750' },
    memory: { ramOptions: '12GB', cardSlot: 'No' },
    storage: { storageOptions: '256GB' },
    rearCamera: { modules: '200MP', features: null, video: null },
    frontCamera: { modules: '12MP', features: null, video: null },
    battery: { capacity: '5000 mAh', type: 'Li-Ion' },
    charging: '45W',
    operatingSystem: 'Android 14',
    network: { technologies: '5G', simType: 'Nano-SIM' },
    connectivity: { wifi: 'Wi-Fi 7', bluetooth: '5.3', nfc: 'Yes', usb: 'Type-C', positioning: 'GPS' }
  };

  const mockSummary1: PhoneSummary = {
    id: 43,
    name: 'Apple iPhone 15 Pro',
    brand: 'Apple',
    thumbnail: null,
    highlights: ['6.1 inches', '8GB RAM', '3274 mAh']
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    });
    vi.spyOn(brandService, 'getBrands').mockResolvedValue([]);
    vi.spyOn(phoneService, 'getPopular').mockResolvedValue([mockSummary1]);
  });

  it('Flow 1: search from HomePage navigates to SearchResultsPage', async () => {
    vi.spyOn(phoneService, 'search').mockResolvedValue({
      results: [mockSummary1],
      page: 1,
      hasMore: false,
      total: 1
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Discover & Compare/i)).toBeInTheDocument();

    const searchInput = screen.getByRole('combobox');
    fireEvent.change(searchInput, { target: { value: 'iPhone 15' } });
    fireEvent.submit(searchInput.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/Results for/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'Apple iPhone 15 Pro' })).toBeInTheDocument();
    });
  });

  it('Flow 2: SearchResultsPage to PhoneDetailPage displays full technical specifications', async () => {
    vi.spyOn(phoneService, 'getById').mockResolvedValue(mockPhone1);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/phones/43']}>
          <Routes>
            <Route path="/phones/:id" element={<PhoneDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/Apple iPhone 15 Pro/i);
    expect(screen.getAllByText(/Apple A17 Pro/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/3274 mAh/i).length).toBeGreaterThanOrEqual(1);

    // Check specification sections
    expect(screen.getByText('Display')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('Battery and Charging')).toBeInTheDocument();
  });

  it('Flow 3: comparing two phones displays comparison table with differences', async () => {
    const compareResponse: CompareResponse = {
      phones: [mockPhone1, mockPhone2],
      missing: []
    };

    vi.spyOn(phoneService, 'compare').mockResolvedValue(compareResponse);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/compare?ids=43,46']}>
          <Routes>
            <Route path="/compare" element={<ComparePage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Smartphone Comparison')).toBeInTheDocument();
      expect(screen.getAllByText('Apple iPhone 15 Pro').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Samsung Galaxy S24 Ultra').length).toBeGreaterThan(0);
    });

    // Verify comparison features like "Show differences only"
    const diffCheckbox = screen.getByLabelText(/Show differences only/i);
    expect(diffCheckbox).toBeInTheDocument();
  });
});
