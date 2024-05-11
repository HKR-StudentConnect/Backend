const express = require('express')
const router = express.Router()
const {
  createPost,
  updatePost,
  deletePost,
  getPost,
} = require('../controllers/postController')
const { verifyToken } = require('../middleware/auth')

router.get('/:postId', getPost)
router.post('/', verifyToken, createPost)
router.put('/:postId', verifyToken, updatePost)
router.delete('/:postId', verifyToken, deletePost)

module.exports = router
