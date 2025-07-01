import React from 'react';
import { FileText, Eye, Users, TrendingUp, Calendar } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    { title: 'Total Posts', value: '247', change: '+12%', icon: FileText, color: 'blue' },
    { title: 'Total Views', value: '1.2M', change: '+8.5%', icon: Eye, color: 'green' },
    { title: 'Active Users', value: '15.8K', change: '+23%', icon: Users, color: 'purple' },
    { title: 'Revenue', value: '$45.2K', change: '+15%', icon: TrendingUp, color: 'yellow' }
  ];

  const recentPosts = [
    { id: 1, title: 'Bitcoin Reaches New All-Time High', category: 'Market Analysis', status: 'Published', date: '2 hours ago' },
    { id: 2, title: 'Ethereum 2.0 Updates', category: 'Education', status: 'Draft', date: '5 hours ago' },
    { id: 3, title: 'DeFi Protocol Analysis', category: 'Business', status: 'Published', date: '1 day ago' },
    { id: 4, title: 'NFT Market Trends', category: 'Market Analysis', status: 'Published', date: '2 days ago' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[color];
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg border ${getColorClasses(stat.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Posts */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Recent Posts</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">{post.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{post.category}</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    post.status === 'Published' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {post.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;