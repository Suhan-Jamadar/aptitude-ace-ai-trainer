
const mongoose = require('mongoose');

const UserTopicProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  completedQuestions: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can only have one progress record per topic
UserTopicProgressSchema.index({ user: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('UserTopicProgress', UserTopicProgressSchema);
