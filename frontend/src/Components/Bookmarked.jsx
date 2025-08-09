import React, { useState, useEffect } from 'react';
import { MapPin, Trash2, ExternalLink, Calendar, Filter, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FloatingBlob from './FloatingBlob';

const Bookmarked = () => {
  const [bookmarkedTrips, setBookmarkedTrips] = useState([]);
  const [groupedBookmarks, setGroupedBookmarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingTrip, setDeletingTrip] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'grouped'
  const [filterMode, setFilterMode] = useState('all');
  const [tripImages, setTripImages] = useState({});
  const navigate = useNavigate();

  const travelModes = ['Relaxation', 'Trekking', 'Exploring Cultural Heritage', 'Educational', 'Honeymoon'];

  useEffect(() => {
    fetchBookmarkedTrips();
  }, []);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Function to fetch trip image
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
      const fallbackUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(location.split(',')[0])},travel`;
      setTripImages(prev => ({
        ...prev,
        [imageKey]: fallbackUrl
      }));
      return fallbackUrl;
    }
  };

  const fetchBookmarkedTrips = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/bookmarked/get-bookmarked-trips', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookmarked trips');
      }

      const data = await response.json();

      if (data.success) {
        setBookmarkedTrips(data.bookmarkedTrips);

        // Group trips by travel mode
        const grouped = data.bookmarkedTrips.reduce((acc, trip) => {
          if (!acc[trip.travelMode]) {
            acc[trip.travelMode] = [];
          }
          acc[trip.travelMode].push(trip);
          return acc;
        }, {});

        setGroupedBookmarks(grouped);

        // Pre-fetch images for bookmarked trips
        data.bookmarkedTrips.forEach(trip => {
          fetchTripImage(trip.location, trip.title);
        });
      } else {
        setError(data.message || 'Failed to load bookmarked trips');
      }
    } catch (err) {
      console.error('Error fetching bookmarked trips:', err);
      setError('Failed to load bookmarked trips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (trip) => {
    if (deletingTrip) return;

    setDeletingTrip(`${trip.title}-${trip.location}`);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookmarked/remove-bookmark', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: trip.title,
          location: trip.location
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove from bookmarked trips
        setBookmarkedTrips(prev => prev.filter(t => !(t.title === trip.title && t.location === trip.location)));

        // Update grouped bookmarks
        setGroupedBookmarks(prev => {
          const updated = { ...prev };
          if (updated[trip.travelMode]) {
            updated[trip.travelMode] = updated[trip.travelMode].filter(t => !(t.title === trip.title && t.location === trip.location));
            if (updated[trip.travelMode].length === 0) {
              delete updated[trip.travelMode];
            }
          }
          return updated;
        });

        showNotification('Trip removed from bookmarks successfully!', 'success');
      } else {
        showNotification(data.message || 'Failed to remove bookmark', 'error');
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      showNotification('Failed to remove bookmark. Please try again.', 'error');
    } finally {
      setDeletingTrip(null);
    }
  };

  const handleTripClick = (tripTitle, location) => {
    const searchQuery = `${tripTitle} ${location} travel`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(googleSearchUrl, '_blank');
  };

  const getFilteredTrips = () => {
    if (filterMode === 'all') {
      return bookmarkedTrips;
    }
    return bookmarkedTrips.filter(trip => trip.travelMode === filterMode);
  };

  const TripCard = ({ trip, onRemove }) => {
    const imageKey = `${trip.title}-${trip.location}`;
    const imageUrl = tripImages[imageKey];
    const isDeleting = deletingTrip === `${trip.title}-${trip.location}`;

    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 w-full relative">
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
          {/* Delete button */}
          <button
            onClick={() => onRemove(trip)}
            disabled={isDeleting}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${isDeleting
                ? 'bg-yellow-600 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
              } text-white shadow-lg`}
            title="Remove from bookmarks"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center mb-2 justify-center">
            <MapPin className="w-4 h-4 mr-1 text-cyan-300" />
            <span className="text-sm font-semibold text-cyan-300">{trip.location}</span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2 leading-tight text-center text-white">
            {trip.title}
          </h3>
          <div className="flex items-center justify-center mb-3 text-xs text-gray-300">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Bookmarked: {new Date(trip.bookmarkedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-center mb-3">
            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              {trip.travelMode}
            </span>
          </div>
          <button
            onClick={() => handleTripClick(trip.title, trip.location)}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 sm:py-2.5 px-4 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
          >
            Check This Trip
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Notification Component
  const Notification = ({ show, message, type }) => {
    if (!show) return null;

    return (
      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
        <div className="flex items-center gap-2">
          <span className="font-medium">{message}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 flex items-center justify-center p-4 overflow-x-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl font-semibold text-cyan-300 max-w-md mx-auto px-4">
            Loading your bookmarked trips...
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
            onClick={fetchBookmarkedTrips}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredTrips = getFilteredTrips();

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 overflow-x-hidden">
      <FloatingBlob />
      <Notification show={notification.show} message={notification.message} type={notification.type} />

      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4">
            <Bookmark className="hidden sm:block w-8 h-8 sm:w-10 sm:h-10 text-cyan-300 mr-3" />
            <h1 className="text-2xl sm:text-4xl font-bold text-cyan-300">
              Your Bookmarked Trips
            </h1>
          </div>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-300">
            {bookmarkedTrips.length === 0
              ? "You haven't bookmarked any trips yet. Start exploring and save your favorites!"
              : `You have ${bookmarkedTrips.length} amazing trip${bookmarkedTrips.length !== 1 ? 's' : ''} saved for later`
            }
          </p>
          {bookmarkedTrips.length > 0 && (
            <div className="hidden sm:block w-24 h-1 mt-2 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
          )}
        </div>

        {bookmarkedTrips.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
              <Bookmark className="w-16 h-16 text-cyan-300 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">No Bookmarks Yet</h3>
              <p className="text-gray-300 mb-6">
                Start bookmarking trips from our recommendations to see them here!
              </p>
              <button
                onClick={() => navigate('/recommendations')}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 font-medium"
              >
                Check Recommendations
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center mb-8 sm:mb-12">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-cyan-300" />
                <span className="text-white font-medium">Filter by Travel Mode:</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filterMode === 'all'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                >
                  All ({bookmarkedTrips.length})
                </button>
                {travelModes.map(mode => {
                  const count = bookmarkedTrips.filter(trip => trip.travelMode === mode).length;
                  if (count === 0) return null;

                  return (
                    <button
                      key={mode}
                      onClick={() => setFilterMode(mode)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filterMode === mode
                          ? 'bg-cyan-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                      {mode} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Summary */}
            <div className="text-center mb-8">
              <p className="text-gray-300">
                {filterMode === 'all'
                  ? `Showing all ${filteredTrips.length} bookmarked trips`
                  : `Showing ${filteredTrips.length} trips for ${filterMode}`
                }
              </p>
            </div>

            {/* Trip Cards Grid */}
            {filteredTrips.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
                {filteredTrips.map((trip, index) => (
                  <TripCard
                    key={`${trip.title}-${trip.location}-${index}`}
                    trip={trip}
                    onRemove={removeBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto">
                  <Filter className="w-12 h-12 text-cyan-300 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-white mb-2">No trips found</h3>
                  <p className="text-gray-300">
                    No bookmarked trips match the selected filter.
                  </p>
                </div>
              </div>
            )}

            {/* Grouped View (Optional future enhancement) */}
            {viewMode === 'grouped' && Object.keys(groupedBookmarks).length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12">
                  Trips by <span className="text-cyan-300">Travel Mode</span>
                </h2>
                {Object.entries(groupedBookmarks).map(([mode, trips]) => (
                  <div key={mode} className="mb-12">
                    <h3 className="text-xl sm:text-2xl font-bold text-cyan-300 mb-6 text-center">
                      {mode} ({trips.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
                      {trips.map((trip, index) => (
                        <TripCard
                          key={`${trip.title}-${trip.location}-${index}`}
                          trip={trip}
                          onRemove={removeBookmark}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Quick Actions */}
        {bookmarkedTrips.length > 0 && (
          <div className="text-center mt-12 sm:mt-16">
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/recommendations')}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 font-medium"
                >
                  Find More Trips
                </button>
                <button
                  onClick={() => {
                    const tripTitles = bookmarkedTrips.map(trip => `${trip.title} - ${trip.location}`).join('\n');
                    navigator.clipboard.writeText(tripTitles);
                    showNotification('Trip list copied to clipboard!', 'success');
                  }}
                  className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-300 font-medium border border-white/20"
                >
                  Share Trip List
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarked;