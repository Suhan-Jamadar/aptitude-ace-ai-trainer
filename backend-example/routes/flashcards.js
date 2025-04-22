const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Flashcard = require('../models/Flashcard');
const multer = require('multer');
const { generateFlashcardContent } = require('../controllers/geminiController');

// Configure multer for file upload
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Generate flashcard from uploaded file
router.post('/:userId/flashcards/generate', auth, upload.single('file'), async (req, res) => {
  try {
    const { title } = req.body;
    const { buffer } = req.file;
    
    // Convert buffer to text
    const text = buffer.toString('utf-8');
    
    // Generate content using Gemini API
    const generatedContent = await generateFlashcardContent(text, title);
    
    // Create new flashcard
    const flashcard = new Flashcard({
      user: req.params.userId,
      title,
      content: generatedContent,
      originalText: text,
      aiGenerated: true,
      dateCreated: new Date(),
      isRead: false
    });

    await flashcard.save();
    res.json(flashcard);
  } catch (error) {
    console.error('Error generating flashcard:', error);
    res.status(500).json({ message: 'Error generating flashcard' });
  }
});

// Get all flashcards for a user
router.get('/:userId/flashcards', auth, async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ user: req.params.userId }).sort({ dateCreated: -1 });
    res.json(flashcards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new flashcard
router.post('/:userId/flashcards', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newFlashcard = new Flashcard({
      user: req.params.userId,
      title,
      content,
      originalText: content,
      aiGenerated: false
    });
    const flashcard = await newFlashcard.save();
    res.json(flashcard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a flashcard
router.patch('/:userId/flashcards/:id', auth, async (req, res) => {
  try {
    const flashcard = await Flashcard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    res.json(flashcard);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Delete a flashcard
router.delete('/:userId/flashcards/:id', auth, async (req, res) => {
  try {
    const flashcard = await Flashcard.findByIdAndDelete(req.params.id);
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    res.json({ message: 'Flashcard deleted' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
