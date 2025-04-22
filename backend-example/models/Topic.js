
const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  isUnlocked: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Topic', TopicSchema);
