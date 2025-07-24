import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, MapPin, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import FloatingBlob from "./FloatingBlob";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      title: "AI-Powered Planning",
      description: "AI-powered travel suggestions personalized to your style"
    },
    {
      icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      title: "Discover Hidden & Iconic Gems",
      description: "Uncover unique destinations beyond the tourist trail"
    },
    {
      icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
      title: "View Global Travel Alerts",
      description: "Access current advisories for every destination worldwide"
    }
  ];

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 overflow-hidden flex flex-col justify-between relative">
      <FloatingBlob />

      {/* Blurred Background Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-teal-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-36 h-36 sm:w-48 sm:h-48 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 sm:w-24 sm:h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-500" />
        <div className="absolute top-1/2 right-1/3 w-28 h-28 sm:w-36 sm:h-36 bg-teal-300/15 rounded-full blur-2xl animate-pulse delay-700" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 sm:w-28 sm:h-28 bg-cyan-300/15 rounded-full blur-xl animate-pulse delay-1200" />
      </div>

      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-blue-900/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-900/20 to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 flex-grow flex flex-col justify-center items-center px-4 pt-24 md:pt-32">
        <div className="text-center max-w-6xl w-full">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              EzyVoyage AI
              <span className="block mt-4 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Your Next Adventure Starts Here
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100/90 mb-8 leading-relaxed max-w-3xl mx-auto px-2">
              Imagine having a travel expert who knows your preferences, understands your dreams,
              and crafts the perfect journey just for you. Stop spending hours researching—let intelligence guide your wanderlust.
            </p>
          </div>

          {/* Features Section */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="text-cyan-300 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-blue-100/80 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className={`transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group inline-flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-blue-100/70 text-sm mt-4">
              ✨ No credit card required • Create your first itinerary in minutes
            </p>
          </div>
        </div>
      </div>

      {/* Floating Icons (Responsive) */}
      <div className="absolute top-5 left-5 sm:top-10 sm:left-10 animate-bounce delay-1000  xs:flex">
        <div className="bg-white/20 backdrop-blur-lg rounded-full p-2 border border-white/0">
          <img src={logo} alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
        </div>
      </div>

      <div className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 animate-bounce delay-2000  xs:flex">
        <div className="bg-white/20 backdrop-blur-lg rounded-full p-3 border border-white/30">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-teal-300" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
