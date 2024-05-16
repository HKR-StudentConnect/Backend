const Post = require('../models/posts')
const User = require('../models/users')

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('follows followers posts');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('followers');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('follows');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.follows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const suggestions = await User.find({ _id: { $nin: [...user.follows, user._id] } }).limit(10);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
