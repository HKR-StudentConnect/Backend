const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  status: String,
  startedAt: Date,
  endedAt: Date
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
