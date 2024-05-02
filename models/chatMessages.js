//backend/models/chatMessages.js

const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  chatSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: {
    text: String,
    media: {
      images: [String],
      audio: [String]
    }
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
