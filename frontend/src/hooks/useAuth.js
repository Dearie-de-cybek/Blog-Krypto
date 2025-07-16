import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Get admin info from localStorage first (faster)
          const adminInfo = authService.getAdminInfo();
          setAdmin(adminInfo);
          setIsAuthenticated(true);
          
          // Optionally verify with server (uncomment if needed)
          // const response = await authService.getMe();
          // setAdmin(response.data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid auth data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        setAdmin(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      
      if (response.success) {
        setAdmin(response.admin);
        setIsAuthenticated(true);
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      setAdmin(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      setIsAuthenticated(false);
      
      // Redirect to login
      window.location.href = '/admin/login';
    }
  };

  return {
    admin,
    isAuthenticated,
    loading,
    login,
    logout
  };
};