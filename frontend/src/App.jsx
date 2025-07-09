import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OAuth from './Components/OAuth';
import Home from './Components/Home';
import Hero from './Components/Hero'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/auth" element={<OAuth />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
