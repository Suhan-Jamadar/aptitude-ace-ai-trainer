
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 * @access Public
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      streak: 0,
      joinDate: new Date()
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        
        // Set token as HTTP-only cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        // Return user data without password
        const userResponse = {
          id: user._id,
          name: user.name,
          email: user.email,
          streak: user.streak,
          joinDate: user.joinDate
        };
        
        res.json({ user: userResponse, token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Authenticate user & get token
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        
        // Set token as HTTP-only cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        // Return user data without password
        const userResponse = {
          id: user._id,
          name: user.name,
          email: user.email,
          streak: user.streak,
          joinDate: user.joinDate
        };
        
        res.json({ user: userResponse, token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Public
 */
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
