import { ErrorCode, ApiErrorResponse } from '../types';

export class ApiError extends Error {
  public code: ErrorCode;
  public status: number;

  constructor(code: ErrorCode, message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const TIMEOUT_MS = 10000;

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData: ApiErrorResponse | null = null;
      try {
        errorData = await response.json();
      } catch {
        // Fallback if not json
      }

      const code: ErrorCode = errorData?.error?.code || (response.status === 404 ? 'NOT_FOUND' : response.status === 429 ? 'RATE_LIMITED' : 'INTERNAL_ERROR');
      const message = errorData?.error?.message || `Request failed with status ${response.status}`;

      throw new ApiError(code, message, response.status);
    }

    return (await response.json()) as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) throw err;
    if (err && typeof err === 'object' && 'name' in err && err.name === 'AbortError') {
      throw new ApiError('UPSTREAM_TIMEOUT', 'Request timed out after 10 seconds', 504);
    }
    const message = err instanceof Error ? err.message : 'Network connection failed';
    throw new ApiError('UPSTREAM_UNAVAILABLE', message, 502);
  }
}
