const express = require('express');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const countries = require('../data/countries');

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    req.user = user;
    next();
  });
};

// Route to get user's nationality and all countries
router.get('/user-nationality', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('nationality');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        userNationality: user.nationality,
        countries: countries
      }
    });
  } catch (error) {
    console.error('Error fetching user nationality:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Route to get travel advisory URL
router.post('/get-advisory-url', authenticateToken, async (req, res) => {
  try {
    const { destinationCountry } = req.body;
    
    if (!destinationCountry) {
      return res.status(400).json({
        success: false,
        message: 'Destination country is required'
      });
    }

    // Get user's nationality
    const user = await User.findById(req.user.userId).select('nationality');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userNationality = user.nationality;

    // Use Gemini AI to find the official travel advisory URL
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Find the official government travel advisory website URL for ${userNationality} citizens traveling to ${destinationCountry}. 
    
    Please provide ONLY the official government website URL (like foreign ministry, embassy, or official government travel advisory site) that shows travel advisories for ${userNationality} citizens visiting ${destinationCountry}.
    
    Do not provide any explanation, just the direct URL. The URL should be the official government source for travel advisories.
    
    Examples of what I'm looking for:
    - For US citizens: state.gov travel advisories
    - For UK citizens: gov.uk travel advice
    - For Canadian citizens: travel.gc.ca
    - For Australian citizens: smartraveller.gov.au
    
    Return ONLY the URL, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const advisoryUrl = response.text().trim();

    // Basic URL validation
    if (!advisoryUrl || (!advisoryUrl.startsWith('http://') && !advisoryUrl.startsWith('https://'))) {
      return res.status(500).json({
        success: false,
        message: 'Could not find a valid travel advisory URL'
      });
    }

    res.json({
      success: true,
      data: {
        advisoryUrl: advisoryUrl,
        userNationality: userNationality,
        destinationCountry: destinationCountry
      }
    });

  } catch (error) {
    console.error('Error generating travel advisory URL:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating travel advisory URL'
    });
  }
});

module.exports = router;