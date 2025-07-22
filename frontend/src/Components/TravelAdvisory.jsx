import React, { useState, useEffect } from 'react';
import { ChevronDown, ExternalLink, AlertTriangle } from 'lucide-react';
import FloatingBlob from './FloatingBlob';

const TravelAdvisory = () => {
  const [userNationality, setUserNationality] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userNationalityCountry, setUserNationalityCountry] = useState(null);

  

  // Fetch user nationality and countries on component mount
  useEffect(() => {
    fetchUserNationality();
  }, []);

  const fetchUserNationality = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to access travel advisory');
        return;
      }

      const response = await fetch('/api/travel-advisory/user-nationality', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setUserNationality(data.data.userNationality);
        setUserNationalityCountry(data.data.userNationalityCountry);
        setCountries(data.data.countries);
      } else {
        setError(data.message || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user nationality:', error);
      setError('Network error. Please try again.');
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const handleCheckAdvisory = async () => {
    if (!selectedCountry) {
      setError('Please select a destination country');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/travel-advisory/get-advisory-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          destinationCountry: selectedCountry.name
        })
      });

      const data = await response.json();

      if (data.success) {
        // Open the travel advisory URL in a new tab
        window.open(data.data.advisoryUrl, '_blank');
      } else {
        setError(data.message || 'Failed to get travel advisory');
      }
    } catch (error) {
      console.error('Error getting travel advisory:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-4">
      <FloatingBlob />
      <div className="w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="text-cyan-300 w-12 h-12 mr-3" />
              <h1 className="text-4xl text-cyan-300 font-bold">Travel Advisory</h1>
            </div>
            <p className="text-blue-100 text-lg">
              Check official travel advisories for your destination
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center">
              <AlertTriangle className="text-red-400 w-5 h-5 mr-2" />
              <span className="text-red-100">{error}</span>
            </div>
          )}

          {/* Your Nationality */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Your Nationality
            </label>
            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="flex items-center">
                {userNationalityCountry && (
                  <span className="text-2xl mr-3">{userNationalityCountry.flag}</span>
                )}
                <span className="text-white font-medium">
  {userNationalityCountry ? userNationalityCountry.name : (userNationality || 'Loading...')}
</span>
              </div>
            </div>
          </div>

          {/* Destination Country Dropdown */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Select Destination Country
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white border border-white/20 rounded-lg p-4 text-left text-white hover:bg-white/20 transition-colors duration-200 flex items-center justify-between"
              >
                <span className="flex items-center">
                  {selectedCountry ? (
                    <>
                      <span className="text-2xl mr-3">{selectedCountry.flag}</span>
                      <span>{selectedCountry.name}</span>
                    </>
                  ) : (
                    'Select a country'
                  )}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-white/20 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden">
                  {/* Search Input */}
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <input
                      type="text"
                      placeholder="Search countries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                  </div>

                  {/* Countries List */}
                  <div className="max-h-60 overflow-y-auto bg-white">
                    {filteredCountries.map((country) => (
                      <div
                        key={country.flag}
                        onClick={() => handleCountrySelect(country)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center text-gray-900 border-b border-gray-100 last:border-b-0 bg-white cursor-pointer"
                        style={{ backgroundColor: 'white', color: 'black' }}
                      >
                        <span className="text-2xl mr-3">{country.flag}</span>
                        <span className="font-medium">{country.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Check Advisory Button */}
          <button
            onClick={handleCheckAdvisory}
            disabled={!selectedCountry || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Getting Travel Advisory...
              </div>
            ) : (
              <div className="flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Check Travel Advisory
              </div>
            )}
          </button>

          {/* Info Text */}
          <div className="mt-6 text-center">
            <p className="text-blue-100 text-sm">
              You will be redirected to the official government travel advisory website
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelAdvisory;