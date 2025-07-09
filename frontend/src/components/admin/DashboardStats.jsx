import React, { useState, useEffect } from 'react';
import { FileText, Eye, Users, TrendingUp, Calendar } from 'lucide-react';
import articlesService from '../../services/articlesService';

const DashboardStats = () => {
  const [stats, setStats] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all articles to calculate stats
      const allArticlesResponse = await articlesService.getArticles({
        limit: 100, // Get more articles for better stats calculation
        status: undefined // Get both published and draft articles for admin dashboard
      });

      const articles = allArticlesResponse.data || [];

      // Calculate total posts
      const totalPosts = articles.length;
      const publishedPosts = articles.filter(article => article.status === 'published').length;

      // Calculate total views
      const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);

      // Calculate recent posts (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentPostsCount = articles.filter(article => 
        new Date(article.createdAt) > thirtyDaysAgo
      ).length;

      // Calculate previous period for growth percentage
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      const previousPeriodPosts = articles.filter(article => {
        const createdDate = new Date(article.createdAt);
        return createdDate > sixtyDaysAgo && createdDate <= thirtyDaysAgo;
      }).length;

      // Calculate growth percentage
      const postsGrowth = previousPeriodPosts > 0 
        ? ((recentPostsCount - previousPeriodPosts) / previousPeriodPosts * 100).toFixed(1)
        : recentPostsCount > 0 ? 100 : 0;

      // Format views count
      const formatViews = (count) => {
        if (count >= 1000000) {
          return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
          return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
      };

      // Create stats array
      const calculatedStats = [
        { 
          title: 'Total Posts', 
          value: totalPosts.toString(), 
          change: `+${postsGrowth}%`, 
          icon: FileText, 
          color: 'blue' 
        },
        { 
          title: 'Total Views', 
          value: formatViews(totalViews), 
          change: '+8.5%', 
          icon: Eye, 
          color: 'green' 
        },
        { 
          title: 'Published', 
          value: publishedPosts.toString(), 
          change: `${Math.round((publishedPosts / totalPosts) * 100)}%`, 
          icon: TrendingUp, 
          color: 'purple' 
        },
        { 
          title: 'Draft Posts', 
          value: (totalPosts - publishedPosts).toString(), 
          change: `${Math.round(((totalPosts - publishedPosts) / totalPosts) * 100)}%`, 
          icon: FileText, 
          color: 'yellow' 
        }
      ];

      setStats(calculatedStats);

      // Get recent posts (last 10)
      const sortedPosts = articles
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(post => ({
          id: post._id,
          title: post.title,
          category: post.category,
          status: post.status === 'published' ? 'Published' : 'Draft',
          date: formatRelativeTime(post.createdAt),
          views: post.views || 0,
          slug: post.slug
        }));

      setRecentPosts(sortedPosts);

    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) {
        return 'Just now';
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
    } catch (error) {
      return 'Unknown';
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[color];
  };

  const handlePostClick = (post) => {
    if (post.slug) {
      window.open(`/article/${post.slug}`, '_blank');
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                <div className="w-12 h-4 bg-gray-700 rounded"></div>
              </div>
              <div className="w-16 h-8 bg-gray-700 rounded mb-2"></div>
              <div className="w-24 h-4 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="w-32 h-6 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg animate-pulse">
                <div className="flex-1">
                  <div className="w-48 h-5 bg-gray-700 rounded mb-2"></div>
                  <div className="w-32 h-4 bg-gray-700 rounded"></div>
                </div>
                <div className="w-20 h-6 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Error loading dashboard data</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={refreshData}
              className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <button
          onClick={refreshData}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Posts</h2>
            <span className="text-gray-400 text-sm">{recentPosts.length} posts</span>
          </div>
        </div>
        <div className="p-6">
          {recentPosts.length > 0 ? (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="flex items-center justify-between p-4 bg-gray-900 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1 hover:text-yellow-400 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{post.category}</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </span>
                      {post.views > 0 && (
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views} views</span>
                        </span>
                      )}
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
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-gray-400 font-medium mb-2">No posts yet</h3>
              <p className="text-gray-500 text-sm">Create your first article to see it here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;