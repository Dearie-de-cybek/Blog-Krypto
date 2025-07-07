import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import FeaturedNewsCard from '../components/FeaturedNewsCard';
import FeaturedNewsHeader from '../components/FeaturedNewsHeader';
import TrendingNewsHeader from '../components/TrendingNewsHeader';
import TrendingNewsCard from '../components/TrendingNewsCard';
import PressReleaseCard from '../components/PressReleaseCard';
import NewsletterSection from '../components/NewsletterSection';
import FooterSection from '../components/Footer';
import articlesService from '../services/articlesService';

const Home = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [pressReleaseArticles, setPressReleaseArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    // Navigate to article detail page
    window.location.href = `/article/${article.slug}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Featured News Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeaturedNewsHeader />
        
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
              />
            ))}
          </div>
        </div>
      </div>

      {/* Trending News Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TrendingNewsHeader />
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - 3 Trending Cards */}
          <div className="space-y-4">
            {trendingArticles.map((article) => (
              <TrendingNewsCard
                key={article._id}
                image={article.featuredImage}
                tag={article.category}
                title={article.title}
                onClick={() => handleArticleClick(article)}
              />
            ))}
          </div>

          {/* Right Side - Press Release */}
          {pressReleaseArticles.length > 0 && (
            <PressReleaseCard
              image={pressReleaseArticles[0].featuredImage}
              tag={pressReleaseArticles[0].category}
              title={pressReleaseArticles[0].title}
              description={pressReleaseArticles[0].excerpt}
              onClick={() => handleArticleClick(pressReleaseArticles[0])}
            />
          )}
        </div>
      </div>

      <NewsletterSection />
      <FooterSection />
    </div>
  );
};

export default Home;