import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  PieChart, 
  Plus,
  TrendingUp,
  LogOut,
  Edit3,
  Menu,
  X
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, editingArticle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'create-post', name: 'Create Post', icon: Plus },
    { id: 'manage-posts', name: 'Manage Posts', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: PieChart },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false); // Close mobile menu when tab is selected
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout clicked');
    setIsMobileMenuOpen(false);
  };

  // Sidebar content component (reused for both desktop and mobile)
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center space-x-3 p-6 border-b border-gray-800">
        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-black" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Admin Panel
        </span>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isEditing = editingArticle && item.id === 'create-post';
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium flex-1 text-left">
                {isEditing ? 'Edit Post' : item.name}
              </span>
              {isEditing && (
                <Edit3 className="w-4 h-4 text-blue-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              KryptoExtract
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-40 bg-gray-900 border-r border-gray-800">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;