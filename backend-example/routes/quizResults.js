
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const Topic = require('../models/Topic');

/**
 * @route POST /api/quiz-results
 * @desc Submit quiz results
 * @access Private
 */
router.post('/', auth, async (req, res) => {
  try {
    const { userId, topicId, score, timeSpent, questionsAttempted, correctAnswers, performance } = req.body;
    
    // Ensure user can only submit their own results
    if (req.user.id !== userId) {
      return res.status(401).json({ message: 'Not authorized to submit results for this user' });
    }
    
    // Create new quiz result
    const quizResult = new QuizResult({
      user: userId,
      topic: topicId,
      score,
      timeSpent,
      questionsAttempted,
      correctAnswers,
      performance: performance || {}
    });
    
    // Save to database
    await quizResult.save();
    
    res.json({ 
      success: true,
      message: 'Quiz results recorded successfully',
      data: quizResult
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route GET /api/quiz-results/:userId
 * @desc Get all quiz results for a user
 * @access Private
 */
router.get('/:userId', auth, async (req, res) => {
  try {
    // Ensure user can only view their own results
    if (req.user.id !== req.params.userId) {
      return res.status(401).json({ message: 'Not authorized to view results for this user' });
    }
    
    const quizResults = await QuizResult.find({ user: req.params.userId })
      .populate('topic', 'name')
      .sort({ date: -1 });
      
    res.json(quizResults);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route GET /api/quiz-results/:userId/topics/:topicId
 * @desc Get quiz results for a specific topic and user
 * @access Private
 */
router.get('/:userId/topics/:topicId', auth, async (req, res) => {
  try {
    // Ensure user can only view their own results
    if (req.user.id !== req.params.userId) {
      return res.status(401).json({ message: 'Not authorized to view results for this user' });
    }
    
    const quizResults = await QuizResult.find({ 
      user: req.params.userId,
      topic: req.params.topicId
    }).sort({ date: -1 });
      
    res.json(quizResults);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
