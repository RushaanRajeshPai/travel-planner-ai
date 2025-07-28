const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendWelcomeEmail, verifyEmailExists } = require('../services/emailService');
const countries = require('../data/countries');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register new user
const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { fullName, email, password, nationality, gender, age, travelMode } = req.body;

    // Check if email exists
    const emailExists = await verifyEmailExists(email);
    if (!emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Enter correct email id'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      password,
      nationality,
      gender,
      age: parseInt(age),
      travelMode
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Send welcome email
    await sendWelcomeEmail(email, fullName);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        nationality: user.nationality,
        gender: user.gender,
        age: user.age,
        travelMode: user.travelMode
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    req.login(user, (err) => {
  if (err) {
    return res.status(500).json({ success: false, message: 'Login failed' });
  }

  const token = generateToken(user._id); // Optional, if you're using JWT elsewhere

  return res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      nationality: user.nationality,
      gender: user.gender,
      age: user.age,
      travelMode: user.travelMode
    }
  });
});

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        nationality: user.nationality,
        gender: user.gender,
        age: user.age,
        travelMode: user.travelMode
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Get countries list
const getCountries = async (req, res) => {
  try {
    res.json({
      success: true,
      countries
    });
  } catch (error) {
    console.error('Get countries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Google OAuth callback
const googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth/error`);
  }
};

module.exports = {
  register,
  login,
  getCountries,
  googleCallback
};