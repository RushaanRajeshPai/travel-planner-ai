const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Agent 1: Input Processing Agent
class InputProcessingAgent {
  static async processInputs(location, spotType) {
    try {
      // Validate inputs
      if (!location || !spotType) {
        throw new Error('Location and spot type are required');
      }

      // Clean and format inputs
      const cleanLocation = location.trim();
      const cleanSpotType = spotType.trim();

      // Validate spot type against allowed types
      const allowedTypes = [
        'Clubs and Nightlife',
        'Sports Stadiums',
        'Trendy Bars',
        'Local Restaurants',
        'Promenades',
        'Shopping Streets and Malls',
        'Forts and Monuments',
        'Beaches'
      ];

      if (!allowedTypes.includes(cleanSpotType)) {
        throw new Error('Invalid spot type selected');
      }

      return {
        success: true,
        location: cleanLocation,
        spotType: cleanSpotType,
        searchQuery: `popular ${cleanSpotType.toLowerCase()} in ${cleanLocation} with high google ratings and reviews`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Agent 2: Popular Spots Search Agent
class PopularSpotsSearchAgent {
  static async searchPopularSpots(location, spotType) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
        You are a travel expert AI assistant. Find the most popular ${spotType} in ${location} based on the following criteria:
        
        1. ONLY include places that are specifically ${spotType}
        2. ONLY include places located in ${location}
        3. ONLY include places with high Google ratings (4.0+ stars) and many reviews (100+ reviews)
        4. Focus on the most popular and well-reviewed establishments
        
        For each spot, provide the following information in JSON format:
        - name: The exact name of the establishment
        - rating: Google rating (out of 5)
        - reviewCount: Approximate number of Google reviews
        - address: Full address if available
        - description: Brief description of what makes it popular (2-3 sentences max)
        - priceLevel: Price range (Budget/Moderate/Expensive/Luxury) if applicable
        - googleUrl: Generate a Google search URL for this specific place using the format: https://www.google.com/search?q=PLACE_NAME+LOCATION (URL encode the query)
        
        Return ONLY a valid JSON array with maximum 12 spots. If no popular ${spotType} are found in ${location}, return an empty array [].
        
        Example format:
        [
          {
            "name": "Example Place Name",
            "rating": 4.5,
            "reviewCount": "2,500+",
            "address": "123 Example Street, City",
            "description": "Popular local spot known for excellent food and atmosphere.",
            "priceLevel": "Moderate",
            "googleUrl": "https://www.google.com/search?q=Example+Place+Name+City+Location"
          }
        ]
        
        IMPORTANT: 
        - Return ONLY the JSON array, no additional text
        - Ensure all spots are actually ${spotType} and located in ${location}
        - Focus on places with genuine high ratings and review counts
        - Make sure to include the googleUrl field for each spot with proper URL encoding
        - If you're not confident about a place's popularity or location, don't include it
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean and parse the JSON response
      let cleanedText = text.trim();
      
      // Remove any markdown formatting
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Try to parse the JSON
      let spots;
      try {
        spots = JSON.parse(cleanedText);
      } catch (parseError) {
        // If direct parsing fails, try to extract JSON array from the text
        const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          spots = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON response from AI');
        }
      }

      // Validate the response is an array
      if (!Array.isArray(spots)) {
        throw new Error('AI response is not an array');
      }

      return {
        success: true,
        spots: spots.slice(0, 12) // Limit to 12 spots maximum
      };
    } catch (error) {
      console.error('Error in PopularSpotsSearchAgent:', error);
      return {
        success: false,
        error: 'Failed to fetch popular spots',
        spots: []
      };
    }
  }
}

// Agent 3: Results Formatting Agent
class ResultsFormattingAgent {
  static formatResults(spots, location, spotType) {
    try {
      if (!spots || spots.length === 0) {
        return {
          success: true,
          message: `No ${spotType} found in ${location}`,
          spots: [],
          count: 0
        };
      }

      // Validate and clean each spot
      const formattedSpots = spots.map(spot => {
        // Generate Google URL if not provided or invalid
        let googleUrl = spot.googleUrl;
        if (!googleUrl || !googleUrl.startsWith('https://www.google.com/search?q=')) {
          const searchQuery = encodeURIComponent(`${spot.name} ${location}`);
          googleUrl = `https://www.google.com/search?q=${searchQuery}`;
        }

        return {
          name: spot.name || 'Unknown Place',
          rating: parseFloat(spot.rating) || 0,
          reviewCount: spot.reviewCount || 'N/A',
          address: spot.address || '',
          description: spot.description || '',
          priceLevel: spot.priceLevel || '',
          googleUrl: googleUrl
        };
      }).filter(spot => spot.name !== 'Unknown Place' && spot.rating > 0);

      return {
        success: true,
        spots: formattedSpots,
        count: formattedSpots.length,
        location,
        spotType
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to format results',
        spots: []
      };
    }
  }
}

// Main AI Agent Workflow Controller
class PopularSpotsWorkflow {
  static async execute(location, spotType) {
    try {
      // Agent 1: Process inputs
      const inputResult = await InputProcessingAgent.processInputs(location, spotType);
      if (!inputResult.success) {
        return {
          success: false,
          message: inputResult.error,
          spots: []
        };
      }

      // Agent 2: Search for popular spots
      const searchResult = await PopularSpotsSearchAgent.searchPopularSpots(
        inputResult.location,
        inputResult.spotType
      );

      if (!searchResult.success) {
        return {
          success: false,
          message: searchResult.error,
          spots: []
        };
      }

      // Agent 3: Format and return results
      const finalResult = ResultsFormattingAgent.formatResults(
        searchResult.spots,
        inputResult.location,
        inputResult.spotType
      );

      return finalResult;
    } catch (error) {
      console.error('Error in PopularSpotsWorkflow:', error);
      return {
        success: false,
        message: 'Internal server error occurred',
        spots: []
      };
    }
  }
}

// Route handler
router.post('/spots', async (req, res) => {
  try {
    const { location, spotType } = req.body;

    // Validate required fields
    if (!location || !spotType) {
      return res.status(400).json({
        success: false,
        message: 'Location and spot type are required',
        spots: []
      });
    }

    // Execute the AI agent workflow
    const result = await PopularSpotsWorkflow.execute(location, spotType);

    // Return the result
    res.json(result);
  } catch (error) {
    console.error('Error in popular spots route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      spots: []
    });
  }
});

// Health check route for the popular spots service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Popular spots service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;