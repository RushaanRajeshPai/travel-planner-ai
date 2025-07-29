import React, { useState, useEffect } from 'react';
import { User, Mail, Globe, Calendar, Heart, Edit3, Save, X } from 'lucide-react';
import maleAvatar from '../assets/male-avatar.json';
import femaleAvatar from '../assets/female-avatar.json';
import { Player } from '@lottiefiles/react-lottie-player';
import FloatingBlob from './FloatingBlob';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTravelMode, setEditedTravelMode] = useState('');
  const [saving, setSaving] = useState(false);

  const travelModeOptions = [
    'Relaxation',
    'Trekking',
    'Exploring Cultural Heritage',
    'Educational',
    'Honeymoon'
  ];

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      // Try to get token from localStorage as backup
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');

      const headers = {
        'Content-Type': 'application/json',
      };

      // Add Authorization header if token exists in localStorage
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/dashboard/profile', {
        method: 'GET',
        credentials: 'include', // This ensures cookies are sent
        headers
      });

      const data = await response.json();

      if (data.success) {
        setUserInfo(data.user);
        setEditedTravelMode(data.user.travelMode);
      } else {
        setError(data.message || 'Failed to fetch user information');
        console.log('Debug info:', data.debug); // Log debug info
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching user info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (editedTravelMode === userInfo.travelMode) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      // Try to get token from localStorage as backup
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');

      const headers = {
        'Content-Type': 'application/json',
      };

      // Add Authorization header if token exists in localStorage
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/dashboard/update-travel-mode', {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify({ travelMode: editedTravelMode })
      });

      const data = await response.json();

      if (data.success) {
        setUserInfo(prev => ({ ...prev, travelMode: editedTravelMode }));
        setIsEditing(false);
      } else {
        setError(data.message || 'Failed to update travel mode');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error updating travel mode:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTravelMode(userInfo.travelMode);
    setIsEditing(false);
  };

  const WavingUser = ({ gender }) => {
    const avatarSrc = gender?.toLowerCase() === 'female' ? femaleAvatar : maleAvatar;

    return (
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
        {/* Glowing circle effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="relative w-full h-full flex items-center justify-center">
          <Player
            autoplay
            loop
            src={avatarSrc}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-200 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 max-w-md text-center">
          <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-200 text-lg mb-4">{error}</p>
          <button
            onClick={fetchUserInfo}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <FloatingBlob />
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-cyan-200">Welcome back to your travel dashboard</p>
        </div>

        {/* Profile Card */}
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-black/20 p-8 shadow-2xl">
          {/* Avatar Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/30 border-4 border-cyan-400/50 flex items-center justify-center mx-auto backdrop-blur-sm">
                <WavingUser gender={userInfo?.gender} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{userInfo?.fullName}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
          </div>

          {/* User Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Email */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center mb-3">
                <Mail className="w-6 h-6 text-cyan-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Email</h3>
              </div>
              <p className="text-cyan-200 text-lg">{userInfo?.email}</p>
            </div>

            {/* Gender */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center mb-3">
                <User className="w-6 h-6 text-cyan-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Gender</h3>
              </div>
              <p className="text-cyan-200 text-lg">{userInfo?.gender}</p>
            </div>

            {/* Age */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center mb-3">
                <Calendar className="w-6 h-6 text-cyan-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Age</h3>
              </div>
              <p className="text-cyan-200 text-lg">{userInfo?.age} years old</p>
            </div>

            {/* Nationality */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center mb-3">
                <Globe className="w-6 h-6 text-cyan-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Nationality</h3>
              </div>
              <p className="text-cyan-200 text-lg">{userInfo?.nationality}</p>
            </div>
          </div>

          {/* Travel Mode - Editable */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Heart className="w-6 h-6 text-cyan-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Favorite Travel Mode</h3>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </button>
              )}
            </div>

            {!isEditing ? (
              <p className="text-cyan-200 text-lg">{userInfo?.travelMode}</p>
            ) : (
              <div className="space-y-4">
                <select
                  value={editedTravelMode}
                  onChange={(e) => setEditedTravelMode(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                >
                  {travelModeOptions.map((mode) => (
                    <option key={mode} value={mode} className="bg-gray-800 text-white">
                      {mode}
                    </option>
                  ))}
                </select>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveChanges}
                    disabled={saving || editedTravelMode === userInfo?.travelMode}
                    className={`flex items-center px-6 py-2 rounded-lg transition-colors ${saving || editedTravelMode === userInfo?.travelMode
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
                      }`}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>

                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;