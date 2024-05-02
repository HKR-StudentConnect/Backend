//backend/models/adminLog.js

const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  action: String,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  reason: String,
  details: String,
  timestamp: Date
});

module.exports = mongoose.model('AdminLog', adminLogSchema);
