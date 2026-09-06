import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import StatusLookup from './pages/public/StatusLookup';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Laluan Awam */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/semak-status" element={<StatusLookup />} />

        {/* Laluan AJK / Admin */}
        <Route path="/ajk/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        
        {/* Lencongkan mana-mana laluan admin yang tiada ke dashboard */}
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
