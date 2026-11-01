import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopsphere_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for handling auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected route, clean up expired token
      if (window.location.pathname.startsWith('/checkout') || window.location.pathname.startsWith('/orders') || window.location.pathname.startsWith('/account')) {
        localStorage.removeItem('shopsphere_auth_token');
        localStorage.removeItem('shopsphere_user');
      }
    }
    return Promise.reject(error);
  }
);
