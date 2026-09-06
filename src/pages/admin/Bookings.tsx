import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../lib/supabaseClient';
import { formatCurrency } from '../../lib/utils';
import { Search, Eye, X, Check, FileText } from 'lucide-react';

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setBookings(data);
    setLoading(false);
  };

  const openModal = (booking: any) => {
    setSelectedBooking(booking);
    setNewPrice(booking.final_total); // Default kepada harga semasa
  };

  const handleReview = async () => {
    if (!selectedBooking) return;
    setProcessing(true);
    try {
      // Halang kenaikan harga
      if (newPrice > selectedBooking.original_total) {
        throw new Error('Harga baru tidak boleh melebihi harga asal (RM ' + selectedBooking.original_total + ')');
      }

      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'WAITING_PAYMENT', 
          final_total: newPrice,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;
      
      alert('Permohonan disemak. Pemohon kini boleh membuat bayaran.');
      setSelectedBooking(null);
      fetchBookings();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedBooking) return;
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'APPROVED',
          approved_at: new Date().toISOString()
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;
      
      alert('Tempahan diluluskan dan tarikh dikunci.');
      setSelectedBooking(null);
      fetchBookings();
    } catch (err: any) {
      alert('Ralat kelulusan: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
      WAITING_PAYMENT: 'bg-blue-100 text-blue-800 border-blue-200',
      PAYMENT_SUBMITTED: 'bg-purple-100 text-purple-800 border-purple-200',
      APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200'
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengurusan Tempahan</h1>
          <p className="text-slate-500 text-sm mt-1">Senarai semua permohonan fasiliti.</p>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
          <input type="text" placeholder="Cari Ticket..." className="pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-semibold">Ticket</th>
                <th className="px-6 py-3 font-semibold">Nama Pemohon</th>
                <th className="px-6 py-3 font-semibold">Tarikh</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Jumlah</th>
                <th className="px-6 py-3 font-semibold">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Memuatkan data...</td></tr>
              ) : bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900">{booking.ticket_no}</td>
                  <td className="px-6 py-4 text-slate-700">{booking.applicant_name}</td>
                  <td className="px-6 py-4 text-slate-600">{booking.start_date} <br/><span className="text-xs text-slate-400">hingga</span> {booking.end_date}</td>
                  <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(booking.final_total)}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => openModal(booking)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium bg-blue-50 px-3 py-1.5 rounded-md transition">
                      <Eye className="w-4 h-4" /> Semak
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Butiran Tempahan */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">Ticket: <span className="font-mono text-blue-700">{selectedBooking.ticket_no}</span></h3>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                <div><p className="text-slate-500 text-xs font-semibold mb-1">Nama</p><p>{selectedBooking.applicant_name}</p></div>
                <div><p className="text-slate-500 text-xs font-semibold mb-1">No. Telefon</p><p>{selectedBooking.phone}</p></div>
              </div>

              {/* Logik Borang Berdasarkan Status */}
              {selectedBooking.status === 'PENDING' && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold text-amber-900 mb-2 text-sm">Semakan AJK (Pengurangan Harga)</h4>
                  <p className="text-xs text-amber-700 mb-3">Anda boleh memberikan diskaun. Harga tidak boleh melebihi RM{selectedBooking.original_total}.</p>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 font-medium">RM</span>
                    <input type="number" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} max={selectedBooking.original_total} className="w-full p-2 border border-slate-300 rounded focus:ring-blue-500 outline-none" />
                  </div>
                  <button onClick={handleReview} disabled={processing} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition">
                    {processing ? 'Menyimpan...' : 'Sahkan & Minta Bayaran'}
                  </button>
                </div>
              )}

              {selectedBooking.status === 'PAYMENT_SUBMITTED' && (
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold text-purple-900 mb-2 text-sm">Pengesahan Bukti Bayaran</h4>
                  <p className="text-xs text-purple-700 mb-3">Pemohon telah memuat naik resit sebanyak RM{selectedBooking.final_total}. Sila semak bank sebelum meluluskan.</p>
                  <button className="flex items-center gap-2 text-blue-700 font-medium text-sm bg-blue-100 px-3 py-2 rounded mb-4 hover:bg-blue-200">
                    <FileText className="w-4 h-4" /> Lihat Resit (Supabase Storage)
                  </button>
                  <button onClick={handleApprove} disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded flex items-center justify-center gap-2 transition">
                    <Check className="w-5 h-5" /> {processing ? 'Meluluskan...' : 'Luluskan Tempahan'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
