const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'User not authenticated'
  });
};

// GET /api/user/profile - Fetch user's profile information
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    
    // Find user by ID and select only necessary fields
    const user = await User.findById(userId).select('firstName lastName fullName email');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Construct full name if not stored as a single field
    let fullName = user.fullName;
    if (!fullName && user.firstName && user.lastName) {
      fullName = `${user.firstName} ${user.lastName}`;
    } else if (!fullName && user.firstName) {
      fullName = user.firstName;
    } else if (!fullName) {
      fullName = 'User'; 
    }

    res.json({
      success: true,
      fullName: fullName,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;