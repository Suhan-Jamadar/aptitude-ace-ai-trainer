
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Topic = require('../models/Topic');
const Question = require('../models/Question');

/**
 * @route GET /api/topics
 * @desc Get all topics
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find().sort({ name: 1 });
    res.json(topics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route GET /api/topics/:id
 * @desc Get topic by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(topic);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.status(500).send('Server Error');
  }
});

/**
 * @route POST /api/topics
 * @desc Create a new topic
 * @access Private (admin only)
 */
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, icon, totalQuestions, isUnlocked } = req.body;
    
    // Create new topic
    const newTopic = new Topic({
      name,
      description,
      icon,
      totalQuestions,
      isUnlocked: isUnlocked || true
    });
    
    const topic = await newTopic.save();
    res.json(topic);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route PUT /api/topics/:id
 * @desc Update a topic
 * @access Private (admin only)
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    res.json(topic);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.status(500).send('Server Error');
  }
});

/**
 * @route DELETE /api/topics/:id
 * @desc Delete a topic
 * @access Private (admin only)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find and delete the topic
    const topic = await Topic.findById(req.params.id);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    await Topic.findByIdAndRemove(req.params.id);
    
    // Also delete all questions associated with this topic
    await Question.deleteMany({ topicId: req.params.id });
    
    res.json({ message: 'Topic and associated questions removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.status(500).send('Server Error');
  }
});

/**
 * @route GET /api/topics/:topicId/questions
 * @desc Get questions for a specific topic
 * @access Public
 */
router.get('/:topicId/questions', async (req, res) => {
  try {
    const questions = await Question.find({ topicId: req.params.topicId });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
