const express = require('express')
const router = express.Router()
const {
  getUserProfile,
  updateUserProfile,
  createUserProfile,
  deleteUserProfile,
  getUsersByUsername,
  getUserFollowsPosts,
  getPublicUserById,
  getAllUsers,
} = require('../controllers/userController')
const {
  getUserFollowers,
  getUserFollows,
  followUser,
  unfollowUser,
} = require('../controllers/followController')
const { verifyToken, admin } = require('../middleware/auth')

router.get('/', verifyToken, admin, getAllUsers)
router.post('/', verifyToken, createUserProfile) // Create a new user profile
router.get('/:userId', verifyToken, getUserProfile) // Get a specific user profile
router.put('/:userId', verifyToken, updateUserProfile) // Update a specific user profile
router.delete('/:userId', verifyToken, deleteUserProfile) // Delete a specific user profile

router.get('/public/:userId', getPublicUserById)

router.get('/:userId/followers', getUserFollowers) // see followers of the user
router.get('/:userId/follows', getUserFollows) // see follows of the user
router.post('/:userId/follow', verifyToken, followUser) // add followers
router.delete('/:userId/unfollow', verifyToken, unfollowUser) // unfollow

router.get('/search/user', getUsersByUsername)
router.get('/:userId/follows/posts', verifyToken, getUserFollowsPosts)

module.exports = router
