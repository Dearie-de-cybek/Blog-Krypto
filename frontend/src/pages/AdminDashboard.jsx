import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardStats from '../components/admin/DashboardStats';
import BlogEditor from '../components/admin/BlogEditor';
import PostsManager from '../components/admin/PostsManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingArticle, setEditingArticle] = useState(null); 

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats />;
        
      case 'create-post':
        return (
          <BlogEditor 
            articleId={editingArticle?.id || null}
            initialData={editingArticle?.data || null}
            onSave={() => {
              // Clear editing state after save and optionally switch back to manage posts
              setEditingArticle(null);
        
              setActiveTab('manage-posts');
            }}
          />
        );
        
      case 'manage-posts':
        return (
          <PostsManager 
            setActiveTab={setActiveTab}
            setEditingArticle={setEditingArticle}
          />
        );
        
      case 'analytics':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-300">Analytics dashboard coming soon...</p>
            </div>
          </div>
        );
        
      case 'users':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-300">User management features coming soon...</p>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-300">Settings panel coming soon...</p>
            </div>
          </div>
        );
        
      default:
        return <DashboardStats />;
    }
  };

  // Clear editing state when switching tabs (except when going to create-post for editing)
  const handleTabChange = (newTab) => {
    if (newTab !== 'create-post') {
      setEditingArticle(null);
    }
    setActiveTab(newTab);
  };

  return (
    <div className="bg-black min-h-screen">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        editingArticle={editingArticle} // Pass editing state to show indicator
      />
      
      <div className="ml-64 p-8">
        {/* Show editing indicator */}
        {editingArticle && activeTab === 'create-post' && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Editing Article</h3>
                <p className="text-sm mt-1">"{editingArticle.data?.title}"</p>
              </div>
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setActiveTab('manage-posts');
                }}
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Cancel Editing
              </button>
            </div>
          </div>
        )}
        
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;