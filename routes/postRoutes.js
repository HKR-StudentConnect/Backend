//backend/routes/postRoutes.js

const express = require('express');
const router = express.Router();
const { createPost } = require('../controllers/postController');
const { verifyToken } = require('../middleware/auth'); // Ensure this middleware can decode JWT and add user info

router.post('/', verifyToken, createPost);

module.exports = router;
