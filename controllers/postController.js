const Post = require('../models/posts')
const User = require('../models/users')

exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params
    const post = await Post.findById(postId)
      .populate('author')
      .populate('likes.user')
      .populate('comments.user')

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.json(post)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

exports.createPost = async (req, res) => {
  const { content } = req.body
  try {
    const newPost = new Post({
      author: req.user.userID,
      content: content,
    })
    await newPost.save()
    const user = await User.findById(req.user.userID)
    user.posts.push(newPost._id)
    await user.save()
    res.status(201).json(newPost)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updatePost = async (req, res) => {
  const { postId } = req.params
  const { content } = req.body
  const updatedFields = {
    content: content,
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, updatedFields, {
      new: true,
    })
    res.json(updatedPost)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.deletePost = async (req, res) => {
  const { postId } = req.params
  try {
    const deletedPost = await Post.findByIdAndDelete(postId)
    const user = await User.findById(deletedPost.authorId)

    const postIndex = user.posts.indexOf(postId)
    if (postIndex !== -1) {
      user.posts.splice(postIndex, 1)
      await user.save()
    }

    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.sendNotification = async (req, res) => {
  const { message, userId } = req.body // userId optional, if not provided, send to all users
  try {
    const criteria = userId ? { _id: userId } : {} // All users if no userId specified
    const users = await User.find(criteria)
    // Assuming you have a mechanism to send notifications
    users.forEach(user => {
      // pseudoFunctionToSendNotification(user, message);
    })
    res.json({ message: 'Notifications sent successfully.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
