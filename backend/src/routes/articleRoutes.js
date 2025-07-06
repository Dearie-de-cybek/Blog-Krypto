const express = require('express');
const {
  getArticles,
  getArticle,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  dislikeArticle
} = require('../controller/articlesController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', getArticles);
router.get('/slug/:slug', getArticleBySlug);
router.get('/:id', getArticle);
router.post('/:id/like', likeArticle);
router.post('/:id/dislike', dislikeArticle);

// Admin routes (protected)
router.post('/', protect, createArticle);
router.put('/:id', protect, updateArticle);
router.delete('/:id', protect, deleteArticle);

module.exports = router;