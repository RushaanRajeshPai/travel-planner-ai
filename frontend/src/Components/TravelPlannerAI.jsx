import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, Users, Compass, Mountain, Heart, GraduationCap, Coffee, Loader2, DollarSign, ChevronLeft, ChevronRight, Utensils, ChevronDown } from 'lucide-react';
import FloatingBlob from './FloatingBlob';
import RevealOnScroll from './RevealOnScroll';

const TravelPlannerAI = () => {
  const [formData, setFormData] = useState({
    destination: '',
    travelType: '',
    numberOfPeople: '',
    numberOfDays: '',
    budget: '',
    foodPreference: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [destinationImages, setDestinationImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (destinationImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === destinationImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [destinationImages, currentImage]);

  const travelTypes = [
    { value: 'relaxation', label: 'Relaxation', icon: Coffee },
    { value: 'exploring cultural heritage', label: 'Cultural Heritage', icon: Compass },
    { value: 'trekking', label: 'Trekking', icon: Mountain },
    { value: 'educational', label: 'Educational', icon: GraduationCap },
    { value: 'honeymoon', label: 'Honeymoon', icon: Heart },
    { value: 'entertainment', label: 'Entertainment', icon: Heart }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? destinationImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === destinationImages.length - 1 ? 0 : prev + 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setDestinationImages([]); // Clear previous images

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
        setDestinationImages(data.data.destinationImages || []);
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

  const parseDayItinerary = (itinerary) => {
    const days = [];
    const dayPattern = /Day \d+[^:]*:/g;
    const dayMatches = itinerary.match(dayPattern);

    if (!dayMatches) {
      let content = itinerary.replace(/^\s*\*\s?/gm, '');
      content = content.replace(/(Night|Evening|Afternoon|Morning)([^\n]*)\n/g, '$1$2\n\n');
      return [{ title: 'Your Itinerary', content }];
    }

    const splits = itinerary.split(dayPattern);

    for (let i = 1; i < splits.length; i++) {
      let dayTitle = dayMatches[i - 1].replace(':', '').trim();

      let dayContent = splits[i]
        .trim()
        .replace(/\*\*/g, '')                 // remove all double asterisks
        .replace(/^\s*\*\s?/gm, '')           // remove leading bullets
        .replace(/(Afternoon|Evening|Night)([^\n]*)/g, '\n\n$1$2');


      days.push({
        title: dayTitle,
        content: dayContent
      });
    }

    return days;
  };

  const formatDayContent = (content) => {
    // Remove ## symbols and convert to bullet points for headings
    let formatted = content.replace(/##\s*/g, '• ');

    // Convert **text** to bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert line breaks to HTML breaks
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
  };

  const removeBudgetBreakdown = (htmlContent) => {
    // Remove lines that look like budget breakdowns (e.g., "$10 (Lunch) + $15 (Dinner) = $25")
    return htmlContent
      .split('<br>')
      .filter(line =>
        !/(\$\d+(\.\d+)?\s*\([^)]+\)\s*(\+|\=)\s*)|Grand Total|Drinks\/Minimal Club Costs|Assuming/.test(line.trim())
      )
      .join('<br>');
  };

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
    const dayItineraries = parseDayItinerary(result.itinerary);

    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 overflow-hidden p-8">
        <FloatingBlob />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Your Perfect Itinerary</h1>
            <p className="text-cyan-300">For {result.destination} • {result.numberOfDays} Days • {result.numberOfPeople} People</p>
          </div>

          {destinationImages.length > 0 && (
            <div className="mb-8 flex flex-col items-center">
              <div className="relative w-full max-w-3xl h-100 rounded-xl overflow-hidden shadow-lg">
                <div className="relative w-full max-w-3xl h-100 overflow-hidden rounded-xl">
                  {destinationImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Destination ${index + 1}`}
                      className={`absolute inset-0 w-full h-100 object-center transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100 z-20' : 'opacity-0 z-10'
                        }`}
                      style={{ transitionProperty: 'opacity' }}
                    />
                  ))}
                </div>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white rounded-full p-2"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white rounded-full p-2"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                {destinationImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full ${idx === currentImage ? 'bg-cyan-400' : 'bg-gray-400'}`}
                    onClick={() => setCurrentImage(idx)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {dayItineraries.map((day, index) => (
              <RevealOnScroll key={index} delay={index * 0.1}>
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 mt-6">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-cyan-400" />
                    {day.title}
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <div
                      className="whitespace-pre-wrap text-gray-200 leading-relaxed text-lg"
                      dangerouslySetInnerHTML={{
                        __html: removeBudgetBreakdown(formatDayContent(day.content))
                      }}
                    />
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setResult(null);
                setFormData({
                  destination: '',
                  travelType: '',
                  numberOfPeople: '',
                  numberOfDays: '',
                  budget: '',
                  foodPreference: ''
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
      <FloatingBlob />
      <div className="max-w-4xl mx-auto mt-10 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-cyan-300 mb-2">Generate Itinerary with Smart AI</h1>
          {/* <p className="text-xl text-cyan-300 mb-2"></p> */}
          <p className="text-gray-300">
            Discover personalized day-by-day plans crafted for your dream destination.
          </p>
        </div>
        <div className="bg-black/20 rounded-2xl p-8 border border-cyan-500/30 shadow-2xl">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-white font-semibold mb-2 flex items-center gap-2">
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
                <label className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  Travel Type
                </label>
                <div className="relative">
                  <select
                    name="travelType"
                    value={formData.travelType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none"
                    required
                  >
                    <option value="">Select travel type</option>
                    {travelTypes.map(type => (
                      <option key={type.value} value={type.value} className="bg-blue-900 text-white">
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-cyan-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 flex items-center gap-2">
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
                <label className="text-white font-semibold mb-2 flex items-center gap-2">
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
                <label className="text-white font-semibold mb-2 flex items-center gap-2">
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

              <div>
                <label className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-cyan-400" />
                  Food Preference
                </label>
                <div className="relative">
                  <select
                    name="foodPreference"
                    value={formData.foodPreference}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none"
                    required
                  >
                    <option value="" className="text-black bg-white">Select food preference</option>
                    <option value="vegetarian" className="text-black bg-white">Vegetarian</option>
                    <option value="non-vegetarian" className="text-black bg-white">Non-vegetarian</option>
                    <option value="mixed" className="text-black bg-white">Mixed</option>
                  </select>
                  <ChevronDown className="w-5 h-5 text-cyan-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
                {error}
              </div>
            )}

            <div className="text-center">
              <button
                onClick={handleSubmit}
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
          </div>

          <div className="mt-8 text-center">
            <p className="text-cyan-300 text-sm flex items-center justify-center gap-2">
              <span>✨</span>
              No credit card required • Create your first itinerary in minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPlannerAI;