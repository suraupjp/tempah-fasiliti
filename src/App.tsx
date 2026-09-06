import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Paparan sementara untuk pastikan deployment berjaya */}
        <Route path="/" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 text-center mb-4">
              Sistem Tempahan Fasiliti
            </h1>
            <h2 className="text-2xl text-blue-600 font-semibold mb-8">
              Surau PJ Perdana
            </h2>
            <p className="text-slate-500 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              Sistem sedang dibangunkan. (Deployment Berjaya!)
            </p>
          </div>
        } />
        
        {/* Laluan ini akan diaktifkan apabila komponen siap dibina: */}
        {/* <Route path="/" element={<LandingPage />} /> */}
        {/* <Route path="/semak-status" element={<StatusLookup />} /> */}
        {/* <Route path="/ajk/login" element={<AjkLogin />} /> */}
        {/* <Route path="/admin/*" element={<AdminDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
