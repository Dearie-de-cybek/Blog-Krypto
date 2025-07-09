import React from 'react';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  TrendingUp,
  LogOut
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'create-post', name: 'Create Post', icon: Plus },
    { id: 'manage-posts', name: 'Manage Posts', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-gray-900 h-screen fixed left-0 top-0 z-40 border-r border-gray-800">
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
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-4 right-4">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;