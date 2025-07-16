import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: 'https://blog-krypto.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    // Fixed: Look for 'adminToken' instead of 'token' to match your authService
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - clear both adminToken and adminInfo
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;