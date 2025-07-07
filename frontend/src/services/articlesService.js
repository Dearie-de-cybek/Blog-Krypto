import API from './api';

const articlesService = {
  // Get all articles (public)
  getArticles: async (params = {}) => {
    try {
      const response = await API.get('/articles', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch articles' };
    }
  },

  // Get single article by ID
  getArticle: async (id) => {
    try {
      const response = await API.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch article' };
    }
  },

  // Get article by slug
  getArticleBySlug: async (slug) => {
    try {
      const response = await API.get(`/articles/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch article' };
    }
  },

  // Create new article (admin only)
  createArticle: async (articleData) => {
    try {
      const response = await API.post('/articles', articleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create article' };
    }
  },

  // Update article (admin only)
  updateArticle: async (id, articleData) => {
    try {
      const response = await API.put(`/articles/${id}`, articleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update article' };
    }
  },

  // Delete article (admin only)
  deleteArticle: async (id) => {
    try {
      const response = await API.delete(`/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete article' };
    }
  },

  // Like article
  likeArticle: async (id) => {
    try {
      const response = await API.post(`/articles/${id}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to like article' };
    }
  },

  // Dislike article
  dislikeArticle: async (id) => {
    try {
      const response = await API.post(`/articles/${id}/dislike`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to dislike article' };
    }
  },

  // Get featured articles
  getFeaturedArticles: async (limit = 4) => {
    try {
      const response = await API.get('/articles', {
        params: { featured: true, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch featured articles' };
    }
  },

  // Get articles by category
  getArticlesByCategory: async (category, limit = 10) => {
    try {
      const response = await API.get('/articles', {
        params: { category, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch articles by category' };
    }
  },

  // Search articles
  searchArticles: async (query, params = {}) => {
    try {
      const response = await API.get('/articles', {
        params: { search: query, ...params }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search articles' };
    }
  }
};

export default articlesService;