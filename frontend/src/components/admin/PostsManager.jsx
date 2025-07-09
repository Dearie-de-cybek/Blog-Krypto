/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar,
  Plus,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import articlesService from '../../services/articlesService';

const PostsManager = ({ setActiveTab, setEditingArticle }) => {
  // State for articles data
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, articleId: null, title: '' });
  const [deleting, setDeleting] = useState(false);

  const categories = ['all', 'Home', 'Education', 'Events', 'Interviews', 'Market Analysis', 'Press Release'];
  const statuses = ['all', 'published', 'draft'];

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all articles (including drafts for admin)
      const response = await articlesService.getArticles({
        limit: 100, // Get more articles for admin view
        status: undefined // Get both published and draft
      });
      
      setArticles(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.tags && article.tags.some(tag => 
                           tag.toLowerCase().includes(searchTerm.toLowerCase())
                         ));
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleNewPost = () => {
    setEditingArticle(null); // Clear any existing editing data
    setActiveTab('create-post');
  };

  const handleEdit = (article) => {
    // Pass the article data to BlogEditor
    setEditingArticle({
      id: article._id,
      data: article
    });
    setActiveTab('create-post');
  };

  const handleView = (article) => {
    if (article.slug) {
      window.open(`/article/${article.slug}`, '_blank');
    } else {
      alert('Article slug not found');
    }
  };

  const handleDeleteClick = (article) => {
    setDeleteModal({
      isOpen: true,
      articleId: article._id,
      title: article.title
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.articleId) return;
    
    try {
      setDeleting(true);
      
      await articlesService.deleteArticle(deleteModal.articleId);
      
      // Remove from local state
      setArticles(prev => prev.filter(article => article._id !== deleteModal.articleId));
      
      // Close modal
      setDeleteModal({ isOpen: false, articleId: null, title: '' });
      
      // Show success message (you might want to add a toast notification here)
      alert('Article deleted successfully!');
      
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Failed to delete article: ' + (err.message || 'Unknown error'));
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, articleId: null, title: '' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Manage Posts</h1>
          <div className="w-24 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full h-10 bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-yellow-400 animate-spin" />
            <span className="ml-3 text-yellow-400 text-lg">Loading articles...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Manage Posts</h1>
          <button 
            onClick={handleNewPost}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </button>
        </div>
        
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Error loading articles</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchArticles}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Posts</h1>
          <p className="text-gray-400 text-sm mt-1">
            {articles.length} total articles • {filteredArticles.length} shown
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchArticles}
            className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={handleNewPost}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Post</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4 lg:p-6 border border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
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
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Post</th>
                <th className="text-left p-4 text-gray-300 font-medium">Category</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Date</th>
                <th className="text-left p-4 text-gray-300 font-medium">Stats</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredArticles.map((article) => (
                <tr key={article._id} className="hover:bg-gray-750 transition-colors">
                  
                  {/* Post Info */}
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      {article.featuredImage && (
                        <img 
                          src={article.featuredImage} 
                          alt={article.title}
                          className="w-12 h-8 object-cover rounded border border-gray-600"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="max-w-xs">
                        <h3 className="text-white font-medium truncate">{article.title}</h3>
                        {article.subtitle && (
                          <p className="text-gray-400 text-xs truncate mt-1">{article.subtitle}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4">
                    <span className="text-gray-300 text-sm">{article.category}</span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(article.status)}`}>
                        {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                      </span>
                      {article.isFeatured && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="p-4">
                    <div className="text-gray-400 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(article.publishDate || article.createdAt)}</span>
                      </div>
                      {article.updatedAt && article.updatedAt !== article.createdAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          Updated {formatDate(article.updatedAt)}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Stats */}
                  <td className="p-4">
                    <div className="text-sm text-gray-400">
                      <div>{article.views || 0} views</div>
                      <div>{article.likes || 0} likes</div>
                      {article.dislikes > 0 && (
                        <div>{article.dislikes} dislikes</div>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {article.status === 'published' && (
                        <button
                          onClick={() => handleView(article)}
                          className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                          title="View Published Article"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(article)}
                        className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/20 rounded transition-colors"
                        title="Edit Article"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(article)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                        title="Delete Article"
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

        {/* Mobile Card View */}
        <div className="lg:hidden">
          <div className="p-4 space-y-4">
            {filteredArticles.map((article) => (
              <div key={article._id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                {/* Article Header */}
                <div className="flex items-start space-x-3 mb-3">
                  {article.featuredImage && (
                    <img 
                      src={article.featuredImage} 
                      alt={article.title}
                      className="w-16 h-12 object-cover rounded border border-gray-600 flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm line-clamp-2 mb-1">{article.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-gray-400">{article.category}</span>
                      <span className={`px-2 py-1 rounded-full font-medium border ${getStatusColor(article.status)}`}>
                        {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                      </span>
                      {article.isFeatured && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats and Date */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <div className="flex items-center space-x-4">
                    <span>{article.views || 0} views</span>
                    <span>{article.likes || 0} likes</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(article.publishDate || article.createdAt)}</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-700">
                  {article.status === 'published' && (
                    <button
                      onClick={() => handleView(article)}
                      className="flex items-center space-x-1 px-3 py-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors text-xs"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(article)}
                    className="flex items-center space-x-1 px-3 py-2 text-yellow-400 hover:bg-yellow-500/20 rounded transition-colors text-xs"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(article)}
                    className="flex items-center space-x-1 px-3 py-2 text-red-400 hover:bg-red-500/20 rounded transition-colors text-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {articles.length === 0 ? (
                <>
                  <h3 className="text-lg font-medium mb-2">No articles yet</h3>
                  <p>Create your first article to get started</p>
                </>
              ) : (
                <p>No articles found matching your criteria.</p>
              )}
            </div>
            {articles.length === 0 && (
              <button 
                onClick={handleNewPost}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Article</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Delete Article</h3>
                <p className="text-gray-400 text-sm">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "<span className="font-medium">{deleteModal.title}</span>"?
            </p>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsManager;