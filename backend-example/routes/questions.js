
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Question = require('../models/Question');

/**
 * @route GET /api/daily-challenge
 * @desc Get daily challenge questions
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    // Logic to fetch or generate daily challenge
    // For now, we'll randomly select 5 questions from the database
    const count = await Question.countDocuments();
    const random = Math.floor(Math.random() * (count - 5));
    
    const dailyQuestions = await Question.find()
      .skip(random)
      .limit(5);
    
    // You might want to implement logic to ensure the same user 
    // gets the same questions for a given day
    
    res.json(dailyQuestions);
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
    
    // Here you would typically save these results to a DailyChallenge model
    // For now, we'll just return success since we haven't defined that model yet
    
    res.json({ 
      success: true,
      message: 'Daily challenge results recorded',
      data: { score, timeSpent, questionsAttempted, correctAnswers }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route POST /api/daily-challenge
 * @desc Admin route to add a new daily challenge question
 * @access Private (admin)
 */
router.post('/', auth, async (req, res) => {
  try {
    const { topicId, question, options, correctAnswer, explanation } = req.body;
    
    const newQuestion = new Question({
      topicId,
      question,
      options,
      correctAnswer,
      explanation
    });
    
    const savedQuestion = await newQuestion.save();
    res.json(savedQuestion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
