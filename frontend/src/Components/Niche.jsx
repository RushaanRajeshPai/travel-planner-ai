import React, { useState } from 'react';
import { MapPin, Search, Star, MessageCircle, Clock, AlertCircle } from 'lucide-react';

const Niche = () => {
  const [location, setLocation] = useState('');
  const [spotType, setSpotType] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const spotTypes = [
    'Clubs and Nightlife',
    'Sports Stadiums',
    'Local Restobars',
    'Promenades',
    'Shopping Streets and Malls',
    'Forts and Monuments',
    'Beaches'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!location.trim() || !spotType) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('http://localhost:5000/api/niche/find-hidden-gems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          location: location.trim(),
          spotType: spotType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch hidden gems');
      }

      setResults(data.spots || []);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error('Error fetching hidden gems:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300 mb-4">
            Explore Hidden Gems
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Discover secret spots and niche locations that only locals know about. Find hidden treasures with fewer crowds and authentic experiences.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-blue-800/40 backdrop-blur-lg rounded-3xl p-8 mb-12 border border-blue-700/30 shadow-2xl">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Input */}
              <div className="space-y-2">
                <label className="flex items-center text-cyan-300 font-medium text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mumbai, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-blue-900/50 border border-blue-600/50 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Spot Type Dropdown */}
              <div className="space-y-2">
                <label className="flex items-center text-cyan-300 font-medium text-sm">
                  <Search className="w-4 h-4 mr-2" />
                  What Are You Looking For?
                </label>
                <select
                  value={spotType}
                  onChange={(e) => setSpotType(e.target.value)}
                  className="w-full px-4 py-3 bg-blue-900/50 border border-blue-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-blue-300">
                    Select spot type
                  </option>
                  {spotTypes.map((type) => (
                    <option key={type} value={type} className="bg-blue-900 text-white">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Finding Hidden Gems...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Find Hidden Gems</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* No Credit Card Message */}
          <div className="mt-6 text-center">
            <p className="text-blue-300 text-sm flex items-center justify-center space-x-2">
              <span>✨</span>
              <span>No credit card required • Discover hidden gems in seconds</span>
            </p>
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white text-center">
              Hidden Gems in {location}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((spot, index) => (
                <div
                  key={index}
                  className="bg-blue-800/40 backdrop-blur-lg rounded-2xl p-6 border border-blue-700/30 hover:bg-blue-700/40 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-cyan-300 line-clamp-2">
                      {spot.name}
                    </h3>
                    
                    <p className="text-blue-200 text-sm leading-relaxed line-clamp-3">
                      {spot.description}
                    </p>

                    <div className="space-y-3">
                      {/* Rating */}
                      {spot.rating && (
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white font-medium">{spot.rating}</span>
                          {spot.reviewCount && (
                            <span className="text-blue-300 text-sm">
                              ({spot.reviewCount} reviews)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Location */}
                      {spot.address && (
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span className="text-blue-200 text-sm">{spot.address}</span>
                        </div>
                      )}

                      {/* Why it's hidden */}
                      {spot.hiddenReason && (
                        <div className="flex items-start space-x-2">
                          <MessageCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-green-300 text-sm">{spot.hiddenReason}</span>
                        </div>
                      )}

                      {/* Best time to visit */}
                      {spot.bestTime && (
                        <div className="flex items-start space-x-2">
                          <Clock className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span className="text-purple-300 text-sm">{spot.bestTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Hidden Gem Badge */}
                    <div className="pt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30">
                        ✨ Hidden Gem
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!loading && results.length === 0 && location && spotType && !error && (
          <div className="text-center py-12">
            <div className="bg-blue-800/40 backdrop-blur-lg rounded-2xl p-8 border border-blue-700/30 max-w-md mx-auto">
              <Search className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Hidden Gems Found
              </h3>
              <p className="text-blue-300">
                No "{spotType}" found in "{location}". Try searching for a different location or spot type.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Niche;