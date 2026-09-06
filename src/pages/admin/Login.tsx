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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Log Masuk Sistem</h1>
          <p className="text-slate-400 text-sm mt-1">Sistem Tempahan Surau PJ Perdana</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-6 md:p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded border border-red-100 mb-4 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Emel</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="admin@suraupj.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kata Laluan</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="••••••••" />
              </div>
            </div>
          </div>
          
          <button type="submit" disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
