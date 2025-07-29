import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FloatingBlob from './FloatingBlob';

const Recommendations = () => {
  const [userTravelMode, setUserTravelMode] = useState('');
  const [favoriteTrips, setFavoriteTrips] = useState([]);
  const [otherTrips, setOtherTrips] = useState({});
  const [favoriteCurrentIndex, setFavoriteCurrentIndex] = useState(0);
  const [otherCurrentIndexes, setOtherCurrentIndexes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tripImages, setTripImages] = useState({});
  const navigate = useNavigate();

  const travelModes = ['Relaxation', 'Trekking', 'Exploring Cultural Heritage', 'Educational', 'Honeymoon'];

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Function to fetch trip image using backend API
  const fetchTripImage = async (location, title) => {
    const imageKey = `${title}-${location}`;
    
    if (tripImages[imageKey]) {
      return tripImages[imageKey];
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/recommendations/get-image?location=${encodeURIComponent(location)}&title=${encodeURIComponent(title)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const data = await response.json();
      
      if (data.success && data.imageUrl) {
        setTripImages(prev => ({
          ...prev,
          [imageKey]: data.imageUrl
        }));
        return data.imageUrl;
      } else {
        throw new Error('No image URL in response');
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      // Fallback to a generic travel image
      const fallbackUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(location.split(',')[0])},travel`;
      setTripImages(prev => ({
        ...prev,
        [imageKey]: fallbackUrl
      }));
      return fallbackUrl;
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/recommendations/get-recommendations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      
      if (data.success) {
        setUserTravelMode(data.userTravelMode);
        setFavoriteTrips(data.favoriteTrips);
        setOtherTrips(data.otherTrips);
        
        // Initialize current indexes for other travel modes
        const initialIndexes = {};
        Object.keys(data.otherTrips).forEach(mode => {
          initialIndexes[mode] = 0;
        });
        setOtherCurrentIndexes(initialIndexes);

        // Fetch images for all trips
        const allTrips = [...data.favoriteTrips];
        Object.values(data.otherTrips).forEach(trips => {
          allTrips.push(...trips);
        });

        // Pre-fetch images for visible trips
        allTrips.forEach(trip => {
          fetchTripImage(trip.location, trip.title);
        });
      } else {
        setError(data.message || 'Failed to load recommendations');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTripClick = (tripTitle, location) => {
    const searchQuery = `${tripTitle} ${location} travel`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(googleSearchUrl, '_blank');
  };

  const navigateFavorite = (direction) => {
    if (direction === 'next' && favoriteCurrentIndex + 4 < favoriteTrips.length) {
      setFavoriteCurrentIndex(favoriteCurrentIndex + 4);
    } else if (direction === 'prev' && favoriteCurrentIndex > 0) {
      setFavoriteCurrentIndex(favoriteCurrentIndex - 4);
    }
  };

  const navigateOther = (mode, direction) => {
    const currentIndex = otherCurrentIndexes[mode] || 0;
    const trips = otherTrips[mode] || [];
    
    if (direction === 'next' && currentIndex + 4 < trips.length) {
      setOtherCurrentIndexes(prev => ({
        ...prev,
        [mode]: currentIndex + 4
      }));
    } else if (direction === 'prev' && currentIndex > 0) {
      setOtherCurrentIndexes(prev => ({
        ...prev,
        [mode]: currentIndex - 4
      }));
    }
  };

  const TripCard = ({ trip, onClick }) => {
    const imageKey = `${trip.title}-${trip.location}`;
    const imageUrl = tripImages[imageKey];

    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 w-full">
        <div className="h-48 sm:h-52 md:h-48 lg:h-48 xl:h-52 relative overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={`${trip.location} - ${trip.title}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.src = `https://source.unsplash.com/800x600/?travel,destination,${encodeURIComponent(trip.location)}`;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 animate-pulse"></div>
          )}
        </div>
        <div className="p-4 sm:p-5 md:p-6 text-center">
          <div className="flex items-center mb-1 text-center justify-center">
              <MapPin className="w-4 h-4 mr-1 text-cyan-300" />
              <span className="text-sm font-semibold drop-shadow-lg text-cyan-300">{trip.location}</span>
            </div>
          <h3 className="text-base sm:text-lg font-semibold mb-3 line-clamp-2 leading-tight">
            {trip.title}
          </h3>
          <button
            onClick={() => onClick(trip.title, trip.location)}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 sm:py-2.5 md:py-2 px-4 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
          >
            Check This Trip
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const NavigationButtons = ({ currentIndex, totalItems, onNavigate, disabled = false }) => (
    <div className="flex justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 px-4">
      <button
        onClick={() => onNavigate('prev')}
        disabled={disabled || currentIndex === 0}
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-white shadow-lg rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
        <span className="font-medium">Previous</span>
      </button>
      <button
        onClick={() => onNavigate('next')}
        disabled={disabled || currentIndex + 4 >= totalItems}
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-white shadow-lg rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        <span className="font-medium">Previous</span>
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 flex items-center justify-center p-4 overflow-x-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl font-semibold text-cyan-300 max-w-md mx-auto px-4">
            Generating recommendations inspired by your favourite mode of travel
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 flex items-center justify-center p-4 overflow-x-hidden">
        <div className="text-center">
          <div className="text-red-500 text-lg sm:text-xl font-semibold mb-4 px-4">{error}</div>
          <button
            onClick={fetchRecommendations}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 overflow-x-hidden">
      <FloatingBlob />
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-xl sm:text-4xl md:text-xl font-bold mb-4 px-4 leading-tight">
            <span className="text-cyan-300">Personalized Recommendations for You</span> 
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto px-4 text-white">
            Discover amazing trips tailored to your preferences and explore new adventures
          </p>
        </div>

        {/* Based on Favorite Travel Mode Section */}
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 px-4 text-white">
              Based on your favourite travel mode : <span className="text-cyan-300">{userTravelMode}</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {favoriteTrips.slice(favoriteCurrentIndex, favoriteCurrentIndex + 4).map((trip, index) => (
              <TripCard
                key={index}
                trip={trip}
                onClick={handleTripClick}
              />
            ))}
          </div>

          <NavigationButtons
            currentIndex={favoriteCurrentIndex}
            totalItems={favoriteTrips.length}
            onNavigate={navigateFavorite}
          />
        </section>

        {/* Your Next Favourite Stay Section */}
        <section>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 px-4 text-white">
              Your next favourite stay
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
          </div>

          {Object.entries(otherTrips).map(([mode, trips]) => (
            <div key={mode} className="mb-12 sm:mb-16">
              <h3 className="text-xl sm:text-2xl font-bold text-cyan-300 mb-6 sm:mb-8 text-center px-4">
                {mode}
              </h3>
              
              {/* Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
                {trips.slice(otherCurrentIndexes[mode] || 0, (otherCurrentIndexes[mode] || 0) + 4).map((trip, index) => (
                  <TripCard
                    key={index}
                    trip={trip}
                    onClick={handleTripClick}
                  />
                ))}
              </div>

              <NavigationButtons
                currentIndex={otherCurrentIndexes[mode] || 0}
                totalItems={trips.length}
                onNavigate={(direction) => navigateOther(mode, direction)}
              />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Recommendations;