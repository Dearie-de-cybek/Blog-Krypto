const express = require('express');
const router = express.Router();
const { uploadFile, getFiles, deleteFile } = require('../controller/uploadController');
const { protect } = require('../middlewares/auth');

// Apply auth middleware to all upload routes
router.use(protect);

// @route   POST /api/upload
// @desc    Upload file
// @access  Private (Admin only)
router.post('/', uploadFile);

// @route   GET /api/upload/files
// @desc    Get all uploaded files
// @access  Private (Admin only)
router.get('/files', getFiles);

// @route   DELETE /api/upload/:filename
// @desc    Delete uploaded file
// @access  Private (Admin only)
router.delete('/:filename', deleteFile);

module.exports = router;