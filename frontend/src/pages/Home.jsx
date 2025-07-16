import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import FeaturedNewsCard from '../components/FeaturedNewsCard';
import FeaturedNewsHeader from '../components/FeaturedNewsHeader';
import TrendingNewsHeader from '../components/TrendingNewsHeader';
import TrendingNewsCard from '../components/TrendingNewsCard';
import PressReleaseCard from '../components/PressReleaseCard';
import NewsletterSection from '../components/NewsletterSection';
import FooterSection from '../components/Footer';
import ExchangeRateTicker from '../components/ExchangeRateTicker';
import articlesService from '../services/articlesService';
import navigationService from '../services/navigationService';

const Home = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [pressReleaseArticles, setPressReleaseArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch featured articles
      const featuredResponse = await articlesService.getArticles({
        featured: true,
        limit: 6,
        status: 'published'
      });
      
      // Fetch trending articles (most viewed)
      const trendingResponse = await articlesService.getArticles({
        sort: 'popular',
        limit: 3,
        status: 'published'
      });
      
      // Fetch press release articles
      const pressReleaseResponse = await articlesService.getArticlesByCategory(
        'Press Release',
        1
      );

      setFeaturedArticles(featuredResponse.data || []);
      setTrendingArticles(trendingResponse.data || []);
      setPressReleaseArticles(pressReleaseResponse.data || []);
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (article) => {
    // Navigate to article detail page using slug
    navigate(`/article/${article.slug}`);
  };

  const handleCategoryClick = (category) => {
    // Use smart navigation to check if category has articles
    navigationService.navigateToCategory(category, navigate);
  };

  const handleTagClick = (tag) => {
    // Use smart navigation for tags
    navigationService.navigateToTag(tag, navigate);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <div className="text-yellow-400 text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-400 text-xl">Error: {error}</div>
          <button 
            onClick={fetchAllData}
            className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Exchange Rates Widget */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <ExchangeRateTicker showRefresh={true} />
      </div>
      
      {/* Featured News Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeaturedNewsHeader />
        
        {featuredArticles.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - 3 Featured Cards */}
            <div className="space-y-4">
              {featuredArticles.slice(0, 3).map((article) => (
                <FeaturedNewsCard
                  key={article._id}
                  image={article.featuredImage}
                  tag={article.category}
                  title={article.title}
                  onClick={() => handleArticleClick(article)}
                  onTagClick={() => handleCategoryClick(article.category)}
                />
              ))}
            </div>

            {/* Right Side - 3 Featured Cards */}
            <div className="space-y-4">
              {featuredArticles.slice(3, 6).map((article) => (
                <FeaturedNewsCard
                  key={article._id}
                  image={article.featuredImage}
                  tag={article.category}
                  title={article.title}
                  onClick={() => handleArticleClick(article)}
                  onTagClick={() => handleCategoryClick(article.category)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No featured articles available</div>
            <button 
              onClick={() => navigate('/coming-soon')}
              className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Stay Updated
            </button>
          </div>
        )}
      </div>

      {/* Trending News Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TrendingNewsHeader />
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Trending Cards */}
          <div className="space-y-4">
            {trendingArticles.length > 0 ? (
              trendingArticles.map((article) => (
                <TrendingNewsCard
                  key={article._id}
                  image={article.featuredImage}
                  tag={article.category}
                  title={article.title}
                  onClick={() => handleArticleClick(article)}
                  onTagClick={() => handleCategoryClick(article.category)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400">No trending articles available</div>
              </div>
            )}
          </div>

          {/* Right Side - Press Release */}
          <div>
            {pressReleaseArticles.length > 0 ? (
              <PressReleaseCard
                image={pressReleaseArticles[0].featuredImage}
                tag={pressReleaseArticles[0].category}
                title={pressReleaseArticles[0].title}
                description={pressReleaseArticles[0].subtitle || pressReleaseArticles[0].metaDescription}
                onClick={() => handleArticleClick(pressReleaseArticles[0])}
                onTagClick={() => handleCategoryClick(pressReleaseArticles[0].category)}
              />
            ) : (
              <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
                <h3 className="text-white text-lg font-semibold mb-2">Press Releases</h3>
                <p className="text-gray-400 mb-4">No press releases available yet</p>
                <button 
                  onClick={() => navigate('/coming-soon')}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Coming Soon
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    

      <NewsletterSection />
      <FooterSection />
    </div>
  );
};

export default Home;