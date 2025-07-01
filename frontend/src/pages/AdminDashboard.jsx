import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardStats from '../components/admin/DashboardStats';
import BlogEditor from '../components/admin/BlogEditor';
import PostsManager from '../components/admin/PostsManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats />;
      case 'create-post':
        return <BlogEditor />;
      case 'manage-posts':
        return <PostsManager />;
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

  return (
    <div className="bg-black min-h-screen">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="ml-64 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;