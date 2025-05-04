
const mongoose = require('mongoose');

const GrandTestResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  }
});

module.exports = mongoose.model('GrandTestResult', GrandTestResultSchema);
