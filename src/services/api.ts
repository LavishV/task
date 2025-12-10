import axios from 'axios';

// Use relative path /api in production (Render), localhost for development
const API_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : '/api'
);

// Helper to extract meaningful error messages
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Server returned an error response
    if (error.response?.data?.error) return error.response.data.error;
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data?.errors?.[0]) return error.response.data.errors[0];

    // HTTP status codes with friendly messages
    switch (error.response?.status) {
      case 400:
        return 'Invalid input. Please check your data.';
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'Access denied. You do not have permission.';
      case 409:
        return 'This account already exists.';
      case 423:
        return 'Account locked due to too many failed attempts. Try again later.';
      case 429:
        return 'Too many requests. Please wait a moment before trying again.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return error.response?.data?.message || `Error: ${error.response?.status || 'Unknown'}`;
    }
  }

  // Network errors
  if (error instanceof Error) {
    if (error.message.includes('timeout')) return 'Request timeout. Check your connection.';
    if (error.message.includes('Network')) return 'Network error. Check your internet connection.';
    return error.message;
  }

  return 'An unknown error occurred. Please try again.';
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Request interceptor: Add access token to all requests
api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor: Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearTokens();
          // Don't redirect if already on login/signup pages
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/admin/login') && !currentPath.includes('/admin/signup')) {
            window.location.href = '/admin/login';
          }
          return Promise.reject(error);
        }

        // Call refresh endpoint
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update tokens
        setTokens(accessToken, newRefreshToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        clearTokens();
        // Don't redirect if already on login/signup pages
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/admin/login') && !currentPath.includes('/admin/signup')) {
          window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((res) => {
      setTokens(res.data.accessToken, res.data.refreshToken);
      return res.data;
    }),
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }).then((res) => {
      return res.data;
    }),
  logout: async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } finally {
      clearTokens();
    }
  },
  me: () => api.get('/auth/me'),
  revokeAllSessions: () => api.post('/auth/revoke-all-sessions'),
};

export const projectAPI = {
  getAll: () => api.get('/projects'),
  create: (formData: FormData) =>
    api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, formData: FormData) =>
    api.put(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const clientAPI = {
  getAll: () => api.get('/clients'),
  create: (formData: FormData) =>
    api.post('/clients', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, formData: FormData) =>
    api.put(`/clients/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/clients/${id}`),
};

export const contactAPI = {
  getAll: () => api.get('/contact'),
  create: (data: { fullName: string; email: string; mobileNumber: string; city: string }) =>
    api.post('/contact', data),
  delete: (id: string) => api.delete(`/contact/${id}`),
};

export const newsletterAPI = {
  getAll: () => api.get('/newsletter'),
  subscribe: (email: string) => api.post('/newsletter', { email }),
  delete: (id: string) => api.delete(`/newsletter/${id}`),
};

export default api;
