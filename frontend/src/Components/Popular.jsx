import React, { useState } from 'react';
import { MapPin, Search, Star, Users, ChevronDown, ExternalLink } from 'lucide-react';
import FloatingBlob from './FloatingBlob';

const Popular = () => {
  const [location, setLocation] = useState('');
  const [spotType, setSpotType] = useState('');
  const [loading, setLoading] = useState(false);
  const [spots, setSpots] = useState([]);
  const [error, setError] = useState('');

  const spotTypes = [
    'Clubs and Nightlife',
    'Sports Stadiums',
    'Trendy Bars',
    'Local Restaurants',
    'Promenades',
    'Shopping Streets and Malls',
    'Forts and Monuments',
    'Beaches'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location || !spotType) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/popular/spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          spotType
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSpots(data.spots);
      } else {
        setError(data.message || 'Failed to fetch popular spots');
        setSpots([]);
      }
    } catch (err) {
      setError('Failed to connect to server');
      setSpots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSpot = (spot) => {
    if (spot.googleUrl) {
      window.open(spot.googleUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 p-6">
      <FloatingBlob />
      <div className="max-w-5xl mt-25 mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-cyan-300 mb-4">
            Explore Popular Spots
          </h1>
          <p className="text-blue-200 text-lg">
            Discover the most popular and highly-rated spots in your desired location.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-black/20 rounded-2xl border border-cyan-500/30 p-8 mb-8 shadow-2xl">
          <div className="space-y-6">
            <div className="grid md:grid-cols-1 gap-6">
              {/* Location Input */}
              <div>
                <label className="flex items-center text-white font-semibold mb-2">
                  <MapPin size={16} className="w-5 h-5 mr-2 text-cyan-300" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Paris, France"
                  className="w-full px-4 py-3 pr-10 bg-blue-900/50 border border-blue-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none cursor-pointer"
                />
              </div>

              {/* Spot Type Dropdown */}
              <div className="space-y-2">
                <label className="flex items-center text-white font-semibold text-md">
                  <Search className="w-5 h-5 mr-2 text-cyan-400" />
                  What Are You Looking For?
                </label>
                <div className="relative">
                  <select
                    value={spotType}
                    onChange={(e) => setSpotType(e.target.value)}
                    className="w-full px-4 py-3 pr-10 bg-blue-900/50 border border-blue-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none cursor-pointer"
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
                  <ChevronDown className="w-5 h-5 text-cyan-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
              >
                <Search size={20} />
                <span>{loading ? 'Finding Spots...' : 'Find Popular Spots'}</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-400/30 rounded-lg text-red-300 text-center">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <p className="text-blue-200 mt-4">Searching for popular spots...</p>
          </div>
        )}

        {spots.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spots.map((spot, index) => (
              <div
                key={index}
                className="bg-black/20 border border-cyan-500/30 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white line-clamp-2">
                    {spot.name}
                  </h3>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-yellow-400">
                      <Star size={16} className="mr-1 fill-current" />
                      <span className="font-medium">{spot.rating}</span>
                    </div>
                    <div className="flex items-center text-blue-300">
                      <Users size={16} className="mr-1" />
                      <span className="text-sm">{spot.reviewCount} reviews</span>
                    </div>
                  </div>

                  {spot.address && (
                    <div className="flex items-start text-blue-200 text-sm">
                      <MapPin size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{spot.address}</span>
                    </div>
                  )}

                  {spot.description && (
                    <p className="text-blue-100 text-sm line-clamp-3">
                      {spot.description}
                    </p>
                  )}

                  {spot.priceLevel && (
                    <div className="text-green-400 text-sm font-medium">
                      Price Level: {spot.priceLevel}
                    </div>
                  )}

                  {/* View Spot Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleViewSpot(spot)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <ExternalLink size={16} />
                      <span>View this spot</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && spots.length === 0 && location && spotType && (
          <div className="text-center py-12 bg-gradient-to-r from-blue-800/30 to-purple-800/30 backdrop-blur-sm rounded-xl border border-blue-400/20">
            <Search size={48} className="mx-auto text-blue-400 mb-4 opacity-50" />
            <p className="text-blue-200 text-lg">
              No {spotType} found in {location}
            </p>
            <p className="text-blue-300 text-sm mt-2">
              Try searching for a different location or spot type.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popular;