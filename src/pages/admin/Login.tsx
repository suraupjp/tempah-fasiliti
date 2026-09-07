import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Jika berjaya, bawa ke dashboard
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError('Log masuk gagal. Sila semak emel dan kata laluan anda.');
    } finally {
      setLoading(false);
    }
  };

  <div className="min-h-screen bg-[url('/bg-islamic.jpg')] bg-cover bg-center flex items-center justify-center p-4 relative">
      {/* Latar Belakang Gelap (Overlay) */}
      <div className="absolute inset-0 bg-emerald-950/70"></div>
      
      {/* Kotak Login */}
      <div className="relative z-10 bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-emerald-500">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Logo Surau" className="h-24 mx-auto mb-4 drop-shadow-md" />
          <h1 className="text-2xl font-bold text-emerald-900">Log Masuk Admin</h1>
          <p className="text-gray-500 mt-1">Sistem Tempahan Surau PJ Perdana</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mel</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="admin@suraupj.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kata Laluan</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
          >
            {loading ? 'Sila tunggu...' : 'Log Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
