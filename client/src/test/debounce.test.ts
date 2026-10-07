import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce hook', () => {
  it('debounces the value change', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 350), {
      initialProps: { val: 'initial' }
    });

    expect(result.current).toBe('initial');

    // Update prop immediately
    rerender({ val: 'updated' });
    expect(result.current).toBe('initial');

    // Advance timer by 200ms (less than 350ms)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('initial');

    // Advance remaining 150ms
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('updated');

    vi.useRealTimers();
  });
});
