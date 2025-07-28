const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify JWT token from cookies or Authorization header
const authenticateToken = (req, res, next) => {
  // Try to get token from cookies first
  let token = req.cookies.token || req.cookies.authToken || req.cookies.jwt;
  
  // If not in cookies, try Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // Debug logging (remove in production)
  console.log('Available cookies:', Object.keys(req.cookies));
  console.log('Authorization header:', req.headers.authorization);
  console.log('Token found:', !!token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
      debug: {
        cookies: Object.keys(req.cookies),
        hasAuthHeader: !!req.headers.authorization
      }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
      error: error.message
    });
  }
};

// GET /api/dashboard/profile - Fetch user profile information
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -googleId -__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Format the response data
    const userInfo = {
      fullName: user.fullName,
      email: user.email,
      gender: user.gender,
      age: user.age,
      nationality: user.nationality,
      travelMode: user.travelMode,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      user: userInfo
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/dashboard/update-travel-mode - Update user's favorite travel mode
router.put('/update-travel-mode', authenticateToken, async (req, res) => {
  try {
    const { travelMode } = req.body;

    // Validate travel mode
    const validTravelModes = [
      'Relaxation', 
      'Trekking', 
      'Exploring Cultural Heritage', 
      'Educational', 
      'Honeymoon'
    ];

    if (!travelMode || !validTravelModes.includes(travelMode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid travel mode. Please select a valid option.'
      });
    }

    // Update user's travel mode
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { travelMode: travelMode },
      { new: true, runValidators: true }
    ).select('-password -googleId -__v');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Travel mode updated successfully',
      user: {
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        gender: updatedUser.gender,
        age: updatedUser.age,
        nationality: updatedUser.nationality,
        travelMode: updatedUser.travelMode,
        isEmailVerified: updatedUser.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Error updating travel mode:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/dashboard/stats - Get user statistics (optional endpoint for future use)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('createdAt');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const memberSince = user.createdAt;
    const daysSinceMember = Math.floor((new Date() - memberSince) / (1000 * 60 * 60 * 24));

    res.status(200).json({
      success: true,
      stats: {
        memberSince: memberSince,
        daysSinceMember: daysSinceMember
      }
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;