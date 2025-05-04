
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Question = require('../models/Question');

/**
 * @route GET /api/grand-test/questions
 * @desc Get questions for the Grand Test
 * @access Private
 */
router.get('/questions', auth, async (req, res) => {
  try {
    // Verify user has unlocked the grand test
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.progress.grandTestUnlocked) {
      return res.status(403).json({ 
        message: 'Grand Test not unlocked yet. Complete more topics first.' 
      });
    }
    
    // Get questions from different topics for the grand test
    // For now, we'll select 20 questions randomly from across all topics
    const questions = await Question.aggregate([
      { $sample: { size: 20 } }
    ]);
    
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route POST /api/grand-test/results
 * @desc Submit Grand Test results
 * @access Private
 */
router.post('/results', auth, async (req, res) => {
  try {
    const { score, timeSpent, questionsAttempted, correctAnswers } = req.body;
    
    // Here you would typically save these results to a GrandTestResult model
    // For now, we'll just return success since we haven't defined that model yet
    
    res.json({ 
      success: true,
      message: 'Grand test results recorded',
      data: { 
        userId: req.user.id,
        score, 
        timeSpent, 
        date: new Date(),
        questionsAttempted, 
        correctAnswers 
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
