
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Question = require('../models/Question');
const DailyChallengeResult = require('../models/DailyChallengeResult');
const Topic = require('../models/Topic');
const mongoose = require('mongoose');

/**
 * @route GET /api/daily-challenge
 * @desc Get daily challenge questions
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    // Get today's date (YYYY-MM-DD format) to create a consistent seed for a given day
    const today = new Date().toISOString().split('T')[0];
    
    // Create a deterministic seed based on the date
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    
    // Count total questions in the database
    const count = await Question.countDocuments();
    
    if (count < 5) {
      return res.status(404).json({ message: 'Not enough questions available for daily challenge' });
    }
    
    // Use the seed to generate a random starting point for questions
    const random = Math.floor((seed % count) / 5) * 5; // Ensures we get 5 questions without going out of bounds
    
    // Fetch 5 questions for daily challenge
    const dailyQuestions = await Question.find()
      .skip(random)
      .limit(5);
    
    // Transform to expected format
    const formattedQuestions = dailyQuestions.map(q => ({
      id: q._id,
      topicId: q.topicId,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }));
    
    res.json(formattedQuestions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route GET /api/topics/:topicId/questions
 * @desc Get questions for a specific topic
 * @access Public
 */
router.get('/topics/:topicId/questions', async (req, res) => {
  try {
    const { topicId } = req.params;
    
    // Validate if topicId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: 'Invalid topic ID format' });
    }
    
    // Check if topic exists
    const topicExists = await Topic.findById(topicId);
    if (!topicExists) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Fetch questions for the topic
    const questions = await Question.find({ topicId });
    
    // Transform to expected format
    const formattedQuestions = questions.map(q => ({
      id: q._id,
      topicId: q.topicId,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }));
    
    res.json(formattedQuestions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route POST /api/daily-challenge/results
 * @desc Submit results for daily challenge
 * @access Private
 */
router.post('/results', auth, async (req, res) => {
  try {
    const { score, timeSpent, questionsAttempted, correctAnswers } = req.body;
    
    // Create new daily challenge result
    const dailyChallengeResult = new DailyChallengeResult({
      user: req.user.id,
      score,
      timeSpent,
      questionsAttempted,
      correctAnswers
    });
    
    // Save to database
    await dailyChallengeResult.save();
    
    res.json({ 
      success: true,
      message: 'Daily challenge results recorded',
      data: dailyChallengeResult
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Basic CRUD operations for questions

/**
 * @route POST /api/daily-challenge
 * @desc Add a new question
 * @access Private (admin)
 */
router.post('/', auth, async (req, res) => {
  try {
    const { topicId, question, options, correctAnswer, explanation } = req.body;
    
    // Validate topicId format
    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: 'Invalid topic ID format' });
    }
    
    // Check if topic exists
    const topicExists = await Topic.findById(topicId);
    if (!topicExists) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Validate required fields
    if (!question || !options || !correctAnswer || !explanation) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate options array
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'At least two options are required' });
    }
    
    // Validate correctAnswer exists in options
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ message: 'Correct answer must be included in the options' });
    }
    
    const newQuestion = new Question({
      topicId,
      question,
      options,
      correctAnswer,
      explanation
    });
    
    const savedQuestion = await newQuestion.save();
    
    // Return formatted question
    const formattedQuestion = {
      id: savedQuestion._id,
      topicId: savedQuestion.topicId,
      question: savedQuestion.question,
      options: savedQuestion.options,
      correctAnswer: savedQuestion.correctAnswer,
      explanation: savedQuestion.explanation
    };
    
    res.json(formattedQuestion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route PUT /api/questions/:id
 * @desc Update an existing question
 * @access Private (admin)
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { topicId, question, options, correctAnswer, explanation } = req.body;
    
    // Find and update the question
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          topicId: topicId,
          question: question,
          options: options,
          correctAnswer: correctAnswer,
          explanation: explanation
        }
      },
      { new: true } // Return the updated document
    );
    
    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Return formatted question
    const formattedQuestion = {
      id: updatedQuestion._id,
      topicId: updatedQuestion.topicId,
      question: updatedQuestion.question,
      options: updatedQuestion.options,
      correctAnswer: updatedQuestion.correctAnswer,
      explanation: updatedQuestion.explanation
    };
    
    res.json(formattedQuestion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route DELETE /api/questions/:id
 * @desc Delete a question
 * @access Private (admin)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    await question.remove();
    
    res.json({ message: 'Question deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
