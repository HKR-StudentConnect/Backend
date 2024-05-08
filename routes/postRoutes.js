// File path: backend/routes/postRoutes.js

const express = require('express');
const router = express.Router();
const { createPost, updatePost, deletePost } = require('../controllers/postController');
const { verifyToken } = require('../middleware/auth');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/', verifyToken, upload, createPost);
router.put('/:postId', verifyToken, upload, updatePost);
router.delete('/:postId', verifyToken, deletePost);

module.exports = router;

