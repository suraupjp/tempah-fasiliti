import AdminLayout from '../../layouts/AdminLayout';
import { Clock, CheckCircle, CreditCard, Activity } from 'lucide-react';

export default function Dashboard() {
  // Mock data sementara
  const stats = [
    { label: 'Menunggu Semakan', value: '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Menunggu Bayaran', value: '0', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Diluluskan (Bulan Ini)', value: '0', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Jumlah Hasil (RM)', value: 'RM 0', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' }
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Ringkasan aktiviti tempahan fasiliti terkini.</p>
      </div>

      {/* Kad Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`p-5 rounded-lg border bg-white shadow-sm flex items-start justify-between`}>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
            <div className={`p-2 rounded-md ${stat.bg} ${stat.color} ${stat.border} border`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Jadual Senarai Permohonan Terkini (Placeholder) */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">Permohonan Terkini</h2>
        </div>
        <div className="p-5 text-center text-slate-500 text-sm">
          <p>Jadual permohonan akan dipaparkan di sini. Data akan ditarik dari Supabase.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
