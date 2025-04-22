
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  streak: {
    type: Number,
    default: 0
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  progress: {
    topicsCompleted: {
      type: Number,
      default: 0
    },
    grandTestUnlocked: {
      type: Boolean,
      default: false
    }
  }
});

module.exports = mongoose.model('User', UserSchema);
