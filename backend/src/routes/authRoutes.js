const express = require('express');
const { login, logout, getMe, createAdmin } = require('../controller/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// Create initial admin (remove this route after creating admin or add protection)
router.post('/create-admin', createAdmin);

module.exports = router;