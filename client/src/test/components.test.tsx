import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PhoneCard } from '../components/phone/PhoneCard';
import { SpecSection } from '../components/phone/SpecSection';
import { ComparisonRow } from '../components/compare/ComparisonRow';
import { PhoneSummary, Phone } from '../types';

describe('Client Components', () => {
  it('renders PhoneCard with name, brand, highlights, and buttons', () => {
    const summary: PhoneSummary = {
      id: 43,
      name: 'iPhone 15 Pro',
      brand: 'Apple',
      thumbnail: null,
      highlights: ['6.1" OLED 120Hz', 'Apple A17 Pro', '48 MP Camera']
    };

    render(
      <MemoryRouter>
        <PhoneCard phone={summary} />
      </MemoryRouter>
    );

    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('6.1" OLED 120Hz')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /comparison/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view specs/i })).toBeInTheDocument();
  });

  it('renders SpecSection and handles missing values with "Not available"', () => {
    const items = [
      { label: 'Screen Size', value: '6.7 inches' },
      { label: 'Protection', value: null }, // Missing
      { label: 'Refresh Rate', value: '' } // Empty string
    ];

    render(<SpecSection title="Display" items={items} />);

    expect(screen.getByText('Display')).toBeInTheDocument();
    expect(screen.getByText('Screen Size')).toBeInTheDocument();
    expect(screen.getByText('6.7 inches')).toBeInTheDocument();

    const notAvailableElements = screen.getAllByText('Not available');
    expect(notAvailableElements.length).toBe(2);
  });

  it('renders ComparisonRow with th scope="row" and difference badge', () => {
    const phones: Phone[] = [
      {
        id: 1,
        name: 'Phone A',
        brand: 'Apple',
        image: null,
        releaseDate: null,
        dimensions: null,
        weight: null,
        display: null,
        processor: null,
        memory: null,
        storage: null,
        rearCamera: null,
        frontCamera: null,
        battery: null,
        charging: null,
        operatingSystem: null,
        network: null,
        connectivity: null
      },
      {
        id: 2,
        name: 'Phone B',
        brand: 'Samsung',
        image: null,
        releaseDate: null,
        dimensions: null,
        weight: null,
        display: null,
        processor: null,
        memory: null,
        storage: null,
        rearCamera: null,
        frontCamera: null,
        battery: null,
        charging: null,
        operatingSystem: null,
        network: null,
        connectivity: null
      }
    ];

    const rowItem = {
      key: 'brand',
      label: 'Brand',
      category: 'General',
      values: { 1: 'Apple', 2: 'Samsung' },
      isDifferent: true
    };

    render(
      <table>
        <tbody>
          <ComparisonRow row={rowItem} phones={phones} showDifferencesOnly={false} />
        </tbody>
      </table>
    );

    const th = screen.getByRole('rowheader');
    expect(th).toHaveTextContent('Brand');
    expect(screen.getByText('Different')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Samsung')).toBeInTheDocument();
  });
});
