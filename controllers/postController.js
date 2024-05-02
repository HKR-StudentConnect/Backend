//backend/controllers/postController.js

const Post = require('../models/posts');

exports.createPost = async (req, res) => {
    const { text, image } = req.body;  // for sending text and image URL or base64 data
    const userId = req.user.userID;  // Extracted from JWT payload
  
    try {
      const newPost = new Post({
        author: userId,
        content: {
          text,
          media: { images: [image] }
        }
      });
      await newPost.save();
      res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  