/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Share2, Bookmark, ArrowLeft, Clock, Heart, ThumbsDown } from 'lucide-react';
import articlesService from '../services/articlesService';

const NewsArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await articlesService.getArticleBySlug(slug);
      const articleData = response.data;
      
      setArticle(articleData);
      setLikes(articleData.likes || 0);
      setDislikes(articleData.dislikes || 0);
      
      // Check if user has previously reacted (from localStorage)
      const savedReaction = localStorage.getItem(`reaction_${articleData._id}`);
      if (savedReaction) {
        setUserReaction(savedReaction);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to load article');
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.subtitle || article.excerpt,
        url: window.location.href,
      }).catch((err) => {
        console.error('Error sharing:', err);
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Article URL copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Article URL copied to clipboard!');
    });
  };

  const handleBookmark = () => {
    if (!article) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const isBookmarked = bookmarks.find(b => b.id === article._id);
    
    if (isBookmarked) {
      const updated = bookmarks.filter(b => b.id !== article._id);
      localStorage.setItem('bookmarks', JSON.stringify(updated));
      alert('Removed from bookmarks');
    } else {
      bookmarks.push({
        id: article._id,
        title: article.title,
        slug: article.slug,
        image: article.featuredImage,
        category: article.category,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      alert('Added to bookmarks');
    }
  };

  const handleLike = async () => {
    if (!article || actionLoading) return;
    
    try {
      setActionLoading(true);
      
      // Optimistic update
      if (userReaction === 'like') {
        // Remove like
        setLikes(prev => prev - 1);
        setUserReaction(null);
        localStorage.removeItem(`reaction_${article._id}`);
      } else if (userReaction === 'dislike') {
        // Switch from dislike to like
        setDislikes(prev => prev - 1);
        setLikes(prev => prev + 1);
        setUserReaction('like');
        localStorage.setItem(`reaction_${article._id}`, 'like');
      } else {
        // Add like
        setLikes(prev => prev + 1);
        setUserReaction('like');
        localStorage.setItem(`reaction_${article._id}`, 'like');
      }

      // Call backend API
      const response = await articlesService.likeArticle(article._id);
      
      // Update with actual server response if available
      if (response.data && response.data.likes !== undefined) {
        setLikes(response.data.likes);
        setDislikes(response.data.dislikes);
      }
      
    } catch (error) {
      console.error('Error liking article:', error);
      // Revert optimistic update on error
      await fetchArticle();
      alert('Failed to update like. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!article || actionLoading) return;
    
    try {
      setActionLoading(true);
      
      // Optimistic update
      if (userReaction === 'dislike') {
        // Remove dislike
        setDislikes(prev => prev - 1);
        setUserReaction(null);
        localStorage.removeItem(`reaction_${article._id}`);
      } else if (userReaction === 'like') {
        // Switch from like to dislike
        setLikes(prev => prev - 1);
        setDislikes(prev => prev + 1);
        setUserReaction('dislike');
        localStorage.setItem(`reaction_${article._id}`, 'dislike');
      } else {
        // Add dislike
        setDislikes(prev => prev + 1);
        setUserReaction('dislike');
        localStorage.setItem(`reaction_${article._id}`, 'dislike');
      }

      // Call backend API
      const response = await articlesService.dislikeArticle(article._id);
      
      // Update with actual server response if available
      if (response.data && response.data.dislikes !== undefined) {
        setLikes(response.data.likes);
        setDislikes(response.data.dislikes);
      }
      
    } catch (error) {
      console.error('Error disliking article:', error);
      // Revert optimistic update on error
      await fetchArticle();
      alert('Failed to update dislike. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const calculateReadTime = (content) => {
    if (!content) return '5 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const shareOnSocial = (platform) => {
    if (!article) return;
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article.title);
    const text = encodeURIComponent(article.subtitle || article.excerpt || '');
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-yellow-400 text-xl font-medium">Loading article...</div>
          <div className="text-gray-400 text-sm mt-2">Please wait while we fetch the content</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-400 text-6xl mb-6">📰</div>
          <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-gray-400 mb-6 leading-relaxed">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go Back Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No article found
  if (!article) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">Article not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black/95 backdrop-blur-sm border-b border-yellow-500/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBookmark}
                className="p-2 hover:bg-yellow-500/10 rounded-lg transition-colors"
                title="Bookmark article"
              >
                <Bookmark className="w-5 h-5 text-gray-300 hover:text-yellow-400" />
              </button>
              <button 
                onClick={handleShare}
                className="p-2 hover:bg-yellow-500/10 rounded-lg transition-colors"
                title="Share article"
              >
                <Share2 className="w-5 h-5 text-gray-300 hover:text-yellow-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Category Badge */}
        <div className="mb-6">
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-full text-sm font-bold">
            {article.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
          {article.title}
        </h1>

        {/* Subtitle */}
        {article.subtitle && (
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            {article.subtitle}
          </p>
        )}

        {/* Author & Meta */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <User className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">Admin</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.publishDate || article.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{calculateReadTime(article.content)}</span>
                </div>
                {article.views && (
                  <div className="flex items-center space-x-1">
                    <span>👁</span>
                    <span>{article.views} views</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img 
              src={article.featuredImage} 
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          {article.content && article.content.split('\n\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="text-gray-300 leading-relaxed mb-6 text-lg">
                {paragraph.trim()}
              </p>
            )
          ))}
        </div>

        {/* Excerpt fallback if no content */}
        {!article.content && article.excerpt && (
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-6 text-lg">
              {article.excerpt}
            </p>
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-gray-400 text-sm font-medium">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs hover:bg-yellow-500/20 hover:text-yellow-400 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Like/Dislike Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-center space-x-8">
            <span className="text-gray-400 text-sm">Did you find this article helpful?</span>
            
            <div className="flex items-center space-x-4">
              {/* Like Button */}
              <button
                onClick={handleLike}
                disabled={actionLoading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  userReaction === 'like'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                }`}
              >
                <Heart 
                  className={`w-5 h-5 transition-all duration-300 ${
                    userReaction === 'like' ? 'fill-current scale-110' : ''
                  }`} 
                />
                <span className="font-medium">{likes}</span>
              </button>

              {/* Dislike Button */}
              <button
                onClick={handleDislike}
                disabled={actionLoading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  userReaction === 'dislike'
                    ? 'bg-gray-600/20 text-gray-300 border border-gray-500/50'
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-600/10 hover:text-gray-300 hover:border-gray-500/30'
                }`}
              >
                <ThumbsDown 
                  className={`w-5 h-5 transition-all duration-300 ${
                    userReaction === 'dislike' ? 'fill-current scale-110' : ''
                  }`} 
                />
                <span className="font-medium">{dislikes}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Social Share */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-center space-x-6">
            <span className="text-gray-400 text-sm">Share this article:</span>
            <div className="flex space-x-4">
              {/* Twitter */}
              <button 
                onClick={() => shareOnSocial('twitter')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
                title="Share on Twitter"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              
              {/* Facebook */}
              <button 
                onClick={() => shareOnSocial('facebook')}
                className="bg-blue-800 hover:bg-blue-900 text-white p-3 rounded-full transition-colors"
                title="Share on Facebook"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              
              {/* WhatsApp */}
              <button 
                onClick={() => shareOnSocial('whatsapp')}
                className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors"
                title="Share on WhatsApp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Article Stats */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <span>📅 Published {formatDate(article.publishDate || article.createdAt)}</span>
            {article.updatedAt && article.updatedAt !== article.createdAt && (
              <span>✏️ Updated {formatDate(article.updatedAt)}</span>
            )}
            {article.views && (
              <span>👁 {article.views} views</span>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsArticlePage;