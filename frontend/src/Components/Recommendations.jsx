import React,
 { useState, useEffect } from 'react';
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
  const navigate = useNavigate();

  const travelModes = ['Relaxation', 'Trekking', 'Exploring Cultural Heritage', 'Educational', 'Honeymoon'];

  useEffect(() => {
    fetchRecommendations();
  }, []);

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

  const TripCard = ({ trip, onClick }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="h-48 bg-black relative overflow-hidden">

        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center mb-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{trip.location}</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
          {trip.title}
        </h3>
        <button
          onClick={() => onClick(trip.title, trip.location)}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
        >
          Check This Trip
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const NavigationButtons = ({ currentIndex, totalItems, onNavigate, disabled = false }) => (
    <div className="flex justify-center gap-4 mt-8">
      <button
        onClick={() => onNavigate('prev')}
        disabled={disabled || currentIndex === 0}
        className="flex items-center gap-2 px-6 py-3 bg-white shadow-lg rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="font-medium">Previous</span>
      </button>
      <button
        onClick={() => onNavigate('next')}
        disabled={disabled || currentIndex + 4 >= totalItems}
        className="flex items-center gap-2 px-6 py-3 bg-white shadow-lg rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="font-medium">Next</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-cyan-300">Generating recommendations inspired by your favourite mode of travel</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-4">{error}</div>
          <button
            onClick={fetchRecommendations}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800">
      <FloatingBlob />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-cyan-300">Personalized Recommendations for You</span> 
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover amazing trips tailored to your preferences and explore new adventures
          </p>
        </div>

        {/* Based on Favorite Travel Mode Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Based on your favourite travel mode : <span className="text-cyan-300">{userTravelMode}</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Your next favourite stay
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
          </div>

          {Object.entries(otherTrips).map(([mode, trips]) => (
            <div key={mode} className="mb-16">
              <h3 className="text-2xl font-bold text-cyan-300 mb-8 text-center">
                {mode}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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