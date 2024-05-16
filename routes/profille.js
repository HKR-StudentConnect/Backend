const express = require('express');
const profilerouter = express.Router();
const profileController = require('../controllers/profilecontroller.js');


profilerouter.get('/:userId', profileController.getUserProfile);
profilerouter.get('/:userId/followers', profileController.getFollowers);
profilerouter.get('/:userId/following', profileController.getFollowing);
profilerouter.get('/:userId/suggestions', profileController.getSuggestions);
profilerouter.get('/:userId/posts', profileController.getUserPosts);

module.exports = profilerouter;
