const Article = require('../models/Article');
const User = require('../models/User');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
exports.getArticles = async (req, res) => {
  try {
    let query = {};
    
    // Build query based on parameters
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    if (req.query.status) {
      query.status = req.query.status;
    } else {
      // Only show published articles for public access
      if (!req.user || req.user.role !== 'admin') {
        query.status = 'published';
      }
    }
    
    if (req.query.author) {
      query.author = req.query.author;
    }
    
    if (req.query.featured) {
      query.isFeatured = req.query.featured === 'true';
    }

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Date range filter
    if (req.query.dateFrom || req.query.dateTo) {
      query.publishDate = {};
      if (req.query.dateFrom) {
        query.publishDate.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        query.publishDate.$lte = new Date(req.query.dateTo);
      }
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Sort options
    let sortOptions = {};
    switch (req.query.sort) {
      case 'newest':
        sortOptions = { publishDate: -1 };
        break;
      case 'oldest':
        sortOptions = { publishDate: 1 };
        break;
      case 'popular':
        sortOptions = { views: -1 };
        break;
      case 'liked':
        sortOptions = { 'likes.length': -1 };
        break;
      default:
        sortOptions = { publishDate: -1 };
    }

    const articles = await Article.find(query)
      .populate('author', 'name email avatar')
      .sort(sortOptions)
      .limit(limit)
      .skip(startIndex)
      .select('-content'); // Exclude full content for list view

    const total = await Article.countDocuments(query);

    // Pagination info
    const pagination = {
      current: page,
      total: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      pagination,
      data: articles
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name email avatar')
      .populate('likes.user', 'name')
      .populate('dislikes.user', 'name');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Check if user can view this article
    if (article.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Increment view count (but not for the author)
    if (!req.user || req.user.id !== article.author._id.toString()) {
      article.views += 1;
      await article.save();
    }

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Get article error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get article by slug
// @route   GET /api/articles/slug/:slug
// @access  Public
exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate('author', 'name email avatar')
      .populate('likes.user', 'name')
      .populate('dislikes.user', 'name');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Check if user can view this article
    if (article.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Increment view count (but not for the author)
    if (!req.user || req.user.id !== article.author._id.toString()) {
      article.views += 1;
      await article.save();
    }

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Get article by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private (Admin only)
exports.createArticle = async (req, res) => {
  try {
    // Add author to req.body
    req.body.author = req.user.id;

    const article = await Article.create(req.body);

    // Populate author info
    await article.populate('author', 'name email avatar');

    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Create article error:', error);
    
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: message.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private (Admin only)
exports.updateArticle = async (req, res) => {
  try {
    let article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Make sure user is article owner or admin
    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this article'
      });
    }

    article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'name email avatar');

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Update article error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: message.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private (Admin only)
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Make sure user is article owner or admin
    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this article'
      });
    }

    await article.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Delete article error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Like article
// @route   POST /api/articles/:id/like
// @access  Private
exports.likeArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Check if user already liked the article
    const alreadyLiked = article.likes.some(like => like.user.toString() === req.user.id);
    
    if (alreadyLiked) {
      // Remove like
      article.likes = article.likes.filter(like => like.user.toString() !== req.user.id);
    } else {
      // Remove dislike if exists and add like
      article.dislikes = article.dislikes.filter(dislike => dislike.user.toString() !== req.user.id);
      article.likes.push({ user: req.user.id });
    }

    await article.save();

    res.status(200).json({
      success: true,
      data: {
        likes: article.likes.length,
        dislikes: article.dislikes.length,
        userLiked: !alreadyLiked,
        userDisliked: false
      }
    });
  } catch (error) {
    console.error('Like article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Dislike article
// @route   POST /api/articles/:id/dislike
// @access  Private
exports.dislikeArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Check if user already disliked the article
    const alreadyDisliked = article.dislikes.some(dislike => dislike.user.toString() === req.user.id);
    
    if (alreadyDisliked) {
      // Remove dislike
      article.dislikes = article.dislikes.filter(dislike => dislike.user.toString() !== req.user.id);
    } else {
      // Remove like if exists and add dislike
      article.likes = article.likes.filter(like => like.user.toString() !== req.user.id);
      article.dislikes.push({ user: req.user.id });
    }

    await article.save();

    res.status(200).json({
      success: true,
      data: {
        likes: article.likes.length,
        dislikes: article.dislikes.length,
        userLiked: false,
        userDisliked: !alreadyDisliked
      }
    });
  } catch (error) {
    console.error('Dislike article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get trending articles
// @route   GET /api/articles/trending
// @access  Public
exports.getTrendingArticles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const timeframe = req.query.timeframe || '7d'; // 1d, 7d, 30d

    let dateFilter = {};
    const now = new Date();
    
    switch (timeframe) {
      case '1d':
        dateFilter = { publishDate: { $gte: new Date(now - 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { publishDate: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
        break;
      default: // 7d
        dateFilter = { publishDate: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
    }

    const articles = await Article.find({
      status: 'published',
      ...dateFilter
    })
      .populate('author', 'name email avatar')
      .sort({ views: -1, 'likes.length': -1 })
      .limit(limit)
      .select('-content');

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    console.error('Get trending articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};