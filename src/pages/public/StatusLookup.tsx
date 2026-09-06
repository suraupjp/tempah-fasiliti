import { useState } from 'react';
import { Search, Upload, Clock, CheckCircle2, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function StatusLookup() {
  const [ticketNo, setTicketNo] = useState('');
  const [ic, setIc] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBookingData(null);

    try {
      // Fungsi get_booking_status perlu dicipta dalam SQL Supabase nanti
      const { data, error } = await supabase.rpc('get_booking_status', { 
        p_ticket_no: ticketNo, 
        p_ic_last_six: ic 
      });

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Rekod tidak dijumpai. Sila pastikan Ticket dan No. IC tepat.');
      
      setBookingData(data[0]);
    } catch (err: any) {
      setError(err.message || 'Ralat sistem. Sila cuba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !bookingData) return;
    const file = e.target.files[0];
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${bookingData.ticket_no}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Muat naik ke bucket private 'payment_proofs'
      const { error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Kemaskini status pembayaran dalam database
      const { error: dbError } = await supabase
        .from('payments')
        .insert({
          booking_id: bookingData.id,
          amount: bookingData.final_total,
          proof_path: filePath,
          status: 'PENDING'
        });

      if (dbError) throw dbError;

      // Kemaskini status booking
      await supabase.from('bookings').update({ status: 'PAYMENT_SUBMITTED' }).eq('id', bookingData.id);

      setBookingData({ ...bookingData, status: 'PAYMENT_SUBMITTED' });
      alert('Bukti pembayaran berjaya dihantar!');
    } catch (err: any) {
      alert('Gagal memuat naik resit. ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Semak Status Permohonan</h1>
        
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 gap-5 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">Ticket Number</label>
              <input type="text" required placeholder="Contoh: SPP482" 
                className="w-full p-3 border border-slate-300 rounded-lg uppercase"
                value={ticketNo} onChange={(e) => setTicketNo(e.target.value.toUpperCase())} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">6 Digit Terakhir Kad Pengenalan</label>
              <input type="text" required placeholder="Contoh: 123456" maxLength={6}
                className="w-full p-3 border border-slate-300 rounded-lg"
                value={ic} onChange={(e) => setIc(e.target.value)} />
            </div>
          </div>
          <button type="submit" disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
            <Search className="w-5 h-5" /> {loading ? 'Menyemak...' : 'Semak Status'}
          </button>
          {error && <p className="text-red-600 text-sm mt-4 text-center bg-red-50 p-2 rounded">{error}</p>}
        </form>

        {bookingData && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="border-b pb-4 mb-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">Ticket Number</p>
                <p className="text-2xl font-bold text-slate-900">{bookingData.ticket_no}</p>
              </div>
              <div className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full font-semibold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" /> {bookingData.status}
              </div>
            </div>

            <div className="space-y-3 mb-6 text-slate-700">
              <p><strong>Nama:</strong> {bookingData.applicant_name}</p>
              <p><strong>Tarikh:</strong> {bookingData.start_date} hingga {bookingData.end_date}</p>
              <p><strong>Jumlah Bayaran:</strong> RM{bookingData.final_total}</p>
            </div>

            {bookingData.status === 'WAITING_PAYMENT' && (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3">Maklumat Pembayaran</h3>
                <div className="bg-white p-4 rounded border border-slate-200 mb-4 text-sm font-mono text-slate-700">
                  <p>Bank: MAYBANK</p>
                  <p>Akaun: SURAU PJ PERDANA</p>
                  <p>No: 5621 1234 5678</p>
                </div>
                
                <label className="block w-full cursor-pointer bg-blue-50 hover:bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg p-6 text-center transition">
                  <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={handleUpload} disabled={uploading} />
                  <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <span className="text-blue-700 font-semibold">{uploading ? 'Memuat naik...' : 'Klik untuk muat naik resit'}</span>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG atau PDF (Max 2MB)</p>
                </label>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
