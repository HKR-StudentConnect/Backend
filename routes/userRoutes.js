const express = require('express')
const router = express.Router()
const {
  getUserProfile,
  updateUserProfile,
  createUserProfile,
  deleteUserProfile,
  getfollowers,
  unfollowUser,
  followUser,
} = require('../controllers/userController')
const { verifyToken } = require('../middleware/auth')

router.post('/', verifyToken, createUserProfile) // Create a new user profile
router.get('/:userId', verifyToken, getUserProfile) // Get a specific user profile
router.put('/:userId', verifyToken, updateUserProfile) // Update a specific user profile
router.delete('/:userId', verifyToken, deleteUserProfile) // Delete a specific user profile

router.get('/:userId/followers', verifyToken, getfollowers) // see followers of the user
router.post('/:userId/followers', verifyToken, followUser) // add followers
router.delete('/:userId/followers', verifyToken, unfollowUser) // unfollow

module.exports = router
