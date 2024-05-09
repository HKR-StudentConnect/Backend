// File path: backend/controllers/postController.js
const Post = require('../models/posts');

exports.createPost = async (req, res) => {
  const { text } = req.body;
  // Adding checks to ensure req.files is defined before accessing it
  const images = req.files && req.files['images'] ? req.files['images'].map(file => file.buffer) : [];
  const video = req.files && req.files['video'] ? req.files['video'][0].buffer : null;

  // Check for conflicts between images and video
  if (images.length > 0 && video) {
    return res.status(400).json({ message: 'Cannot upload both images and video.' });
  }

  try {
    const newPost = new Post({
      author: req.user.userID, // Assuming req.user is populated from the auth middleware
      content: {
        text,
        media: {
          images: images,
          videos: video ? [video] : []
        }
      }
    });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CRUD operations for update and delete post
exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  const { text, newImages, newVideo } = req.body;
  const updatedFields = {
    content: {
      text: text,
      media: {
        images: newImages && req.files['images'] ? req.files['images'].map(file => file.buffer) : undefined,
        videos: newVideo && req.files['video'] ? req.files['video'][0].buffer : undefined
      }
    }
  };

  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, updatedFields, { new: true });
    res.json({ message: 'Post updated successfully', updatedPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    await Post.findByIdAndDelete(postId);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendNotification = async (req, res) => {
  const { message, userId } = req.body;  // userId optional, if not provided, send to all users
  try {
      const criteria = userId ? { _id: userId } : {};  // All users if no userId specified
      const users = await User.find(criteria);
      // Assuming you have a mechanism to send notifications
      users.forEach(user => {
          // pseudoFunctionToSendNotification(user, message);
      });
      res.json({ message: "Notifications sent successfully." });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

