import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OAuth from './Components/OAuth';
import Home from './Components/Home';
import Hero from './Components/Hero'; 
import TripPlannerAI from './Components/TripPlannerAI';
import PopularSpots from './Components/PopularSpots';
import NicheSpots from './Components/NicheSpots';
import InterCityTravel from './Components/InterCityTravel';
import TravelAdvisory from './Components/TravelAdvisory';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/auth" element={<OAuth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/travel-ai" element={<TripPlannerAI />} />
        <Route path="/popular" element={<PopularSpots />} />
        <Route path="/niche" element={<NicheSpots />} />
        <Route path="/intercity-travel" element={<InterCityTravel />} />
        <Route path="/advisory" element={<TravelAdvisory />} />
      </Routes>
    </Router>
  );
};

export default App;
