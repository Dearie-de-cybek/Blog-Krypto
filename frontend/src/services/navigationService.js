import articlesService from './articlesService';

const navigationService = {
  // Check if a category has articles and navigate accordingly
  navigateToCategory: async (category, navigate, minArticles = 1) => {
    try {
      // Fetch articles for the category
      const response = await articlesService.getArticlesByCategory(category, minArticles + 5);
      
      // Check if we have enough articles
      if (response.data && response.data.length >= minArticles) {
        // Navigate to category page with articles
        navigate(`/category/${category.toLowerCase().replace(/\s+/g, '-')}`, { 
          state: { 
            articles: response.data, 
            categoryName: category 
          } 
        });
      } else {
        // Navigate to coming soon page
        navigate('/coming-soon', { 
          state: { 
            requestedCategory: category,
            reason: `No ${category.toLowerCase()} articles available yet`
          } 
        });
      }
    } catch (error) {
      console.error(`Error checking category ${category}:`, error);
      // On error, go to coming soon page
      navigate('/coming-soon', { 
        state: { 
          requestedCategory: category,
          reason: 'Unable to load content at this time'
        } 
      });
    }
  },

  // Get all available categories with article counts (your actual categories)
  getAvailableCategories: async () => {
    try {
      const categories = [
        'Education', 
        'Events', 
        'Interviews', 
        'Market Analysis',
        'Press Release',
        'News',
        'Technology',
        'Cryptocurrency',
        'Blockchain',
        'DeFi',
        'NFTs',
        'Trading'
      ];

      const categoryPromises = categories.map(async (category) => {
        try {
          const response = await articlesService.getArticlesByCategory(category, 1);
          return {
            name: category,
            slug: category.toLowerCase().replace(/\s+/g, '-'),
            count: response.data?.length || 0,
            available: (response.data?.length || 0) > 0,
            latestArticle: response.data?.[0] || null
          };
        } catch (error) {
          return {
            name: category,
            slug: category.toLowerCase().replace(/\s+/g, '-'),
            count: 0,
            available: false,
            latestArticle: null,
            error: error.message
          };
        }
      });

      const results = await Promise.allSettled(categoryPromises);
      
      return results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            name: categories[index],
            slug: categories[index].toLowerCase().replace(/\s+/g, '-'),
            count: 0,
            available: false,
            latestArticle: null,
            error: result.reason?.message || 'Unknown error'
          };
        }
      });

    } catch (error) {
      console.error('Error getting available categories:', error);
      return [];
    }
  },

  // Smart navigation handler for header links (updated for your navigation)
  handleHeaderNavigation: (categoryName, navigate) => {
    const categoryMappings = {
      'Home': '/',
      'Education': 'Education',
      'Events': 'Events',
      'Interviews': 'Interviews',
      'Market Analysis': 'Market Analysis',
      'Press Release': 'Press Release'
    };

    const category = categoryMappings[categoryName];
    
    if (category === '/') {
      navigate('/');
    } else if (category) {
      navigationService.navigateToCategory(category, navigate);
    } else {
      navigate('/coming-soon', { 
        state: { 
          requestedCategory: categoryName,
          reason: 'Section not available yet'
        } 
      });
    }
  },

  // Check if specific tag has articles
  checkTagAvailability: async (tag) => {
    try {
      const response = await articlesService.searchArticles(tag, { limit: 5 });
      return {
        available: (response.data?.length || 0) > 0,
        count: response.total || 0,
        articles: response.data || []
      };
    } catch (error) {
      console.error(`Error checking tag ${tag}:`, error);
      return {
        available: false,
        count: 0,
        articles: [],
        error: error.message
      };
    }
  },

  // Navigate to tag-based articles
  navigateToTag: async (tag, navigate) => {
    try {
      const tagInfo = await navigationService.checkTagAvailability(tag);
      
      if (tagInfo.available) {
        navigate(`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`, { 
          state: { 
            articles: tagInfo.articles,
            tagName: tag,
            totalCount: tagInfo.count
          } 
        });
      } else {
        navigate('/coming-soon', { 
          state: { 
            requestedTag: tag,
            reason: `No articles tagged with "${tag}" yet`
          } 
        });
      }
    } catch (error) {
      navigate('/coming-soon', { 
        state: { 
          requestedTag: tag,
          reason: 'Unable to load tagged content'
        } 
      });
    }
  },

  // Get category suggestions based on available content
  getCategorySuggestions: async () => {
    try {
      const categories = await navigationService.getAvailableCategories();
      
      // Return categories that have content, sorted by article count
      return categories
        .filter(cat => cat.available)
        .sort((a, b) => b.count - a.count)
        .slice(0, 6); // Top 6 categories with content
        
    } catch (error) {
      console.error('Error getting category suggestions:', error);
      return [];
    }
  },

  // Navigate to search results
  navigateToSearch: async (query, navigate) => {
    try {
      const response = await articlesService.searchArticles(query, { limit: 10 });
      
      if (response.data && response.data.length > 0) {
        navigate(`/search?q=${encodeURIComponent(query)}`, {
          state: {
            results: response.data,
            query: query,
            totalCount: response.total || response.data.length
          }
        });
      } else {
        navigate('/coming-soon', {
          state: {
            requestedSearch: query,
            reason: `No search results found for "${query}"`
          }
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      navigate('/coming-soon', {
        state: {
          requestedSearch: query,
          reason: 'Search is temporarily unavailable'
        }
      });
    }
  }
};

export default navigationService;