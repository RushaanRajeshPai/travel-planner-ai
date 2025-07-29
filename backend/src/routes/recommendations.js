const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

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

// NEW ROUTE: Fetch image for a location
router.get('/get-image', verifyToken, async (req, res) => {
  try {
    const { location, title } = req.query;
    
    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Location parameter is required'
      });
    }

    const searchQuery = `${location} travel destination`;
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;

    const response = await fetch(unsplashUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Unsplash API');
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.regular;
      res.json({
        success: true,
        imageUrl: imageUrl,
        alt: data.results[0].alt_description || `${location} travel destination`
      });
    } else {
      // Fallback to a more generic search
      const fallbackQuery = location.split(',')[0]; // Just use city name
      const fallbackUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(fallbackQuery)}&per_page=1&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
      
      const fallbackResponse = await fetch(fallbackUrl);
      const fallbackData = await fallbackResponse.json();
      
      if (fallbackData.results && fallbackData.results.length > 0) {
        const imageUrl = fallbackData.results[0].urls.regular;
        res.json({
          success: true,
          imageUrl: imageUrl,
          alt: fallbackData.results[0].alt_description || `${location} travel destination`
        });
      } else {
        // Final fallback
        res.json({
          success: true,
          imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(fallbackQuery)},travel`,
          alt: `${location} travel destination`
        });
      }
    }

  } catch (error) {
    console.error('Error fetching image:', error);
    
    // Return fallback image
    const fallbackLocation = req.query.location.split(',')[0];
    res.json({
      success: true,
      imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(fallbackLocation)},travel`,
      alt: `${req.query.location} travel destination`
    });
  }
});

// Helper function to generate trips using Gemini AI
const generateTripsForMode = async (travelMode, count = 8) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Generate exactly ${count} unique travel trips for "${travelMode}" travel mode. 
    Each trip should be from a different country and specifically cater to ${travelMode.toLowerCase()} preferences.
    
    Return the response in this exact JSON format:
    {
      "trips": [
        {
          "title": "A trip title (max 60 characters)",
          "location": "City, Country",
          "description": "Brief description of why this trip is perfect for ${travelMode.toLowerCase()}"
        }
      ]
    }
    
    Requirements:
    - All ${count} trips must be from different countries
    - Titles should be catchy and engaging
    - Each trip should be specifically relevant to ${travelMode.toLowerCase()} travel
    - Focus on real, accessible destinations
    - Vary the geographical regions (Europe, Asia, Americas, Africa, Oceania)
    
    Travel mode context:
    - Relaxation: Spa resorts, beaches, peaceful retreats, wellness destinations
    - Trekking: Mountain trails, hiking adventures, nature walks, outdoor expeditions
    - Exploring Cultural Heritage: Historical sites, museums, ancient monuments, cultural experiences
    - Educational: Learning experiences, workshops, scientific sites, educational tours
    - Honeymoon: Romantic destinations, couple activities, luxury experiences, intimate settings`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    if (!parsedResponse.trips || !Array.isArray(parsedResponse.trips)) {
      throw new Error('Invalid trips format in response');
    }
    
    // Ensure we have exactly the requested count
    const trips = parsedResponse.trips.slice(0, count);
    
    // Validate each trip has required fields
    const validTrips = trips.filter(trip => 
      trip.title && trip.location && typeof trip.title === 'string' && typeof trip.location === 'string'
    );
    
    if (validTrips.length < count) {
      console.warn(`Only generated ${validTrips.length} valid trips out of ${count} requested for ${travelMode}`);
    }
    
    return validTrips;
    
  } catch (error) {
    console.error(`Error generating trips for ${travelMode}:`, error);
    
    // Fallback data in case of AI failure
    const fallbackTrips = {
      'Relaxation': [
        { title: 'Serene Maldives Overwater Villa Escape', location: 'Malé, Maldives' },
        { title: 'Bali Wellness Retreat & Spa Paradise', location: 'Ubud, Indonesia' },
        { title: 'Santorini Sunset Luxury Resort', location: 'Oia, Greece' },
        { title: 'Costa Rica Rainforest Wellness Lodge', location: 'Manuel Antonio, Costa Rica' },
        { title: 'Swiss Alps Thermal Spa Resort', location: 'St. Moritz, Switzerland' },
        { title: 'Seychelles Private Island Getaway', location: 'Praslin, Seychelles' },
        { title: 'Tuscany Countryside Villa Retreat', location: 'Chianti, Italy' },
        { title: 'Fiji Coral Coast Beach Resort', location: 'Coral Coast, Fiji' }
      ],
      'Trekking': [
        { title: 'Everest Base Camp Ultimate Adventure', location: 'Khumbu, Nepal' },
        { title: 'Inca Trail to Machu Picchu Trek', location: 'Cusco, Peru' },
        { title: 'Kilimanjaro Summit Challenge', location: 'Moshi, Tanzania' },
        { title: 'Patagonia Torres del Paine Circuit', location: 'Puerto Natales, Chile' },
        { title: 'Mont Blanc Alpine Crossing', location: 'Chamonix, France' },
        { title: 'Annapurna Circuit Himalayan Trek', location: 'Pokhara, Nepal' },
        { title: 'GR20 Corsica Mountain Adventure', location: 'Corsica, France' },
        { title: 'Milford Track New Zealand Wilderness', location: 'Fiordland, New Zealand' }
      ],
      'Exploring Cultural Heritage': [
        { title: 'Ancient Rome & Vatican Treasures', location: 'Rome, Italy' },
        { title: 'Egyptian Pyramids & Nile Journey', location: 'Cairo, Egypt' },
        { title: 'Angkor Wat Temple Complex Discovery', location: 'Siem Reap, Cambodia' },
        { title: 'Great Wall of China Historical Walk', location: 'Beijing, China' },
        { title: 'Petra Rose City Archaeological Wonder', location: 'Wadi Musa, Jordan' },
        { title: 'Kyoto Traditional Temples & Gardens', location: 'Kyoto, Japan' },
        { title: 'Machu Picchu Ancient Inca Citadel', location: 'Cusco, Peru' },
        { title: 'Istanbul Byzantine & Ottoman Heritage', location: 'Istanbul, Turkey' }
      ],
      'Educational': [
        { title: 'Galápagos Evolution & Wildlife Study', location: 'Galápagos Islands, Ecuador' },
        { title: 'CERN Particle Physics Discovery Tour', location: 'Geneva, Switzerland' },
        { title: 'NASA Space Center Exploration', location: 'Houston, USA' },
        { title: 'Amazon Rainforest Biodiversity Research', location: 'Manaus, Brazil' },
        { title: 'Archaeological Dig Experience Greece', location: 'Athens, Greece' },
        { title: 'Marine Biology Great Barrier Reef', location: 'Cairns, Australia' },
        { title: 'Astronomy Observatory Atacama Desert', location: 'San Pedro de Atacama, Chile' },
        { title: 'Renewable Energy Innovation Tour', location: 'Copenhagen, Denmark' }
      ],
      'Honeymoon': [
        { title: 'Maldives Romantic Overwater Bungalow', location: 'Malé, Maldives' },
        { title: 'Paris City of Love & Romance', location: 'Paris, France' },
        { title: 'Santorini Sunset Honeymoon Suite', location: 'Oia, Greece' },
        { title: 'Bali Couples Spa & Beach Resort', location: 'Seminyak, Indonesia' },
        { title: 'Seychelles Private Island Romance', location: 'La Digue, Seychelles' },
        { title: 'Tuscany Wine Country Romantic Escape', location: 'Chianti, Italy' },
        { title: 'Bora Bora Lagoon Luxury Resort', location: 'Bora Bora, French Polynesia' },
        { title: 'Kyoto Traditional Ryokan Experience', location: 'Kyoto, Japan' }
      ]
    };
    
    return fallbackTrips[travelMode] || fallbackTrips['Relaxation'].slice(0, count);
  }
};

// Get recommendations based on user's travel mode
router.get('/get-recommendations', verifyToken, async (req, res) => {
  try {
    // Find user by ID from JWT token
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userTravelMode = user.travelMode;
    const allTravelModes = ['Relaxation', 'Trekking', 'Exploring Cultural Heritage', 'Educational', 'Honeymoon'];
    
    // Get other travel modes (excluding user's favorite)
    const otherTravelModes = allTravelModes.filter(mode => mode !== userTravelMode);

    try {
      // Generate trips for user's favorite travel mode
      console.log(`Generating trips for user's favorite mode: ${userTravelMode}`);
      const favoriteTrips = await generateTripsForMode(userTravelMode, 8);

      // Generate trips for other travel modes
      const otherTrips = {};
      
      for (const mode of otherTravelModes) {
        console.log(`Generating trips for mode: ${mode}`);
        otherTrips[mode] = await generateTripsForMode(mode, 8);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      res.json({
        success: true,
        userTravelMode,
        favoriteTrips,
        otherTrips,
        message: 'Recommendations generated successfully'
      });

    } catch (aiError) {
      console.error('AI generation error:', aiError);
      
      // Return error response
      res.status(500).json({
        success: false,
        message: 'Failed to generate AI recommendations. Please try again later.',
        error: aiError.message
      });
    }

  } catch (error) {
    console.error('Error in get-recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Refresh recommendations (regenerate all trips)
router.post('/refresh-recommendations', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userTravelMode = user.travelMode;
    const allTravelModes = ['Relaxation', 'Trekking', 'Exploring Cultural Heritage', 'Educational', 'Honeymoon'];
    const otherTravelModes = allTravelModes.filter(mode => mode !== userTravelMode);

    // Regenerate all trips
    const favoriteTrips = await generateTripsForMode(userTravelMode, 8);
    const otherTrips = {};
    
    for (const mode of otherTravelModes) {
      otherTrips[mode] = await generateTripsForMode(mode, 8);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    res.json({
      success: true,
      userTravelMode,
      favoriteTrips,
      otherTrips,
      message: 'Recommendations refreshed successfully'
    });

  } catch (error) {
    console.error('Error refreshing recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh recommendations',
      error: error.message
    });
  }
});

module.exports = router;