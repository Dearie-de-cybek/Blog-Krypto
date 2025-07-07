import API from './api';

const authService = {
  // Admin login
  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
      
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('adminToken', response.data.token);
        
        // Store admin info
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Admin logout
  logout: async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      // Don't throw error on logout
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
    }
  },

  // Get current admin info
  getMe: async () => {
    try {
      const response = await API.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get admin info' };
    }
  },

  // Check if admin is logged in
  isAuthenticated: () => {
    const token = localStorage.getItem('adminToken');
    const adminInfo = localStorage.getItem('adminInfo');
    return !!(token && adminInfo);
  },

  // Get admin info from localStorage
  getAdminInfo: () => {
    const adminInfo = localStorage.getItem('adminInfo');
    return adminInfo ? JSON.parse(adminInfo) : null;
  },

  // Create admin (for initial setup)
  createAdmin: async (adminData) => {
    try {
      const response = await API.post('/auth/create-admin', adminData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create admin' };
    }
  }
};

export default authService;