const express = require('express');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const errorHandler = require('./error/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Load env vars
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie parser
app.use(cookieParser());

// File upload middleware
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
}));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/upload', uploadRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Blog Krypto Started!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      articles: '/api/articles',
      upload: '/api/upload'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use(errorHandler);

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;