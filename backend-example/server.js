
/**
 * This is an example Node.js/Express.js backend for the Aptitude Ace application.
 * 
 * NOTE: This file is not part of the Lovable project and should be used as a reference
 * for setting up your own separate backend project.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/auth');
const topicRoutes = require('./routes/topics');
const questionRoutes = require('./routes/questions');
const flashcardRoutes = require('./routes/flashcards');
const userProgressRoutes = require('./routes/userProgress');
const grandTestRoutes = require('./routes/grandTest');
const quizResultRoutes = require('./routes/quizResults');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/users', userProgressRoutes);
app.use('/api/users', flashcardRoutes);
app.use('/api/daily-challenge', questionRoutes);
app.use('/api/grand-test', grandTestRoutes);
app.use('/api/quiz-results', quizResultRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
