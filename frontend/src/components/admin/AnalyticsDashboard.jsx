/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  FileText, 
  Users, 
  Calendar,
  BarChart3,
  PieChart,
  Clock,
  Star,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import articlesService from '../../services/articlesService';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    overview: {},
    topArticles: [],
    categoryStats: [],
    recentActivity: [],
    engagementMetrics: {},
    timeStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all articles for analytics calculation
      const response = await articlesService.getArticles({
        limit: 200, // Get more articles for better analytics
        status: undefined // Get both published and draft
      });

      const articles = response.data || [];
      
      // Calculate analytics
      const calculatedAnalytics = calculateAnalytics(articles);
      setAnalytics(calculatedAnalytics);

    } catch (err) {
      setError(err.message || 'Failed to fetch analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (articles) => {
    const now = new Date();
    const periodDays = selectedPeriod === '7days' ? 7 : selectedPeriod === '30days' ? 30 : 90;
    const periodStart = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));

    // Filter articles by period
    const periodArticles = articles.filter(article => 
      new Date(article.createdAt) >= periodStart
    );

    // Overview metrics
    const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
    const totalLikes = articles.reduce((sum, article) => sum + (article.likes || 0), 0);
    const totalDislikes = articles.reduce((sum, article) => sum + (article.dislikes || 0), 0);
    const publishedCount = articles.filter(a => a.status === 'published').length;
    const draftCount = articles.filter(a => a.status === 'draft').length;
    const featuredCount = articles.filter(a => a.isFeatured).length;

    // Previous period for comparison
    const prevPeriodStart = new Date(periodStart.getTime() - (periodDays * 24 * 60 * 60 * 1000));
    const prevPeriodArticles = articles.filter(article => {
      const date = new Date(article.createdAt);
      return date >= prevPeriodStart && date < periodStart;
    });

    // Calculate growth
    const currentPeriodViews = periodArticles.reduce((sum, a) => sum + (a.views || 0), 0);
    const prevPeriodViews = prevPeriodArticles.reduce((sum, a) => sum + (a.views || 0), 0);
    const viewsGrowth = prevPeriodViews > 0 ? ((currentPeriodViews - prevPeriodViews) / prevPeriodViews * 100) : 100;

    // Top performing articles
    const topArticles = [...articles]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10)
      .map(article => ({
        id: article._id,
        title: article.title,
        category: article.category,
        views: article.views || 0,
        likes: article.likes || 0,
        dislikes: article.dislikes || 0,
        publishDate: article.publishDate || article.createdAt,
        slug: article.slug,
        engagementRate: calculateEngagementRate(article.views, article.likes, article.dislikes)
      }));

    // Category performance
    const categoryStats = calculateCategoryStats(articles);

    // Recent activity
    const recentActivity = [...articles]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(article => ({
        id: article._id,
        title: article.title,
        action: article.status === 'published' ? 'published' : 'drafted',
        date: article.createdAt,
        category: article.category
      }));

    // Time-based stats
    const timeStats = calculateTimeStats(articles, periodDays);

    return {
      overview: {
        totalViews,
        totalLikes,
        totalDislikes,
        publishedCount,
        draftCount,
        featuredCount,
        totalArticles: articles.length,
        viewsGrowth,
        articlesThisPeriod: periodArticles.length,
        avgViewsPerArticle: publishedCount > 0 ? Math.round(totalViews / publishedCount) : 0,
        engagementRate: totalViews > 0 ? ((totalLikes + totalDislikes) / totalViews * 100).toFixed(2) : 0
      },
      topArticles,
      categoryStats,
      recentActivity,
      engagementMetrics: {
        likeRatio: totalLikes + totalDislikes > 0 ? (totalLikes / (totalLikes + totalDislikes) * 100).toFixed(1) : 0,
        avgLikesPerArticle: publishedCount > 0 ? Math.round(totalLikes / publishedCount) : 0,
        mostEngagingCategory: categoryStats.length > 0 ? categoryStats[0].category : 'N/A'
      },
      timeStats
    };
  };

  const calculateEngagementRate = (views, likes, dislikes) => {
    if (views === 0) return 0;
    return ((likes + dislikes) / views * 100).toFixed(1);
  };

  const calculateCategoryStats = (articles) => {
    const categoryMap = {};
    
    articles.forEach(article => {
      if (!categoryMap[article.category]) {
        categoryMap[article.category] = {
          category: article.category,
          count: 0,
          totalViews: 0,
          totalLikes: 0,
          avgViews: 0,
          articles: []
        };
      }
      
      categoryMap[article.category].count += 1;
      categoryMap[article.category].totalViews += article.views || 0;
      categoryMap[article.category].totalLikes += article.likes || 0;
      categoryMap[article.category].articles.push(article);
    });

    return Object.values(categoryMap)
      .map(cat => ({
        ...cat,
        avgViews: cat.count > 0 ? Math.round(cat.totalViews / cat.count) : 0,
        engagementRate: calculateEngagementRate(cat.totalViews, cat.totalLikes, 0)
      }))
      .sort((a, b) => b.totalViews - a.totalViews);
  };

  const calculateTimeStats = (articles, days) => {
    const dailyStats = {};
    const now = new Date();
    
    // Initialize daily stats
    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toISOString().split('T')[0];
      dailyStats[dateStr] = { articles: 0, views: 0 };
    }

    // Fill with actual data
    articles.forEach(article => {
      const dateStr = new Date(article.createdAt).toISOString().split('T')[0];
      if (dailyStats[dateStr]) {
        dailyStats[dateStr].articles += 1;
        dailyStats[dateStr].views += article.views || 0;
      }
    });

    return dailyStats;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <ArrowUp className="w-4 h-4 text-green-400" />;
    if (growth < 0) return <ArrowDown className="w-4 h-4 text-red-400" />;
    return <span className="w-4 h-4 text-gray-400">-</span>;
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-400';
    if (growth < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <RefreshCw className="w-6 h-6 text-yellow-400 animate-spin" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
              <div className="w-full h-20 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg">
          <h3 className="font-medium">Error loading analytics</h3>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-3 bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Performance insights for KryptoExtract</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center space-x-1">
              {getGrowthIcon(analytics.overview.viewsGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(analytics.overview.viewsGrowth)}`}>
                {Math.abs(analytics.overview.viewsGrowth).toFixed(1)}%
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{formatNumber(analytics.overview.totalViews)}</h3>
          <p className="text-gray-400 text-sm">Total Views</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
              <Heart className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-green-400 text-sm font-medium">
              {analytics.engagementMetrics.likeRatio}% positive
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{formatNumber(analytics.overview.totalLikes)}</h3>
          <p className="text-gray-400 text-sm">Total Likes</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-purple-400 text-sm font-medium">
              +{analytics.overview.articlesThisPeriod} this period
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{analytics.overview.publishedCount}</h3>
          <p className="text-gray-400 text-sm">Published Articles</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-yellow-400 text-sm font-medium">
              {analytics.overview.engagementRate}% rate
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{formatNumber(analytics.overview.avgViewsPerArticle)}</h3>
          <p className="text-gray-400 text-sm">Avg Views/Article</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performing Articles */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
              Top Performing Articles
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.topArticles.slice(0, 5).map((article, index) => (
                <div key={article.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-yellow-400 font-bold text-sm">#{index + 1}</span>
                      <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">{article.category}</span>
                    </div>
                    <h3 className="text-white font-medium text-sm truncate">{article.title}</h3>
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                      <span>{formatNumber(article.views)} views</span>
                      <span>{article.likes} likes</span>
                      <span>{article.engagementRate}% engagement</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-yellow-400" />
              Category Performance
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.categoryStats.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{category.category}</span>
                      <span className="text-gray-400 text-sm">{category.count} articles</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.max((category.totalViews / analytics.overview.totalViews) * 100, 5)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                      <span>{formatNumber(category.totalViews)} views</span>
                      <span>{category.avgViews} avg/article</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-400" />
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {analytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-900 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.action === 'published' ? 'bg-green-400' : 'bg-yellow-400'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium text-sm">{activity.title}</span>
                    <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">{activity.category}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {activity.action === 'published' ? 'Published' : 'Saved as draft'} • {new Date(activity.date).toRelativeTimeString?.() || 'Recently'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;