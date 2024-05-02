//backend/models/posts.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: {
    text: String,
    media: {
      images: [String],
      videos: [String]
    }
  },
  likes: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String
  }],
  comments: [{
    commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    timestamp: Date
  }],
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
