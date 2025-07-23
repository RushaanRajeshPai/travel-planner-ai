const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Agent 1: Input Processing Agent
class InputProcessingAgent {
  constructor() {
    this.name = 'InputProcessingAgent';
  }

  async process(location, spotType) {
    // Validate and clean inputs
    const cleanedLocation = location.trim();
    const validSpotTypes = [
      'Clubs and Nightlife',
      'Sports Stadiums', 
      'Local Restobars',
      'Promenades',
      'Shopping Streets and Malls',
      'Forts and Monuments',
      'Beaches'
    ];

    if (!validSpotTypes.includes(spotType)) {
      throw new Error('Invalid spot type selected');
    }

    if (!cleanedLocation || cleanedLocation.length < 2) {
      throw new Error('Please provide a valid location');
    }

    return {
      location: cleanedLocation,
      spotType: spotType,
      searchQuery: `hidden niche ${spotType.toLowerCase()} in ${cleanedLocation} with less than 200 reviews good rating local secrets reddit quora mentions`
    };
  }
}

// Agent 2: Hidden Gems Discovery Agent
class HiddenGemsDiscoveryAgent {
  constructor() {
    this.name = 'HiddenGemsDiscoveryAgent';
    this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async searchHiddenGems(processedInput) {
    const { location, spotType } = processedInput;
    
    const prompt = `You are a local travel expert specializing in discovering hidden gems and niche spots. 

TASK: Find hidden/niche ${spotType} in ${location} that meet these STRICT criteria:
1. Have LESS than 200 Google reviews 
2. Have good Google ratings
3. Could also be mentioned as "hidden spots", "local secrets", "less crowded", or "off the beaten path" (not necessary but helpful)
4. Could have mentions on niche platforms like Reddit, Quora (not necessary but helpful)
5. Are genuinely lesser-known compared to mainstream tourist spots

IMPORTANT REQUIREMENTS:
- Only suggest REAL places that exist in ${location}
- Focus on authentic, lesser-known ${spotType.toLowerCase()}
- Prioritize places locals recommend but tourists rarely visit
- Each place must have fewer than 200 reviews to qualify as "hidden"

Please provide EXACTLY 6-9 hidden gems (if available) in this JSON format:
{
  "spots": [
    {
      "name": "Exact name of the place",
      "description": "Brief description highlighting what makes it special and hidden",
      "address": "Specific address or area in ${location}",
      "rating": "4.2",
      "reviewCount": "87",
      "hiddenReason": "Why this place is considered hidden (e.g., 'Local favorite mentioned on Reddit', 'Hidden gem with only 50 reviews')",
      "bestTime": "Best time to visit to avoid crowds"
    }
  ]
}

If you cannot find any genuine hidden ${spotType.toLowerCase()} in ${location} that meet the criteria (especially the <200 reviews requirement), return:
{
  "spots": [],
  "message": "No hidden ${spotType.toLowerCase()} found in ${location} matching the criteria"
}

`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error in Hidden Gems Discovery Agent:', error);
      throw new Error('Failed to discover hidden gems. Please try again.');
    }
  }
}

// Agent 3: Results Formatting Agent
class ResultsFormattingAgent {
  constructor() {
    this.name = 'ResultsFormattingAgent';
  }

  async formatResults(discoveryResults, location, spotType) {
    if (!discoveryResults.spots || discoveryResults.spots.length === 0) {
      return {
        success: true,
        spots: [],
        message: `No ${spotType} found in ${location}`,
        location: location,
        spotType: spotType
      };
    }

    // Format and validate each spot
    const formattedSpots = discoveryResults.spots.map(spot => ({
      name: spot.name || 'Unknown Place',
      description: spot.description || 'A hidden gem waiting to be discovered',
      address: spot.address || `${location}`,
      rating: spot.rating || null,
      reviewCount: spot.reviewCount || null,
      hiddenReason: spot.hiddenReason || 'Local hidden spot',
      bestTime: spot.bestTime || 'Anytime'
    }));

    return {
      success: true,
      spots: formattedSpots,
      location: location,
      spotType: spotType,
      totalFound: formattedSpots.length
    };
  }
}

// AI Agentic Workflow Orchestrator
class HiddenGemsWorkflow {
  constructor() {
    this.inputAgent = new InputProcessingAgent();
    this.discoveryAgent = new HiddenGemsDiscoveryAgent();
    this.formattingAgent = new ResultsFormattingAgent();
  }

  async execute(location, spotType) {
    try {
      console.log('🤖 Starting Hidden Gems AI Workflow...');
      
      // Agent 1: Process inputs
      console.log('📝 Agent 1: Processing inputs...');
      const processedInput = await this.inputAgent.process(location, spotType);
      console.log('✅ Input processing complete');

      // Agent 2: Discover hidden gems
      console.log('🔍 Agent 2: Discovering hidden gems...');
      const discoveryResults = await this.discoveryAgent.searchHiddenGems(processedInput);
      console.log(`✅ Discovery complete - Found ${discoveryResults.spots?.length || 0} potential spots`);

      // Agent 3: Format results
      console.log('🎨 Agent 3: Formatting results...');
      const finalResults = await this.formattingAgent.formatResults(
        discoveryResults, 
        location, 
        spotType
      );
      console.log('✅ Results formatting complete');

      return finalResults;
    } catch (error) {
      console.error('❌ Workflow error:', error);
      throw error;
    }
  }
}

// API Endpoint
router.post('/find-hidden-gems', async (req, res) => {
  try {
    const { location, spotType } = req.body;

    // Validate required fields
    if (!location || !spotType) {
      return res.status(400).json({
        success: false,
        message: 'Location and spot type are required'
      });
    }

    // Check if Gemini API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'AI service is not configured. Please contact support.'
      });
    }

    // Execute the AI workflow
    const workflow = new HiddenGemsWorkflow();
    const results = await workflow.execute(location, spotType);

    res.json(results);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong while finding hidden gems'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Hidden Gems service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;