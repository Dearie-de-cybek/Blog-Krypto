import React, { useState } from 'react';
import { Calendar, User, Share2, Bookmark, ArrowLeft, Clock, Heart, ThumbsDown } from 'lucide-react';

const NewsArticlePage = ({ 
  article = {
    title: "Bitcoin Reaches New All-Time High as Institutional Adoption Accelerates",
    subtitle: "Major corporations and financial institutions continue to embrace cryptocurrency, driving unprecedented market momentum",
    author: "Sarah Chen",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b45f1222?w=100&h=100&fit=crop&crop=face",
    date: "December 15, 2024",
    readTime: "5 min read",
    category: "Market Analysis",
    image: "https://images.unsplash.com/photo-1518544866330-4e67de92e3e8?w=1200&h=600&fit=crop",
    initialLikes: 245,
    initialDislikes: 12,
    content: `
      Bitcoin has reached another milestone this week, surging to unprecedented heights as institutional adoption continues to accelerate across global markets. The world's largest cryptocurrency broke through previous resistance levels, marking a significant moment in its evolution from a niche digital asset to a mainstream financial instrument.

      The latest rally has been driven by a confluence of factors, including increased corporate treasury allocations, regulatory clarity in key markets, and growing acceptance among traditional financial institutions. Major corporations have announced substantial Bitcoin purchases, signaling a shift in how businesses view cryptocurrency as a store of value.

      "We're witnessing a fundamental transformation in how institutions approach Bitcoin," said Maria Rodriguez, Chief Investment Officer at Digital Asset Strategies. "What was once considered speculative is now being viewed as a legitimate hedge against inflation and currency debasement."

      The surge in institutional interest has been particularly pronounced in the United States, where several Fortune 500 companies have added Bitcoin to their balance sheets. This trend has been accompanied by the launch of Bitcoin exchange-traded funds (ETFs), making it easier for institutional investors to gain exposure to the cryptocurrency.

      Furthermore, central bank digital currencies (CBDCs) development worldwide has inadvertently legitimized the broader cryptocurrency ecosystem. As governments explore digital currencies, Bitcoin's position as the original and most established cryptocurrency has been reinforced.

      Technical analysis suggests that Bitcoin's current momentum could sustain further gains, with key resistance levels being tested. However, analysts warn that volatility remains a characteristic feature of the cryptocurrency market, and investors should remain cautious.

      The implications of this latest surge extend beyond just price appreciation. It represents a maturation of the cryptocurrency market and growing recognition of Bitcoin's role in the global financial system. As adoption continues to grow, the infrastructure supporting Bitcoin continues to evolve, with improvements in custody solutions, trading platforms, and regulatory frameworks.

      Looking ahead, industry experts remain optimistic about Bitcoin's long-term prospects, citing ongoing institutional adoption, technological improvements, and increasing global acceptance as key drivers for continued growth.
    `
  }
}) => {
  
  const [likes, setLikes] = useState(article.initialLikes || 0);
  const [dislikes, setDislikes] = useState(article.initialDislikes || 0);
  const [userReaction, setUserReaction] = useState(null); // 'like', 'dislike', or null
  
  const handleBack = () => {
    // Handle navigation back
    console.log('Navigate back');
  };

  const handleShare = () => {
    // Handle sharing
    console.log('Share article');
  };

  const handleBookmark = () => {
    // Handle bookmarking
    console.log('Bookmark article');
  };

  const handleLike = () => {
    if (userReaction === 'like') {
      // Remove like
      setLikes(likes - 1);
      setUserReaction(null);
    } else if (userReaction === 'dislike') {
      // Switch from dislike to like
      setDislikes(dislikes - 1);
      setLikes(likes + 1);
      setUserReaction('like');
    } else {
      // Add like
      setLikes(likes + 1);
      setUserReaction('like');
    }
  };

  const handleDislike = () => {
    if (userReaction === 'dislike') {
      // Remove dislike
      setDislikes(dislikes - 1);
      setUserReaction(null);
    } else if (userReaction === 'like') {
      // Switch from like to dislike
      setLikes(likes - 1);
      setDislikes(dislikes + 1);
      setUserReaction('dislike');
    } else {
      // Add dislike
      setDislikes(dislikes + 1);
      setUserReaction('dislike');
    }
  };

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
              >
                <Bookmark className="w-5 h-5 text-gray-300 hover:text-yellow-400" />
              </button>
              <button 
                onClick={handleShare}
                className="p-2 hover:bg-yellow-500/10 rounded-lg transition-colors"
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
        <p className="text-xl text-gray-300 leading-relaxed mb-8">
          {article.subtitle}
        </p>

        {/* Author & Meta */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <img 
              src={article.authorImage} 
              alt={article.author}
              className="w-12 h-12 rounded-full border-2 border-yellow-500/20"
            />
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <User className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">{article.author}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-xl overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          {article.content.split('\n\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="text-gray-300 leading-relaxed mb-6 text-lg">
                {paragraph.trim()}
              </p>
            )
          ))}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-gray-400 text-sm font-medium">Tags:</span>
            <div className="flex flex-wrap gap-2">
              {['Bitcoin', 'Cryptocurrency', 'Institutional', 'Market Analysis'].map((tag) => (
                <span 
                  key={tag}
                  className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs hover:bg-yellow-500/20 hover:text-yellow-400 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Like/Dislike Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-center space-x-8">
            <span className="text-gray-400 text-sm">Did you find this article helpful?</span>
            
            <div className="flex items-center space-x-4">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
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
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              
              <button className="bg-blue-800 hover:bg-blue-900 text-white p-3 rounded-full transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              
              <button className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsArticlePage;