import React from 'react';
import { useAuth } from '../hooks/useAuth';
import BlogEditor from '../components/admin/BlogEditor';

const AdminDashboard = () => {
  const { admin, logout } = useAuth();

  const handleSave = (savedArticle) => {
    console.log('Article saved:', savedArticle);
    // You can add additional logic here like showing notifications
    // or redirecting to the published article
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Create and manage your blog posts</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-white font-medium">
                Welcome, {admin?.name || 'Admin'}
              </div>
              <div className="text-gray-400 text-sm">
                {admin?.email}
              </div>
            </div>
            
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Blog Editor */}
        <BlogEditor onSave={handleSave} />
      </div>
    </div>
  );
};

export default AdminDashboard;