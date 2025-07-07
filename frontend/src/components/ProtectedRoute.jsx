import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = '/admin/login';
    return null;
  }

  return children;
};

export default ProtectedRoute;
