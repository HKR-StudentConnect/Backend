const express = require('express')
const router = express.Router()
const {
  createPost,
  updatePost,
  deletePost,
  getPost,
  likePost,
  unLikePost,
  addComment,
  removeComment,
} = require('../controllers/postController')
const { verifyToken } = require('../middleware/auth')

router.get('/:postId', getPost)
router.post('/', verifyToken, createPost)
router.put('/:postId', verifyToken, updatePost)
router.delete('/:postId', verifyToken, deletePost)

// Likes
router.post('/:postId/like', verifyToken, likePost)
router.post('/:postId/unlike', verifyToken, unLikePost)

// Comments
router.post('/:postId/comments', verifyToken, addComment)
router.delete('/:postId/comments/:commentId', verifyToken, removeComment)

module.exports = router
