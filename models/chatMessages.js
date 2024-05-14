const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    chatSession: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
