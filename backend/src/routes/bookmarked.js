const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Get all bookmarked trips for the user
router.get('/get-bookmarked-trips', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const bookmarkedTrips = user.bookmarkedTrips || [];

    res.json({
      success: true,
      bookmarkedTrips: bookmarkedTrips.sort((a, b) => new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt)), // Sort by most recent
      totalCount: bookmarkedTrips.length,
      message: 'Bookmarked trips retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching bookmarked trips:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Remove a trip from bookmarks
router.delete('/remove-bookmark', verifyToken, async (req, res) => {
  try {
    const { title, location } = req.body;
    
    if (!title || !location) {
      return res.status(400).json({
        success: false,
        message: 'Title and location are required'
      });
    }

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find the bookmark to remove
    const bookmarkIndex = user.bookmarkedTrips.findIndex(
      trip => trip.title === title && trip.location === location
    );

    if (bookmarkIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Bookmarked trip not found'
      });
    }

    // Remove the bookmark
    const removedTrip = user.bookmarkedTrips[bookmarkIndex];
    user.bookmarkedTrips.splice(bookmarkIndex, 1);
    
    await user.save();

    res.json({
      success: true,
      message: 'Trip removed from bookmarks successfully',
      removedTrip: {
        title: removedTrip.title,
        location: removedTrip.location
      },
      remainingBookmarks: user.bookmarkedTrips.length
    });

  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove bookmark',
      error: error.message
    });
  }
});

// Clear all bookmarks for the user
router.delete('/clear-all-bookmarks', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const bookmarkCount = user.bookmarkedTrips.length;
    user.bookmarkedTrips = [];
    
    await user.save();

    res.json({
      success: true,
      message: `All ${bookmarkCount} bookmarks cleared successfully`,
      clearedCount: bookmarkCount
    });

  } catch (error) {
    console.error('Error clearing bookmarks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear bookmarks',
      error: error.message
    });
  }
});

// Get bookmarks grouped by travel mode
router.get('/get-bookmarks-by-mode', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const bookmarkedTrips = user.bookmarkedTrips || [];
    
    // Group bookmarks by travel mode
    const groupedBookmarks = bookmarkedTrips.reduce((acc, trip) => {
      if (!acc[trip.travelMode]) {
        acc[trip.travelMode] = [];
      }
      acc[trip.travelMode].push(trip);
      return acc;
    }, {});

    // Sort each group by most recent
    Object.keys(groupedBookmarks).forEach(mode => {
      groupedBookmarks[mode].sort((a, b) => new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt));
    });

    res.json({
      success: true,
      groupedBookmarks,
      totalCount: bookmarkedTrips.length,
      message: 'Bookmarked trips grouped by travel mode retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching grouped bookmarks:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;