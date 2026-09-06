import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import StatusLookup from './pages/public/StatusLookup';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Bookings from './pages/admin/Bookings';
import Facilities from './pages/admin/Facilities';
import Settings from './pages/admin/Settings'; // Komponen baharu

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/semak-status" element={<StatusLookup />} />
        <Route path="/ajk/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/bookings" element={<Bookings />} />
        <Route path="/admin/facilities" element={<Facilities />} />
        <Route path="/admin/settings" element={<Settings />} /> {/* Laluan baharu */}
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
