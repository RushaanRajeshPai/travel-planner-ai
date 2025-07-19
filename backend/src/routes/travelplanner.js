const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

async function fetchUnsplashImages(destination, count = 5) {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: destination,
        per_page: count,
        orientation: 'landscape'
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });
    return response.data.results.map(photo => photo.urls.regular);
  } catch (error) {
    console.error('Unsplash fetch error:', error.message);
    return [];
  }
}

// Agent 1: Input Processing Agent
class InputProcessingAgent {
  constructor() {
    this.name = 'InputProcessingAgent';
  }

  async processInputs(destination, travelType, numberOfPeople, numberOfDays, budget) {
    try {
      console.log(`Agent 1: Processing inputs - Destination: ${destination}, Travel Type: ${travelType}, People: ${numberOfPeople}, Days: ${numberOfDays}`);
      
      // Validate inputs
      if (!destination || !travelType || !numberOfPeople || !numberOfDays) {
        throw new Error('All inputs are required');
      }

      const processedData = {
        destination: destination.trim(),
        travelType: travelType.toLowerCase(),
        numberOfPeople: parseInt(numberOfPeople),
        numberOfDays: parseInt(numberOfDays),
        budget: parseFloat(budget),
        timestamp: new Date().toISOString()
      };

      console.log('Agent 1: Inputs processed successfully');
      return processedData;
    } catch (error) {
      console.error('Agent 1 Error:', error.message);
      throw error;
    }
  }
}

// Agent 2: Data Extraction Agent
class DataExtractionAgent {
  constructor() {
    this.name = 'DataExtractionAgent';
    this.foursquareApiKey = process.env.FOURSQUARE_API_KEY;
  }

  async extractDestinationData(destination, travelType) {
    try {
      console.log(`Agent 2: Extracting data for ${destination} with travel type: ${travelType}`);
      
      // Get coordinates for the destination
      const coordinates = await this.getCoordinates(destination);
      
      // Extract different types of data
      const [touristSpots, restaurants, hotels, resorts, villas] = await Promise.all([
        this.getTouristSpots(coordinates, travelType),
        this.getRestaurants(coordinates),
        this.getHotels(coordinates),
        this.getResorts(coordinates),
        this.getVillas(coordinates)
      ]);

      const extractedData = {
        destination,
        coordinates,
        touristSpots,
        restaurants,
        housing: {
          hotels,
          resorts,
          villas
        }
      };

      console.log('Agent 2: Data extraction completed');
      return extractedData;
    } catch (error) {
      console.error('Agent 2 Error:', error.message);
      throw error;
    }
  }

  async getCoordinates(destination) {
    try {
      const response = await axios.get('https://api.foursquare.com/v3/geocode', {
        headers: {
          'Authorization': this.foursquareApiKey,
          'Accept': 'application/json'
        },
        params: {
          address: destination,
          limit: 1
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        const location = response.data.results[0].geocodes.main;
        return {
          lat: location.latitude,
          lng: location.longitude
        };
      }
      
      // Fallback coordinates if geocoding fails
      return { lat: 0, lng: 0 };
    } catch (error) {
      console.error('Geocoding error:', error.message);
      return { lat: 0, lng: 0 };
    }
  }

  async getTouristSpots(coordinates, travelType) {
    try {
      const categoryMapping = {
        'relaxation': '16000,17000',
        'exploring cultural heritage': '12000,10000',
        'trekking': '16000,18000',
        'educational': '12000,10000',
        'honeymoon': '16000,17000'
      };

      const categories = categoryMapping[travelType] || '16000,12000';
      
      const response = await axios.get('https://api.foursquare.com/v3/places/search', {
        headers: {
          'Authorization': this.foursquareApiKey,
          'Accept': 'application/json'
        },
        params: {
          ll: `${coordinates.lat},${coordinates.lng}`,
          categories: categories,
          limit: 20,
          radius: 10000
        }
      });

      return response.data.results || [];
    } catch (error) {
      console.error('Tourist spots error:', error.message);
      return [];
    }
  }

  async getRestaurants(coordinates) {
    try {
      const response = await axios.get('https://api.foursquare.com/v3/places/search', {
        headers: {
          'Authorization': this.foursquareApiKey,
          'Accept': 'application/json'
        },
        params: {
          ll: `${coordinates.lat},${coordinates.lng}`,
          categories: '13000',
          limit: 15,
          radius: 5000
        }
      });

      return response.data.results || [];
    } catch (error) {
      console.error('Restaurants error:', error.message);
      return [];
    }
  }

  async getHotels(coordinates) {
    try {
      const response = await axios.get('https://api.foursquare.com/v3/places/search', {
        headers: {
          'Authorization': this.foursquareApiKey,
          'Accept': 'application/json'
        },
        params: {
          ll: `${coordinates.lat},${coordinates.lng}`,
          categories: '19014',
          limit: 10,
          radius: 10000
        }
      });

      return response.data.results || [];
    } catch (error) {
      console.error('Hotels error:', error.message);
      return [];
    }
  }

  async getResorts(coordinates) {
    try {
      const response = await axios.get('https://api.foursquare.com/v3/places/search', {
        headers: {
          'Authorization': this.foursquareApiKey,
          'Accept': 'application/json'
        },
        params: {
          ll: `${coordinates.lat},${coordinates.lng}`,
          categories: '19013',
          limit: 8,
          radius: 15000
        }
      });

      return response.data.results || [];
    } catch (error) {
      console.error('Resorts error:', error.message);
      return [];
    }
  }

  async getVillas(coordinates) {
    try {
      const response = await axios.get('https://api.foursquare.com/v3/places/search', {
        headers: {
          'Authorization': this.foursquareApiKey,
          'Accept': 'application/json'
        },
        params: {
          ll: `${coordinates.lat},${coordinates.lng}`,
          categories: '19012',
          limit: 8,
          radius: 15000
        }
      });

      return response.data.results || [];
    } catch (error) {
      console.error('Villas error:', error.message);
      return [];
    }
  }
}

// Agent 3: Data Filtering Agent
class DataFilteringAgent {
  constructor() {
    this.name = 'DataFilteringAgent';
  }

  async filterData(extractedData, numberOfPeople, travelType) {
    try {
      console.log(`Agent 3: Filtering data for ${numberOfPeople} people with travel type: ${travelType}`);
      
      const filteredHousing = this.filterHousing(extractedData.housing, numberOfPeople, travelType);
      
      const filteredData = {
        ...extractedData,
        housing: filteredHousing,
        touristSpots: extractedData.touristSpots,
        restaurants: extractedData.restaurants
      };

      console.log('Agent 3: Data filtering completed');
      return filteredData;
    } catch (error) {
      console.error('Agent 3 Error:', error.message);
      throw error;
    }
  }

  filterHousing(housing, numberOfPeople, travelType) {
    const filtered = {
      hotels: [],
      resorts: [],
      villas: []
    };

    // Filter based on number of people
    if (numberOfPeople > 6) {
      filtered.villas = housing.villas.slice(0, 5);
      filtered.hotels = housing.hotels.slice(0, 3);
    } else if (numberOfPeople > 3) {
      filtered.hotels = housing.hotels.slice(0, 5);
      filtered.villas = housing.villas.slice(0, 3);
    } else {
      filtered.hotels = housing.hotels.slice(0, 5);
    }

    // Filter based on travel type
    if (travelType === 'relaxation' || travelType === 'honeymoon') {
      filtered.resorts = housing.resorts.slice(0, 5);
    } else {
      filtered.resorts = housing.resorts.slice(0, 2);
    }

    return filtered;
  }
}

// Agent 4: Itinerary Generation Agent
class ItineraryGenerationAgent {
  constructor() {
    this.name = 'ItineraryGenerationAgent';
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generateItinerary(filteredData, numberOfDays, numberOfPeople, travelType, budget) {
    try {
      console.log(`Agent 4: Generating itinerary for ${numberOfDays} days with budget $${budget}`);
      
      const prompt = this.createItineraryPrompt(filteredData, numberOfDays, numberOfPeople, travelType, budget);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const itinerary = response.text();

      console.log('Agent 4: Itinerary generated successfully');
      return itinerary;
    } catch (error) {
      console.error('Agent 4 Error:', error.message);
      throw error;
    }
  }

  createItineraryPrompt(filteredData, numberOfDays, numberOfPeople, travelType, budget) {
    const housingOptions = [];
    
    if (filteredData.housing.hotels.length > 0) {
      housingOptions.push(`Hotels: ${filteredData.housing.hotels.map(h => h.name).join(', ')}`);
    }
    if (filteredData.housing.resorts.length > 0) {
      housingOptions.push(`Resorts: ${filteredData.housing.resorts.map(r => r.name).join(', ')}`);
    }
    if (filteredData.housing.villas.length > 0) {
      housingOptions.push(`Villas: ${filteredData.housing.villas.map(v => v.name).join(', ')}`);
    }

    const attractions = filteredData.touristSpots.map(spot => spot.name).join(', ');
    const restaurants = filteredData.restaurants.map(rest => rest.name).join(', ');

    return `
Create a detailed ${numberOfDays}-day travel itinerary for ${numberOfPeople} people visiting ${filteredData.destination} with a total budget of $${budget}.

Travel Type: ${travelType}
Budget Constraint: $${budget} total for ${numberOfPeople} people

Available Accommodations:
${housingOptions.join('\n')}

Popular Attractions:
${attractions}

Dining Options:
${restaurants}

Please create a day-by-day itinerary with the following format:
- Day X (Date)
  - Morning (9:00 AM - 12:00 PM): Activity with specific location
  - Afternoon (12:00 PM - 5:00 PM): Activity with specific location
  - Evening (5:00 PM - 9:00 PM): Activity with specific location
  - Night: Rest/accommodation suggestion

Include:
1. Specific time slots for each activity
2. Recommended accommodation from the provided list
3. Meal suggestions with restaurant names
4. Rest periods
5. Travel time between locations
6. Activities that match the travel type: ${travelType}

Make it engaging and practical for ${numberOfPeople} people.
Make sure all recommendations fit within the $${budget} budget constraint.
`;
  }
}

// Agent 5: Budget Estimation Agent
// class BudgetEstimationAgent {
//   constructor() {
//     this.name = 'BudgetEstimationAgent';
//     this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
//   }

//   async estimateBudget(itinerary, destination, numberOfDays, numberOfPeople, travelType) {
//     try {
//       console.log(`Agent 5: Estimating budget for ${destination}`);
      
//       const prompt = this.createBudgetPrompt(itinerary, destination, numberOfDays, numberOfPeople, travelType);
      
//       const result = await this.model.generateContent(prompt);
//       const response = await result.response;
//       const budget = response.text();

//       console.log('Agent 5: Budget estimation completed');
//       return budget;
//     } catch (error) {
//       console.error('Agent 5 Error:', error.message);
//       throw error;
//     }
//   }

//   createBudgetPrompt(itinerary, destination, numberOfDays, numberOfPeople, travelType) {
//     return `
// Based on the following itinerary for ${destination}, calculate a realistic per-person budget estimate:

// ${itinerary}

// Parameters:
// - Destination: ${destination}
// - Duration: ${numberOfDays} days
// - Number of people: ${numberOfPeople}
// - Travel type: ${travelType}

// Please provide a detailed budget breakdown with:
// 1. Accommodation costs (per person per night)
// 2. Food and dining costs (per person per day)
// 3. Activities and attractions (per person)
// 4. Local transportation (per person)
// 5. Miscellaneous expenses (per person)

// Format the response as:
// **Per Person Budget Estimate for ${numberOfDays} Days:**

// **Accommodation:** $XXX - $XXX per night
// **Food & Dining:** $XXX - $XXX per day
// **Activities & Attractions:** $XXX - $XXX total
// **Local Transportation:** $XXX - $XXX total
// **Miscellaneous:** $XXX - $XXX total

// **Total Per Person: $XXX - $XXX**

// Provide ranges (budget to luxury) and consider local pricing for ${destination}.
// `;
//   }
// }

// Main orchestrator
class TravelPlannerOrchestrator {
  constructor() {
    this.agent1 = new InputProcessingAgent();
    this.agent2 = new DataExtractionAgent();
    this.agent3 = new DataFilteringAgent();
    this.agent4 = new ItineraryGenerationAgent();
    // this.agent5 = new BudgetEstimationAgent();
  }

  async orchestrate(destination, travelType, numberOfPeople, numberOfDays, budget) {
    try {
      // Agent 1: Process inputs
      const processedInputs = await this.agent1.processInputs(
        destination, travelType, numberOfPeople, numberOfDays, budget
      );

      // Agent 2: Extract data
      const extractedData = await this.agent2.extractDestinationData(
        processedInputs.destination, processedInputs.travelType
      );

      // Agent 3: Filter data
      const filteredData = await this.agent3.filterData(
        extractedData, processedInputs.numberOfPeople, processedInputs.travelType
      );

      // Agent 4: Generate itinerary
      const itinerary = await this.agent4.generateItinerary(
        filteredData, processedInputs.numberOfDays, 
        processedInputs.numberOfPeople, processedInputs.travelType, processedInputs.budget
      );

      const destinationImages = await fetchUnsplashImages(processedInputs.destination);

      return {
        success: true,
        data: {
          itinerary,
          destination: processedInputs.destination,
          numberOfDays: processedInputs.numberOfDays,
          numberOfPeople: processedInputs.numberOfPeople,
          travelType: processedInputs.travelType,
          destinationImages
        }
      };
    } catch (error) {
      console.error('Orchestration Error:', error.message);
      throw error;
    }  
  }
}

// Route handler
router.post('/generate-itinerary', async (req, res) => {
  try {
    const { destination, travelType, numberOfPeople, numberOfDays, budget } = req.body;

    // Validate required fields
    if (!destination || !travelType || !numberOfPeople || !numberOfDays || !budget) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: destination, travelType, numberOfPeople, numberOfDays, budget'
      });
    }

    const orchestrator = new TravelPlannerOrchestrator();
    const result = await orchestrator.orchestrate(
      destination, travelType, numberOfPeople, numberOfDays, budget
    );
    res.json(result);
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate itinerary',
      error: error.message
    });
  }
});

module.exports = router;