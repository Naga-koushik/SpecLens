import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ComparisonTable } from '../components/compare/ComparisonTable';
import { MobileComparisonSwipe } from '../components/compare/MobileComparisonSwipe';
import { Phone } from '../types';
import { buildComparisonRows, COMPARISON_CATEGORIES } from '../utils/comparison';

describe('Mobile Comparison Swipe & View Mode', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  const samplePhones: Phone[] = [
    {
      id: 1,
      name: 'Phone One',
      brand: 'BrandA',
      image: null,
      releaseDate: '2023',
      dimensions: '150 x 70 x 8 mm',
      weight: '180 g',
      display: { size: '6.1 inches', resolution: '1080p', type: 'OLED', refreshRate: '120Hz', protection: null },
      processor: { chipset: 'Chip A', cpu: 'Octa', gpu: 'Gpu A' },
      memory: { ramOptions: '8GB', cardSlot: 'No' },
      storage: { storageOptions: '128GB' },
      rearCamera: { modules: '50MP', features: null, video: null },
      frontCamera: { modules: '12MP', features: null, video: null },
      battery: { capacity: '5000 mAh', type: 'Li-Ion' },
      charging: '30W',
      operatingSystem: 'OS 1',
      network: { technologies: '5G', simType: 'Nano' },
      connectivity: { wifi: 'Wi-Fi 6', bluetooth: '5.3', nfc: 'Yes', usb: 'Type-C', positioning: 'GPS' }
    },
    {
      id: 2,
      name: 'Phone Two',
      brand: 'BrandB',
      image: null,
      releaseDate: '2024',
      dimensions: '160 x 75 x 8 mm',
      weight: '195 g',
      display: { size: '6.7 inches', resolution: '1440p', type: 'AMOLED', refreshRate: '120Hz', protection: null },
      processor: { chipset: 'Chip B', cpu: 'Octa', gpu: 'Gpu B' },
      memory: { ramOptions: '12GB', cardSlot: 'No' },
      storage: { storageOptions: '256GB' },
      rearCamera: { modules: '108MP', features: null, video: null },
      frontCamera: { modules: '32MP', features: null, video: null },
      battery: { capacity: '4500 mAh', type: 'Li-Ion' },
      charging: '65W',
      operatingSystem: 'OS 2',
      network: { technologies: '5G', simType: 'Nano' },
      connectivity: { wifi: 'Wi-Fi 7', bluetooth: '5.4', nfc: 'Yes', usb: 'Type-C', positioning: 'GPS' }
    }
  ];

  it('renders MobileComparisonSwipe and navigates between devices with Next and Prev buttons', () => {
    const rows = buildComparisonRows(samplePhones);
    const groupedRows: Record<string, typeof rows> = {};
    for (const cat of COMPARISON_CATEGORIES) {
      groupedRows[cat] = rows.filter((r) => r.category === cat);
    }

    render(
      <MemoryRouter>
        <MobileComparisonSwipe
          phones={samplePhones}
          rows={rows}
          groupedRows={groupedRows}
          onRemovePhone={vi.fn()}
          onAddPhone={vi.fn()}
          onOpenAddModal={vi.fn()}
          showDifferencesOnly={false}
        />
      </MemoryRouter>
    );

    // Initial state: Phone One active
    expect(screen.getByText(/Device 1 of 2/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Phone One' })).toBeInTheDocument();

    // Click Next
    const nextBtn = screen.getByRole('button', { name: /Next smartphone/i });
    fireEvent.click(nextBtn);

    // Now Phone Two is active
    expect(screen.getByText(/Device 2 of 2/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Phone Two' })).toBeInTheDocument();

    // Click Prev
    const prevBtn = screen.getByRole('button', { name: /Previous smartphone/i });
    fireEvent.click(prevBtn);

    // Back to Phone One
    expect(screen.getByText(/Device 1 of 2/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Phone One' })).toBeInTheDocument();
  });

  it('toggles mobile view mode between Swipe Cards and Wide Table in ComparisonTable', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ComparisonTable
            phones={samplePhones}
            onRemovePhone={vi.fn()}
            onAddPhone={vi.fn()}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const swipeModeBtn = screen.getByRole('button', { name: /Swipe Cards/i });
    const tableModeBtn = screen.getByRole('button', { name: /Wide Table/i });

    expect(swipeModeBtn).toBeInTheDocument();
    expect(tableModeBtn).toBeInTheDocument();
    expect(swipeModeBtn).toHaveAttribute('aria-pressed', 'true');
    expect(tableModeBtn).toHaveAttribute('aria-pressed', 'false');

    // Switch to wide table
    fireEvent.click(tableModeBtn);
    expect(tableModeBtn).toHaveAttribute('aria-pressed', 'true');
    expect(swipeModeBtn).toHaveAttribute('aria-pressed', 'false');
  });
});
