import React, { useState, useEffect } from 'react';
import { MapPin, Sparkles, Eye, AlertTriangle, User, Menu, X, ChevronDown } from 'lucide-react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userFullName, setUserFullName] = useState('');

  const slides = [
    {
      id: 1,
      title: "From the Skyscrapers of Dubai",
      description: "Marvel at futuristic towers, shop in sky-high malls, and dine with a view from the clouds—where innovation meets indulgence.",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=600&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "To the Buzz of New York City",
      description: "Dive into the rhythm of Broadway lights, street-side jazz, and a city alive with stories on every corner.",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=600&fit=crop&crop=center"
    },
    {
      id: 3,
      title: "From the Shores of Maldives",
      description: "Indulge in turquoise waters, serene sunsets, and unforgettable island moments.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=center"
    },
    {
      id: 4,
      title: "To the Peaks of Switzerland",
      description: "Breathe in alpine air, glide through snowy slopes, and discover storybook landscapes.",
      image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&h=600&fit=crop&crop=center"
    },
    {
      id: 5,
      title: "Explore the World Seamlessly",
      description: "with EzyVoyage AI",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop&crop=center"
    }
  ];

  const features = [
  {
    title: "Plan Your Trip with Smart AI",
    description: "Create personalized travel plans powered by AI",
    icon: <Sparkles className="w-8 h-8" />,
    route: "/travel-ai",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop&crop=center",
    gradient: ""
  },
  {
    title: "Check Travel Advisories Worldwide",
    description: "Stay informed with official advisories",
    icon: <AlertTriangle className="w-8 h-8" />,
    route: "/advisory",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&h=300&fit=crop&crop=center",
    gradient: ""
  },
  {
    title: "Visit Iconic Locations",
    description: "Discover trending destinations and must-visit attractions",
    icon: <MapPin className="w-8 h-8" />,
    route: "/popular",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73fb6?w=500&h=300&fit=crop&crop=center",
    gradient: ""
  },
  {
    title: "Uncover Hidden Gems",
    description: "Find unique experiences and offbeat locations",
    icon: <Eye className="w-8 h-8" />,
    route: "/niche",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop&crop=center",
    gradient: ""
  },
  
];

  // Fetch user's full name
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUserFullName(userData.fullName);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleFeatureClick = (route) => {
    window.location.href = route;
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (route) => {
    window.location.href = route;
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsProfileDropdownOpen(false);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800">
      {/* Navbar */}
      <nav className="relative z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EzyVoyage AI</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('hero-section')}
                className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('features-section')}
                className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
              >
                Features
              </button>
              <button
                onClick={() => handleNavigation('/recommendations')}
                className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
              >
                Recommendations
              </button>
              <button
                onClick={() => handleNavigation('/pricing')}
                className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
              >
                Pricing
              </button>
            </div>

            {/* User Profile Section */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                >
                  <div className="text-center">
                    <User className="w-6 h-6 mx-auto" />
                    <span className="text-xs">{userFullName || 'User'}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-md rounded-lg shadow-lg border border-white/10">
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition-colors duration-200"
                    >
                      Your Profile
                    </button>
                    <button
                      onClick={() => handleNavigation('/bookmarked')}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition-colors duration-200"
                    >
                      Bookmarked Trips
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-white/5 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-white/10">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => scrollToSection('hero-section')}
                  className="block px-3 py-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                >
                  About Us
                </button>
                <button
                  onClick={() => scrollToSection('features-section')}
                  className="block px-3 py-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                >
                  Features
                </button>
                <button
                  onClick={() => handleNavigation('/recommendations')}
                  className="block px-3 py-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                >
                  Recommendations
                </button>
                <button
                  onClick={() => handleNavigation('/pricing')}
                  className="block px-3 py-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                >
                  Pricing
                </button>
                
                {/* Mobile User Profile */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center px-3 py-2">
                    <User className="w-5 h-5 text-gray-300 mr-2" />
                    <span className="text-gray-300">{userFullName || 'User'}</span>
                  </div>
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="block px-6 py-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                  >
                    Your Profile
                  </button>
                  <button
                    onClick={() => handleNavigation('/bookmarked')}
                    className="block px-6 py-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                  >
                    Bookmarked Trips
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block px-6 py-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="items-center justify-center p-4 relative overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-500/30 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl animate-float-delayed"></div>
          <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-blue-400/25 rounded-full blur-xl animate-float-slow"></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-sky-400/30 rounded-full blur-lg animate-float"></div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
          <div className="absolute top-1/2 right-1/3 w-36 h-36 bg-teal-300/15 rounded-full blur-2xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-cyan-300/15 rounded-full blur-xl animate-pulse delay-1200"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-blue-900/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-900/20 to-transparent"></div>
        
        {/* Hero Section */}
        <div id="hero-section" className="relative px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
              Welcome to <span className="bg-gradient-to-l from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                EzyVoyage AI
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-200">
              Your intelligent travel companion that transforms the way you explore the world.
              Discover personalized itineraries, hidden gems, and seamless travel experiences
              crafted just for you by our advanced AI technology.
            </p>
          </div>
          
          {/* Carousel Section */}
          <div className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div
                className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <div className="relative h-96 md:h-[500px] lg:h-[600px]">
                  {slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white px-4 max-w-4xl">
                          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            {slide.title}
                          </h2>
                          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed">
                            {slide.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-cyan-400' : 'bg-white/50'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Features Section */}
          <div id="features-section" className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-16">
                <span className="bg-gradient-to-l from-cyan-400 via-sky-400 to-teal-200 bg-clip-text text-transparent">
                  Explore Our Features
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-15">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    onClick={() => handleFeatureClick(feature.route)}
                    className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                  >
                    <div className={`rounded-3xl shadow-xl ${feature.gradient} p-1 h-80 md:h-140`}>
                      <div className="bg-white/20 backdrop-blur-md rounded-3xl p-10 border border-white/20 hover:bg-white/30 transition-colors flex flex-col h-full">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="text-white flex-shrink-0">
                            {feature.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-1">
                              {feature.title}
                            </h3>
                            <p className="text-gray-100 text-base">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <img
                            src={feature.image}
                            alt={feature.title}
                            className="rounded-xl w-full h-86 object-full shadow-lg bg-white/10"
                            style={{ maxHeight: '500px', maxWidth:'500px', margin: '0 auto' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900/90 backdrop-blur-md border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <span className="text-white font-semibold">EzyVoyage AI</span>
              <span className="text-gray-400 ml-2">© 2025 All rights reserved</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Connect with us:</span>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  aria-label="Follow us on X"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-2.013 0-3.64-1.628-3.64-3.64s1.628-3.64 3.64-3.64 3.64 1.628 3.64 3.64-1.628 3.64-3.64 3.64zm7.072 0c-2.013 0-3.64-1.628-3.64-3.64s1.628-3.64 3.64-3.64 3.64 1.628 3.64 3.64-1.628 3.64-3.64 3.64z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;