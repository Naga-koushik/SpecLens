import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchBar } from '../components/search/SearchBar';
import { phoneService } from '../services/phoneService';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate
  };
});

describe('SearchBar Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderSearchBar = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SearchBar {...props} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('renders input with placeholder and search icon', () => {
    renderSearchBar({ placeholder: 'Search devices...' });
    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search devices...');
  });

  it('navigates to /search?q= when form is submitted with Enter key or submit event', () => {
    renderSearchBar();
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'Pixel 8' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockedNavigate).toHaveBeenCalledWith('/search?q=Pixel%208');
  });

  it('makes a single debounced autocomplete request when user types', async () => {
    const autocompleteSpy = vi.spyOn(phoneService, 'autocomplete').mockResolvedValue([
      { id: 49, name: 'Pixel 8 Pro', brand: 'Google', thumbnail: null }
    ]);

    renderSearchBar();
    const input = screen.getByRole('combobox');

    // Type rapidly
    fireEvent.change(input, { target: { value: 'P' } });
    fireEvent.change(input, { target: { value: 'Pi' } });
    fireEvent.change(input, { target: { value: 'Pix' } });

    // Wait for debounced call
    await waitFor(() => {
      expect(autocompleteSpy).toHaveBeenCalledTimes(1);
      expect(autocompleteSpy).toHaveBeenCalledWith('Pix', 5);
    });

    // Suggestions list should open
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Pixel 8 Pro')).toBeInTheDocument();
  });

  it('handles arrow keys, Enter to select, and Escape to close suggestions', async () => {
    vi.spyOn(phoneService, 'autocomplete').mockResolvedValue([
      { id: 43, name: 'iPhone 15 Pro', brand: 'Apple', thumbnail: null },
      { id: 44, name: 'iPhone 15', brand: 'Apple', thumbnail: null }
    ]);

    renderSearchBar();
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'iPhone' } });

    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);

    // ArrowDown moves active to option 0
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    // ArrowDown moves active to option 1
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(options[1]).toHaveAttribute('aria-selected', 'true');

    // ArrowUp moves active back to option 0
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    // Escape closes suggestions
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    // Reopen by focusing with query
    fireEvent.focus(input);
    expect(await screen.findByRole('listbox')).toBeInTheDocument();

    // ArrowDown to first option and Enter selects and navigates
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockedNavigate).toHaveBeenCalledWith('/phones/43');
  });

  it('handles empty query and does not open suggestions list for query under 2 characters', async () => {
    const autocompleteSpy = vi.spyOn(phoneService, 'autocomplete');

    renderSearchBar();
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'A' } });

    await new Promise((r) => setTimeout(r, 400));

    expect(autocompleteSpy).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('handles autocomplete error gracefully without breaking the input', async () => {
    vi.spyOn(phoneService, 'autocomplete').mockRejectedValue(new Error('Network error'));

    renderSearchBar();
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'Galaxy' } });

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    // Submitting still works
    fireEvent.submit(input.closest('form')!);
    expect(mockedNavigate).toHaveBeenCalledWith('/search?q=Galaxy');
  });
});
