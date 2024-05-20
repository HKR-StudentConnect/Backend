const express = require('express');
const { saveMessage,getmessages, createmessages} = require('../controllers/chatController');
const chatrouter = express.Router();

// Route to save messages to the database
chatrouter.post('/save-message', saveMessage);
chatrouter.get('/:sessionId', getmessages);
chatrouter.post('/',createmessages);



module.exports = chatrouter;
