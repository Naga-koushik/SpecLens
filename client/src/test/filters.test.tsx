import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { FilterSortBar } from '../components/phone/FilterSortBar';
import { PhoneSummary } from '../types';

describe('FilterSortBar Component', () => {
  const samplePhones: PhoneSummary[] = [
    {
      id: 1,
      name: 'Zeta Phone',
      brand: 'AlphaBrand',
      thumbnail: null,
      highlights: ['8 GB RAM', '5000 mAh'],
      releaseDate: '2023-01-15',
      ram: '8GB'
    },
    {
      id: 2,
      name: 'Alpha Phone',
      brand: 'BetaBrand',
      thumbnail: null,
      highlights: ['16 GB RAM', '4500 mAh'],
      releaseDate: '2024-05-20',
      ram: '16GB'
    },
    {
      id: 3,
      name: 'Gamma Phone',
      brand: 'AlphaBrand',
      thumbnail: null,
      highlights: ['6 GB RAM', '4000 mAh'],
      releaseDate: '2022-10-10',
      ram: '6GB'
    }
  ];

  it('renders sort and filter controls and states that filters apply to loaded results', () => {
    const handleFiltered = vi.fn();
    render(
      <MemoryRouter>
        <FilterSortBar phones={samplePhones} onFilteredChange={handleFiltered} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Sort:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Brand:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Min RAM:/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Filters apply to loaded results on this page/i)
    ).toBeInTheDocument();
  });

  it('filters phones by brand and min RAM', () => {
    let currentFiltered: PhoneSummary[] = [];
    const handleFiltered = vi.fn((res) => {
      currentFiltered = res;
    });

    render(
      <MemoryRouter initialEntries={['/?brand=AlphaBrand&minRam=8']}>
        <FilterSortBar phones={samplePhones} onFilteredChange={handleFiltered} />
      </MemoryRouter>
    );

    // Only Zeta Phone is AlphaBrand AND has 8GB+ RAM
    expect(currentFiltered.length).toBe(1);
    expect(currentFiltered[0].name).toBe('Zeta Phone');
  });

  it('sorts phones alphabetically when sort=name', () => {
    let currentFiltered: PhoneSummary[] = [];
    const handleFiltered = vi.fn((res) => {
      currentFiltered = res;
    });

    render(
      <MemoryRouter initialEntries={['/?sort=name']}>
        <FilterSortBar phones={samplePhones} onFilteredChange={handleFiltered} />
      </MemoryRouter>
    );

    expect(currentFiltered[0].name).toBe('Alpha Phone');
    expect(currentFiltered[1].name).toBe('Gamma Phone');
    expect(currentFiltered[2].name).toBe('Zeta Phone');
  });
});
