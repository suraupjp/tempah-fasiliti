import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Settings, LogOut, Menu, X, Users, Building } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lindungi laluan ini - pastikan pengguna log masuk
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/ajk/login');
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/ajk/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/bookings', icon: CalendarCheck, label: 'Tempahan' },
    { path: '/admin/facilities', icon: Building, label: 'Fasiliti' },
    { path: '/admin/settings', icon: Settings, label: 'Tetapan' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Desktop & Mobile) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition duration-200 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <span className="text-lg font-bold text-white tracking-wide">SPP Admin</span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button key={item.path} onClick={() => { navigate(item.path); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${location.pathname.startsWith(item.path) ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-red-400 transition text-slate-400">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between lg:justify-end">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500">
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <Users className="w-4 h-4" /> AJK / Admin
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
