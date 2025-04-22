
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
