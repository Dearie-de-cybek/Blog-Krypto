const express = require('express');
const { uploadFile, getFiles, deleteFile } = require('../controller/uploadController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All upload routes require admin authentication
router.use(protect);

router.post('/', uploadFile);
router.get('/files', getFiles);
router.delete('/:filename', deleteFile);

module.exports = router;