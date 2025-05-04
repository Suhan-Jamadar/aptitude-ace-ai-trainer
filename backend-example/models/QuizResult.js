
const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
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
  score: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    required: true
  },
  questionsAttempted: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  performance: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);
