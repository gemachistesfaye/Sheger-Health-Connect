import { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  requireAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async refreshTokens(): Promise<boolean> {
    try {
      const refreshRes = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: 'GET',
        credentials: 'include',
      });
      return refreshRes.ok;
    } catch {
      return false;
    }
  }

  async request<T = ApiResponse>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      body,
      headers: customHeaders = {},
      signal,
      requireAuth = true,
    } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const config: RequestInit = {
      method,
      headers,
      signal,
      credentials: 'include',
    };

    if (body && method !== 'GET') {
      if (body instanceof FormData) {
        delete headers['Content-Type'];
        config.body = body;
      } else {
        config.body = JSON.stringify(body);
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (response.status === 401) {
      const noRedirectEndpoints = [
        '/api/auth/me',
        '/api/v1/auth/me',
        '/api/auth/refresh',
        '/api/v1/auth/refresh',
        '/api/auth/login',
        '/api/v1/auth/login',
      ];
      const isAuthProbe = noRedirectEndpoints.some((ep) => endpoint.startsWith(ep));

      if (!isAuthProbe) {
        // Use a single refresh promise to avoid multiple concurrent refreshes
        if (!this.refreshPromise) {
          this.refreshPromise = this.refreshTokens();
        }

        try {
          const refreshed = await this.refreshPromise;
          this.refreshPromise = null;

          if (refreshed) {
            return await this.request<T>(endpoint, options);
          }
        } catch {
          this.refreshPromise = null;
        }

        window.location.href = '/login';
      }

      throw new Error('Unauthorized');
    }

    const data: T = await response.json();

    if (!response.ok) {
      const message = (data as ApiResponse).message || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return data;
  }

  get<T = ApiResponse>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = ApiResponse>(endpoint: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T = ApiResponse>(endpoint: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T = ApiResponse>(endpoint: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T = ApiResponse>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
export default api;
