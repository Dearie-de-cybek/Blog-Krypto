const express = require('express');
const { login, logout, getMe } = require('../controller/authController'); 
const { protect } = require('../middlewares/auth'); 

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;