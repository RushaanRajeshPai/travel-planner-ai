import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, Users, Compass, Mountain, Heart, GraduationCap, Coffee, Loader2, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

const TravelPlannerAI = () => {
  const [formData, setFormData] = useState({
    destination: '',
    travelType: '',
    numberOfPeople: '',
    numberOfDays: '',
    budget: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const travelTypes = [
    { value: 'relaxation', label: 'Relaxation', icon: Coffee },
    { value: 'exploring cultural heritage', label: 'Cultural Heritage', icon: Compass },
    { value: 'trekking', label: 'Trekking', icon: Mountain },
    { value: 'educational', label: 'Educational', icon: GraduationCap },
    { value: 'honeymoon', label: 'Honeymoon', icon: Heart }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/travel/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Failed to generate itinerary');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-400 rounded-full animate-spin"></div>
        <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-cyan-400 animate-pulse" />
      </div>
      <div className="mt-6 text-center">
        <p className="text-lg text-white font-medium">Planning your perfect adventure...</p>
        <p className="text-sm text-cyan-300 mt-2">Our AI agents are working their magic ✨</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">EzyVoyage AI</h1>
            <p className="text-cyan-300">Your personalized travel companion</p>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Your Perfect Itinerary</h1>
            <p className="text-cyan-300">For {result.destination} • {result.numberOfDays} Days • {result.numberOfPeople} People</p>
          </div>

          <div className="w-full">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-cyan-400" />
                Day-by-Day Itinerary
              </h2>
              <div className="prose prose-invert max-w-none">
                <div
                  className="whitespace-pre-wrap text-gray-200 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: result.itinerary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setResult(null);
                setFormData({
                  destination: '',
                  travelType: '',
                  numberOfPeople: '',
                  numberOfDays: ''
                });
              }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Plan Another Trip
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">EzyVoyage AI</h1>
          <p className="text-xl text-cyan-300 mb-2">Your Next Adventure Starts Here</p>
          <p className="text-gray-300">
            Imagine having a travel expert who knows your preferences, understands your dreams,
            and crafts the perfect journey just for you.
          </p>
        </div>

        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className=" text-white font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Destination
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="e.g., Paris, France"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className=" text-white font-semibold mb-2 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  Travel Type
                </label>
                <select
                  name="travelType"
                  value={formData.travelType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  required
                >
                  <option value="">Select travel type</option>
                  {travelTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-blue-900 text-white">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className=" text-white font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Number of People
                </label>
                <input
                  type="number"
                  name="numberOfPeople"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  placeholder="e.g., 2"
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className=" text-white font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  Number of Days
                </label>
                <input
                  type="number"
                  name="numberOfDays"
                  value={formData.numberOfDays}
                  onChange={handleInputChange}
                  placeholder="e.g., 7"
                  min="1"
                  max="30"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className=" text-white font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                  Budget
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Enter your budget in USD"
                  min="1"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
                {error}
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-12 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plane className="w-5 h-5" />
                    Generate Itinerary
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-cyan-300 text-sm flex items-center justify-center gap-2">
              <span>✨</span>
              No credit card required • Create your first itinerary in minutes
            </p>
          </div>
        </div>

        {/* <div className="mt-12 bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Why Settle for Generic Travel Plans?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-cyan-500/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">AI-Powered Planning</h3>
              <p className="text-gray-300 text-sm">Smart recommendations tailored just for you</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-500/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Discover Hidden Gems</h3>
              <p className="text-gray-300 text-sm">Uncover unique destinations beyond the tourist trail</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-500/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Perfect Timing</h3>
              <p className="text-gray-300 text-sm">Optimized schedules that maximize your experience</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default TravelPlannerAI;