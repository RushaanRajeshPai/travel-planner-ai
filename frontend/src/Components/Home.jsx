import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Sparkles, Eye, AlertTriangle } from 'lucide-react';
import maldives from '../assets/maldives.jpg';
import swiss from '../assets/swiss.jpg';
import itinerary from '../assets/itinerary.png'
import adv from '../assets/adv.png'
import popular from '../assets/popular.png';
import hidden from '../assets/hidden.png';
import FloatingBlob from './FloatingBlob';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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
      image: maldives
    },
    {
      id: 4,
      title: "To the Peaks of Switzerland",
      description: "Breathe in alpine air, glide through snowy slopes, and discover storybook landscapes.",
      image: swiss
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
    image: itinerary,
    gradient: ""
  },
  {
    title: "Check Travel Advisories Worldwide",
    description: "Stay informed with official advisories",
    icon: <AlertTriangle className="w-8 h-8" />,
    route: "/advisory",
    image: adv,
    gradient: ""
  },
  {
    title: "Visit Iconic Locations",
    description: "Discover trending destinations and must-visit attractions",
    icon: <MapPin className="w-8 h-8" />,
    route: "/popular",
    image: popular,
    gradient: ""
  },
  {
    title: "Uncover Hidden Gems",
    description: "Find unique experiences and offbeat locations",
    icon: <Eye className="w-8 h-8" />,
    route: "/niche",
    image: hidden,
    gradient: ""
  },
  
];


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

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 items-center justify-center p-4 relative overflow-hidden">
      <FloatingBlob />
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
      <div className="relative px-4 py-20 sm:px-6 lg:px-8">
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
        {/* Image Container - Empty for home.png */}
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-16">
              <div className="h-96 md:h-[500px] lg:h-[600px] flex items-center justify-center">
                <div className="text-center text-white/50">
                  <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-12 h-12" />
                  </div>
                  <p className="text-lg">Home image will be placed here</p>
                </div>
              </div>
            </div>
          </div>
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

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 
             bg-transparent sm:bg-white/20 hover:bg-transparent sm:hover:bg-white/30 
             rounded-full p-0 sm:p-2.5 md:p-3 transition-all"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 
             bg-transparent sm:bg-white/20 hover:bg-transparent sm:hover:bg-white/30 
             rounded-full p-0 sm:p-2.5 md:p-3 transition-all"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>

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
        <div className="px-4 py-16 sm:px-6 lg:px-8">
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
      {/* Footer Spacing */}
      <div className="h-16"></div>
    </div>
  );
};

export default Home;