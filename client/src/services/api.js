import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('manufacture_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Graceful global error handler interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Network error occurred. Make sure the backend server is running.';
    console.error('API Error Response:', message);
    return Promise.reject(message);
  }
);

export default api;
