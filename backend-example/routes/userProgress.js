
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Topic = require('../models/Topic');
const mongoose = require('mongoose');

/**
 * @route GET /api/users/:userId/progress
 * @desc Get overall user progress
 * @access Private
 */
router.get('/:userId/progress', auth, async (req, res) => {
  // Ensure user can only access their own progress
  if (req.user.id !== req.params.userId) {
    return res.status(401).json({ message: 'Not authorized to access this user data' });
  }
  
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const topics = await Topic.countDocuments();
    
    // Calculate progress data
    const progress = {
      topicsCompleted: user.progress.topicsCompleted,
      totalTopics: topics,
      averageScore: 0, // This would require additional logic to calculate from quiz results
      grandTestUnlocked: user.progress.grandTestUnlocked
    };
    
    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route PATCH /api/users/:userId/streak
 * @desc Update user streak
 * @access Private
 */
router.patch('/:userId/streak', auth, async (req, res) => {
  // Ensure user can only update their own streak
  if (req.user.id !== req.params.userId) {
    return res.status(401).json({ message: 'Not authorized to update this user data' });
  }
  
  try {
    const { streak } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { streak },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ success: true, streak: user.streak });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route PUT /api/users/:userId/topics/:topicId/progress
 * @desc Update topic progress for a specific user
 * @access Private
 */
router.put('/:userId/topics/:topicId/progress', auth, async (req, res) => {
  // Ensure user can only update their own progress
  if (req.user.id !== req.params.userId) {
    return res.status(401).json({ message: 'Not authorized to update this user data' });
  }
  
  try {
    const { completedQuestions, totalQuestions, score } = req.body;
    
    // Here we would update a UserTopicProgress collection that tracks per-topic progress
    // Since we don't have that model defined yet, we'll just update the overall count
    
    // If completion criteria met, increment topicsCompleted
    let updateOperation = {};
    if (completedQuestions >= totalQuestions * 0.7) { // 70% completion threshold
      updateOperation = {
        $inc: { 'progress.topicsCompleted': 1 }
      };
    }
    
    // Update user data
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updateOperation,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      success: true,
      topicsCompleted: user.progress.topicsCompleted
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route POST /api/users/:userId/unlock-grand-test
 * @desc Unlock the Grand Test for a user
 * @access Private
 */
router.post('/:userId/unlock-grand-test', auth, async (req, res) => {
  // Ensure user can only update their own data
  if (req.user.id !== req.params.userId) {
    return res.status(401).json({ message: 'Not authorized to update this user data' });
  }
  
  try {
    // Update user to unlock grand test
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { 'progress.grandTestUnlocked': true },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      grandTestUnlocked: user.progress.grandTestUnlocked 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
