const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || 
                req.cookies?.token;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// Alternative middleware for session-based auth (for users who logged in via Google)
const requireAuth = (req, res, next) => {
  // First try JWT token
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userId: decoded.userId };
      return next();
    } catch (error) {
      // Token invalid, try session
    }
  }

  // Try session-based auth
  if (req.isAuthenticated && req.isAuthenticated()) {
    req.user = { userId: req.user._id };
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Authentication required'
  });
};

// Get user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
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
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { fullName, nationality, gender, age, travelMode } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        fullName,
        nationality,
        gender,
        age: parseInt(age),
        travelMode
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
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
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;