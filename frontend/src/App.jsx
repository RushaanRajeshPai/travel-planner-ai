import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OAuth from './Components/OAuth';
import Home from './Components/Home';
import Hero from './Components/Hero'; 
import TravelPlannerAI from './Components/TravelPlannerAI';
import Popular from './Components/Popular';
import Niche from './Components/Niche';
import TravelAdvisory from './Components/TravelAdvisory';
import Pricing from './Components/Pricing';
import Recommendations from './Components/Recommendations';
import Dashboard from './Components/Dashboard';
import Bookmarked from './Components/Bookmarked';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/auth" element={<OAuth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/travel-ai" element={<TravelPlannerAI />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/niche" element={<Niche />} />
        <Route path="/advisory" element={<TravelAdvisory />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookmarked" element={<Bookmarked />} />
      </Routes>
    </Router>
  );
};

export default App;
