import { useState } from 'react';
import { Calendar, Search } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import FacilityCard from '../../components/public/FacilityCard';
import { generateTicketNumber, formatCurrency } from '../../lib/utils';

export default function LandingPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNo, setTicketNo] = useState('');

  // Dummy data sementara sebelum pangkalan data penuh
  const facilities = [
    { id: '1', name: 'Dewan Utama', description: 'Sesuai untuk program, mesyuarat dan aktiviti komuniti.', price: 700, pricing_type: 'Per Hari' }
  ];

  const duration = (startDate && endDate) ? Math.max(1, differenceInDays(new Date(endDate), new Date(startDate))) : 0;
  const selectedFacility = facilities.find(f => f.id === selectedFacilityId);
  const totalAmount = selectedFacility ? selectedFacility.price * duration : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket = generateTicketNumber();
    setTicketNo(newTicket);
    setIsSubmitted(true);
    // Di sini kita akan masukkan fungsi hantar data ke Supabase nanti
  };

  if (isSubmitted) {
    const whatsappMsg = `Assalamualaikum AJK Fasiliti Surau PJ Perdana.\nPermohonan tempahan baharu telah diterima.\nTicket: ${ticketNo}\nTarikh: ${startDate} hingga ${endDate}\nSila semak permohonan melalui sistem.`;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">✓</div>
          <h2 className="text-2xl font-bold mb-2">PERMOHONAN BERJAYA</h2>
          <div className="bg-slate-100 p-4 rounded-lg mb-4">
            <p className="text-sm text-slate-500 mb-1">Ticket Number:</p>
            <p className="text-4xl font-mono font-bold tracking-wider text-blue-700">{ticketNo}</p>
            <p className="mt-2 text-sm text-slate-600 font-medium">🟡 MENUNGGU SEMAKAN</p>
          </div>
          <p className="text-sm text-slate-600 mb-6">Sila simpan Ticket Number anda. Anda memerlukannya bersama 6 digit terakhir No. Kad Pengenalan untuk menyemak status permohonan.</p>
          <a href={`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noreferrer" className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mb-3">
            BUKA WHATSAPP
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-20 pb-32 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Sistem Tempahan Fasiliti</h1>
        <p className="text-lg text-slate-300">Surau PJ Perdana</p>
      </div>

      {/* Kalendar & Carian */}
      <div className="max-w-4xl mx-auto -mt-16 px-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full">
            <label className="block text-sm font-semibold mb-1">Tarikh Mula</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input type="date" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
          </div>
          <div className="w-full">
            <label className="block text-sm font-semibold mb-1">Tarikh Tamat</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input type="date" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} />
            </div>
          </div>
        </div>
      </div>

      {/* Senarai Fasiliti */}
      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Fasiliti Tersedia</h2>
        {facilities.map(facility => (
          <FacilityCard 
            key={facility.id} id={facility.id} name={facility.name} description={facility.description} price={facility.price} pricingType={facility.pricing_type} isSelected={selectedFacilityId === facility.id} onSelect={setSelectedFacilityId}
          />
        ))}
      </div>

      {/* Borang Pemohon */}
      {selectedFacilityId && duration > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold mb-6 border-b pb-4">Maklumat Pemohon</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div><label className="block text-sm font-semibold mb-1">Nama Pemohon *</label><input type="text" required className="w-full p-3 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-semibold mb-1">No. Kad Pengenalan *</label><input type="text" required placeholder="Contoh: 900101-14-5555" className="w-full p-3 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-semibold mb-1">No. Telefon *</label><input type="tel" required className="w-full p-3 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-semibold mb-1">Email (Pilihan)</label><input type="email" className="w-full p-3 border border-gray-300 rounded-lg" /></div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-5 h-5" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span className="text-sm text-gray-700">"Saya bertanggungjawab menjaga kebersihan, keselamatan dan keadaan semua fasiliti yang digunakan sepanjang tempoh tempahan. Saya bertanggungjawab sepenuhnya terhadap sebarang kerosakan, kehilangan atau kerugian yang berlaku akibat penggunaan fasiliti dan bersetuju menanggung kos pembaikan atau penggantian yang berkaitan."</span>
              </label>
            </div>
            
            <button type="submit" disabled={!agreed} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition text-lg shadow-lg">
              Hantar Permohonan ({formatCurrency(totalAmount)})
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
