const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] }, 
  onlineStatus: { type: Boolean, default: false }, //added for the online chat feature
  auth: {
    mfaEnabled: { type: Boolean, default: false },
    verification: {
      emailVerified: { type: Boolean, default: false },
      phoneVerified: { type: Boolean, default: false }
    }
  },
  profile: {
    name: String,
    university: String,
    bio: String,
    profilePictureUrl: String,
    coverPhotoUrl: String
  },  
  settings: {
    privacy: {
      profileVisibleTo: String,
      postsVisibleTo: String,
      allowFollow: String
    },
    notifications: {
      push: Boolean,
      email: Boolean
    }
  },
  follows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  chatSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession' }]
});

module.exports = mongoose.model('User', userSchema);
