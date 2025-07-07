/* eslint-disable no-undef */
import { useState, useEffect } from 'react';
import articlesService from '../services/articlesService';

export const useArticles = (params = {}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await articlesService.getArticles(params);
        setArticles(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [params]);

  return { articles, loading, error, refetch: () => fetchArticles() };
};


