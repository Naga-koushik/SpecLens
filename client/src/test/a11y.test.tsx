import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { BrandsPage } from '../pages/BrandsPage';
import { brandService } from '../services/brandService';
import { phoneService } from '../services/phoneService';

describe('Accessibility (A11y) Checks on Main Pages', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    });
    vi.spyOn(brandService, 'getBrands').mockResolvedValue([
      { name: 'Apple', slug: 'apple', deviceCount: 3 }
    ]);
    vi.spyOn(phoneService, 'getPopular').mockResolvedValue([]);
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('HomePage has no accessibility violations', async () => {
    const { container } = renderWithProviders(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('AboutPage has no accessibility violations', async () => {
    const { container } = renderWithProviders(<AboutPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('FavoritesPage has no accessibility violations', async () => {
    const { container } = renderWithProviders(<FavoritesPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('BrandsPage has no accessibility violations', async () => {
    const { container } = renderWithProviders(<BrandsPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
