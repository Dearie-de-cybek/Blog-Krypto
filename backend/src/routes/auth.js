const express = require('express');
const { login, logout, getMe, createAdmin } = require('../controller/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

router.post('/create-admin', createAdmin);

module.exports = router;