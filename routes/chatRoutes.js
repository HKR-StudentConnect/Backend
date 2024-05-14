const express = require('express');
const { saveMessage } = require('../controllers/chatController');
const router = express.Router();

// Route to save messages to the database
router.post('/save-message', saveMessage);

module.exports = router;
