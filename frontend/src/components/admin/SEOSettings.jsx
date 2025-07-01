import React, { useState, useEffect } from 'react';

const SEOSettings = ({ 
  metaDescription, 
  setMetaDescription, 
  seoKeywords, 
  setSeoKeywords,
  title,
  content 
}) => {
  
  const [seoScore, setSeoScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);

  // Calculate SEO Score
  useEffect(() => {
    let score = 0;
    let newSuggestions = [];

    // Title length check
    if (title && title.length >= 30 && title.length <= 60) {
      score += 20;
    } else if (title && title.length > 0) {
      score += 10;
      if (title.length < 30) {
        newSuggestions.push('Title should be at least 30 characters');
      }
      if (title.length > 60) {
        newSuggestions.push('Title should be under 60 characters');
      }
    } else {
      newSuggestions.push('Add a title for your post');
    }

    // Meta description check
    if (metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160) {
      score += 25;
    } else if (metaDescription && metaDescription.length > 0) {
      score += 15;
      if (metaDescription.length < 120) {
        newSuggestions.push('Meta description should be at least 120 characters');
      }
      if (metaDescription.length > 160) {
        newSuggestions.push('Meta description should be under 160 characters');
      }
    } else {
      newSuggestions.push('Add a meta description');
    }

    // Content length check
    if (content && content.length >= 300) {
      score += 20;
    } else if (content && content.length > 0) {
      score += 10;
      newSuggestions.push('Content should be at least 300 characters for better SEO');
    } else {
      newSuggestions.push('Add content to your post');
    }

    // Keywords check
    if (seoKeywords && seoKeywords.split(',').filter(k => k.trim().length > 0).length >= 3) {
      score += 15;
    } else if (seoKeywords && seoKeywords.length > 0) {
      score += 8;
      newSuggestions.push('Add at least 3 SEO keywords');
    } else {
      newSuggestions.push('Add SEO keywords');
    }

    // Keyword in title check
    if (title && seoKeywords) {
      const keywords = seoKeywords.split(',').map(k => k.trim().toLowerCase());
      const titleLower = title.toLowerCase();
      const hasKeywordInTitle = keywords.some(keyword => 
        keyword.length > 0 && titleLower.includes(keyword)
      );
      if (hasKeywordInTitle) {
        score += 20;
      } else if (keywords.length > 0) {
        newSuggestions.push('Include a keyword in your title');
      }
    }

    setSeoScore(Math.min(score, 100));
    setSuggestions(newSuggestions);
  }, [title, metaDescription, content, seoKeywords]);

  const getScoreColor = () => {
    if (seoScore >= 80) return 'text-green-400';
    if (seoScore >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = () => {
    if (seoScore >= 80) return 'Excellent';
    if (seoScore >= 60) return 'Good';
    if (seoScore >= 40) return 'Needs Work';
    return 'Poor';
  };

  const generateSlug = () => {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">SEO Settings</h3>
      
      {/* SEO Score */}
      <div className="mb-6 p-4 bg-gray-900 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">SEO Score</span>
          <span className={`text-lg font-bold ${getScoreColor()}`}>
            {seoScore}/100
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              seoScore >= 80 ? 'bg-green-400' : 
              seoScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${seoScore}%` }}
          ></div>
        </div>
        <span className={`text-sm ${getScoreColor()}`}>{getScoreLabel()}</span>
      </div>

      <div className="space-y-4">
        {/* Meta Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Meta Description
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Brief description for search engines..."
            rows={3}
            maxLength={160}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Optimal: 120-160 characters</span>
            <span className={metaDescription.length > 160 ? 'text-red-400' : 'text-gray-400'}>
              {metaDescription.length}/160
            </span>
          </div>
        </div>

        {/* SEO Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            SEO Keywords
          </label>
          <input
            type="text"
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            placeholder="bitcoin, cryptocurrency, market"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Separate keywords with commas. Focus on 3-5 main keywords.
          </p>
        </div>

        {/* URL Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            URL Slug
          </label>
          <div className="bg-gray-900 px-3 py-2 rounded-lg border border-gray-600">
            <span className="text-gray-400 text-sm">yoursite.com/blog/</span>
            <span className="text-white">{generateSlug() || 'post-title'}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Auto-generated from your title
          </p>
        </div>

        {/* SEO Suggestions */}
        {suggestions.length > 0 && (
          <div className="pt-4 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Suggestions</h4>
            <ul className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-xs text-gray-400 flex items-start">
                  <span className="text-yellow-400 mr-1">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOSettings;