import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./Components/Hero";
import OAuth from "./Components/OAuth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/auth" element={<OAuth />} />
      </Routes>
    </Router>
  );
}

export default App;
