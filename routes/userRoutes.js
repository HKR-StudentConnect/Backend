//backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, createUserProfile, deleteUserProfile } = require('../controllers/userController');
const { verifyToken} = require('../middleware/auth');

// Routes for user profile management
router.post('/', verifyToken, createUserProfile); // Create a new user profile
router.get('/:userId', verifyToken, getUserProfile); // Get a specific user profile
router.put('/:userId', verifyToken, updateUserProfile); // Update a specific user profile
router.delete('/:userId', verifyToken, deleteUserProfile); // Delete a specific user profile

module.exports = router;

