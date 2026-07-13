const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('token');
  }

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

    if (requireAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config = {
      method,
      headers,
      signal
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
      localStorage.removeItem('token');
      window.location.href = '/login';
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