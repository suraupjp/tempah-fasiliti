import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import StatusLookup from './pages/public/StatusLookup'; // Komponen baharu

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/semak-status" element={<StatusLookup />} />
      </Routes>
    </Router>
  );
}

export default App;
