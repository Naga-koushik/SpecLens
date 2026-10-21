import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { PhoneCard } from '../components/phone/PhoneCard';
import { PhoneSummary } from '../types';

describe('useFavorites Hook & Favorites Functionality', () => {
  const samplePhone: PhoneSummary = {
    id: 101,
    name: 'Super Phone X',
    brand: 'SuperBrand',
    thumbnail: null,
    highlights: ['12 GB RAM', '5000 mAh']
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty favorites and toggles phone in and out of favorites', () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual([]);
    expect(result.current.favoritesCount).toBe(0);
    expect(result.current.isFavorite(101)).toBe(false);

    // Add favorite
    act(() => {
      result.current.toggleFavorite(samplePhone);
    });

    expect(result.current.favorites.length).toBe(1);
    expect(result.current.favorites[0].id).toBe(101);
    expect(result.current.favoritesCount).toBe(1);
    expect(result.current.isFavorite(101)).toBe(true);

    // Toggle off
    act(() => {
      result.current.toggleFavorite(samplePhone);
    });

    expect(result.current.favorites.length).toBe(0);
    expect(result.current.favoritesCount).toBe(0);
    expect(result.current.isFavorite(101)).toBe(false);
  });

  it('persists favorites in localStorage and survives reload', () => {
    const { result, unmount } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite(samplePhone);
    });

    unmount();

    // Re-mount hook
    const { result: reloaded } = renderHook(() => useFavorites());
    expect(reloaded.current.favorites.length).toBe(1);
    expect(reloaded.current.favorites[0].name).toBe('Super Phone X');
  });

  it('clears all favorites when clearFavorites is called', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite(samplePhone);
      result.current.addFavorite({
        id: 102,
        name: 'Another Phone',
        brand: 'OtherBrand',
        thumbnail: null,
        highlights: []
      });
    });

    expect(result.current.favoritesCount).toBe(2);

    act(() => {
      result.current.clearFavorites();
    });

    expect(result.current.favoritesCount).toBe(0);
    expect(result.current.favorites).toEqual([]);
  });

  it('renders favorite button on PhoneCard and toggles status on click', () => {
    render(
      <MemoryRouter>
        <PhoneCard phone={samplePhone} />
      </MemoryRouter>
    );

    const favButton = screen.getByRole('button', { name: /Add Super Phone X to favorites/i });
    expect(favButton).toBeInTheDocument();

    fireEvent.click(favButton);

    expect(
      screen.getByRole('button', { name: /Remove Super Phone X from favorites/i })
    ).toBeInTheDocument();
  });
});
