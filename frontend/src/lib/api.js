const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Removed getToken method since cookies are handled by browser

  async request(endpoint, options = {}) {
    const { 
      method = 'GET',
      body,
      headers: customHeaders = {},
      signal,
      requireAuth = true
    } = options;

    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    // Removed Authorization header injection as we use HttpOnly cookies

    const config = {
      method,
      headers,
      signal,
      credentials: 'include' // Send cookies automatically
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
      // These endpoints should never trigger a redirect — they are auth-probing calls
      const noRedirectEndpoints = ['/api/auth/me', '/api/v1/auth/me', '/api/auth/refresh', '/api/v1/auth/refresh', '/api/auth/login', '/api/v1/auth/login'];
      const isAuthProbe = noRedirectEndpoints.some(ep => endpoint.startsWith(ep));

      if (!isAuthProbe) {
        // For protected API calls, try to refresh the token first
        try {
          const refreshRes = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
            method: 'GET',
            credentials: 'include'
          });
          if (refreshRes.ok) {
            // Retry original request
            return await this.request(endpoint, options);
          }
        } catch (e) {
          // Refresh failed
        }
        // Only redirect if this was a real protected call that failed
        window.location.href = '/login';
      }

      throw new Error('Unauthorized');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
export default api;