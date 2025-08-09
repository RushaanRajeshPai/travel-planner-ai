import React from 'react';
import { Plane, ExternalLink } from 'lucide-react';
import FloatingBlob from './FloatingBlob';
import t1 from '../assets/t1.jpeg';
import t2 from '../assets/t2.jpeg';
import t3 from '../assets/t3.jpeg';
import j1 from '../assets/j1.jpeg';
import j2 from '../assets/j2.jpeg';
import j3 from '../assets/j3.jpeg';
import j4 from '../assets/j4.jpeg';
import j5 from '../assets/j5.jpeg';
import h1 from '../assets/h1.jpeg';
import h2 from '../assets/h2.jpeg';
import h3 from '../assets/h3.jpeg';
import h4 from '../assets/h4.jpeg';
import h5 from '../assets/h5.jpeg';
import i1 from '../assets/i1.jpeg';
import i2 from '../assets/i2.jpeg';
import i3 from '../assets/i3.jpeg';
import i4 from '../assets/i4.jpeg';
import i5 from '../assets/i5.jpeg';
import e1 from '../assets/e1.jpeg';
import e2 from '../assets/e2.jpeg';
import e3 from '../assets/e3.jpeg';
import e4 from '../assets/e4.jpeg';
import e5 from '../assets/e5.jpeg';
import u1 from '../assets/u1.jpeg';
import u2 from '../assets/u2.jpeg';
import u3 from '../assets/u3.jpeg';
import u4 from '../assets/u4.jpeg';
import u5 from '../assets/u5.jpeg';
import s1 from '../assets/s1.jpeg';
import s2 from '../assets/s2.jpeg';
import s3 from '../assets/s3.jpeg';
import s4 from '../assets/s4.jpeg';
import s5 from '../assets/s5.jpeg';
import au1 from '../assets/au1.jpeg';
import au2 from '../assets/au2.jpeg';
import au3 from '../assets/au3.jpeg';
import au4 from '../assets/au4.jpeg';
import au5 from '../assets/au5.jpeg';
import b1 from '../assets/b1.jpeg';
import b2 from '../assets/b2.jpeg';
import b3 from '../assets/b3.jpeg';
import b4 from '../assets/b4.jpeg';
import b5 from '../assets/b5.jpeg';
import z1 from '../assets/z1.jpeg';
import z2 from '../assets/z2.jpeg';
import z3 from '../assets/z3.jpeg';
import z4 from '../assets/z4.jpeg';
import z5 from '../assets/z5.jpeg';

const TopDestinations = () => {
  const destinations = [
    {
      title: "Experience the Magic of Japan",
      searchQuery: "Japan travel packages",
      images: [
        j1, j2, j3, j4, j5
      ]
    },
    {
      title: "Unwind in the Heart of Thailand",
      searchQuery: "Thailand travel packages",
      images: [
        "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=250&fit=crop",
        t3,
        "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=250&fit=crop",
        t1,
        t2
      ]
    },
    {
      title: "Soak in the Energy of Hong Kong",
      searchQuery: "Hong Kong travel packages",
      images: [
        h1, h2, h3, h4, h5
      ]
    },
    {
      title: "Discover the Soul of India",
      searchQuery: "India travel packages",
      images: [
        i1, i2, i3, i4, i5
      ]
    },
    {
      title: "Unveil Central Europe's Charm",
      searchQuery: "Central Europe travel packages",
      images: [
        e1, e2, e3, e4, e5
      ]
    },
    {
      title: "Live the Luxe Life in the UAE",
      searchQuery: "UAE travel packages",
      images: [
        u1, u2, u3, u4, u5
      ]
    },
    {
      title: "Escape to Seychelles Paradise",
      searchQuery: "Seychelles travel packages",
      images: [
        s1, s2, s3, s4, s5
      ]
    },
    {
      title: "Adventure Awaits in Australia",
      searchQuery: "Australia travel packages",
      images: [
        au1, au2, au3, au4, au5
      ]
    },
    {
      title: "Feel the Rhythm of Brazil",
      searchQuery: "Brazil travel packages",
      images: [
        b1, b2, b3, b4, b5
      ]
    },
    {
      title: "Island Hopping Through Indonesia",
      searchQuery: "Indonesia travel packages",
      images: [
        z1, z2, z3, z4, z5
      ]
    }

  ];

  const RollingGallery = ({ images }) => {
    return (
      <div className="relative overflow-hidden rounded-lg h-48 mb-4 bg-gray-900/20">
        <div className="rolling-track flex animate-scroll whitespace-nowrap">
          {[...images, ...images].map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 h-48 mx-1"
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover rounded-md shadow-md hover:shadow-lg transition-shadow"
              />
            </div>
          ))}
        </div>

        <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
        }

        .rolling-track {
          width: max-content;
        }

        .hover\\:pause-animation:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .animate-scroll {
            animation-duration: 20s;
          }
        }
      `}</style>
      </div>
    );
  };

  const handleCheckoutTrip = (searchQuery) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800">
      <FloatingBlob />
      <nav className="relative z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-l from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">EzyVoyage AI</span>
            </div>
          </div>
        </div>
      </nav>
      <div className="text-center py-12 px-4">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-cyan-300 mb-4 tracking-tight">
          Top Travel Destinations of 2025
        </h1>
        <p className="text-lg md:text-xl text-blue-200 font-light max-w-2xl mx-auto">
          Discover the world's most loved travel spots.
        </p>
      </div>

      {/* Destinations Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:transform hover:scale-105"
            >
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center leading-tight">
                {destination.title}
              </h2>
              <RollingGallery images={destination.images} />
              <div className="text-center">
                <button
                  onClick={() => handleCheckoutTrip(destination.searchQuery)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm rounded-lg shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 transition-all duration-300 hover:from-cyan-400 hover:to-blue-400 flex items-center justify-center gap-2"
                >
                  Checkout This Trip
                  <ExternalLink className="w-4 h-4 font-bold" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
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
                  href="https://x.com/rushaan21yo"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  aria-label="Follow us on X"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/RushaanRajeshPai"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  aria-label="Follow us on GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 .297a12 12 0 00-3.79 23.4c.6.111.82-.261.82-.58 0-.287-.011-1.045-.017-2.052-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.839 1.236 1.839 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.467-1.334-5.467-5.931 0-1.31.467-2.381 1.235-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 016 0c2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.807 5.625-5.48 5.921.43.37.823 1.103.823 2.222 0 1.606-.015 2.903-.015 3.293 0 .321.218.694.825.576A12 12 0 0012 .297z"
                    />
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

export default TopDestinations;