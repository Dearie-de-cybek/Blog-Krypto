import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar,
  MoreVertical,
  Plus
} from 'lucide-react';

const PostsManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const posts = [
    {
      id: 1,
      title: 'Bitcoin Reaches New All-Time High as Institutional Adoption Accelerates',
      category: 'Market Analysis',
      status: 'Published',
      author: 'Sarah Chen',
      date: '2024-12-15',
      views: 1520,
      likes: 45,
      image: 'https://images.unsplash.com/photo-1518544866330-4e67de92e3e8?w=100&h=60&fit=crop'
    },
    {
      id: 2,
      title: 'Understanding DeFi: A Comprehensive Guide for Beginners',
      category: 'Education',
      status: 'Published',
      author: 'Michael Rodriguez',
      date: '2024-12-14',
      views: 892,
      likes: 23,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=60&fit=crop'
    },
    {
      id: 3,
      title: 'Ethereum 2.0 Staking: Complete Analysis and Future Outlook',
      category: 'Market Analysis',
      status: 'Draft',
      author: 'Emma Thompson',
      date: '2024-12-13',
      views: 0,
      likes: 0,
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=60&fit=crop'
    },
    {
      id: 4,
      title: 'NFT Market Trends and Investment Opportunities',
      category: 'Business',
      status: 'Published',
      author: 'David Kim',
      date: '2024-12-12',
      views: 756,
      likes: 31,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=60&fit=crop'
    },
    {
      id: 5,
      title: 'Central Bank Digital Currencies: Global Implementation Status',
      category: 'Press Release',
      status: 'Scheduled',
      author: 'Lisa Wang',
      date: '2024-12-16',
      views: 0,
      likes: 0,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=60&fit=crop'
    }
  ];

  const categories = ['all', 'Market Analysis', 'Education', 'Business', 'Events', 'Interviews', 'Press Release'];
  const statuses = ['all', 'Published', 'Draft', 'Scheduled'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleEdit = (postId) => {
    console.log('Edit post:', postId);
  };

  const handleDelete = (postId) => {
    console.log('Delete post:', postId);
  };

  const handleView = (postId) => {
    console.log('View post:', postId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Posts</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors font-medium">
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Post</th>
                <th className="text-left p-4 text-gray-300 font-medium">Category</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Author</th>
                <th className="text-left p-4 text-gray-300 font-medium">Date</th>
                <th className="text-left p-4 text-gray-300 font-medium">Stats</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-750 transition-colors">
                  
                  {/* Post Info */}
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-12 h-8 object-cover rounded border border-gray-600"
                      />
                      <div className="max-w-xs">
                        <h3 className="text-white font-medium truncate">{post.title}</h3>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4">
                    <span className="text-gray-300 text-sm">{post.category}</span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </td>

                  {/* Author */}
                  <td className="p-4">
                    <span className="text-gray-300 text-sm">{post.author}</span>
                  </td>

                  {/* Date */}
                  <td className="p-4">
                    <div className="flex items-center space-x-1 text-gray-400 text-sm">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                  </td>

                  {/* Stats */}
                  <td className="p-4">
                    <div className="text-sm text-gray-400">
                      <div>{post.views} views</div>
                      <div>{post.likes} likes</div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(post.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(post.id)}
                        className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/20 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No posts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsManager;