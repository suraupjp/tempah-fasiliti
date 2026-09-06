import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../lib/supabaseClient';
import { formatCurrency } from '../../lib/utils';
import { Plus, Edit2, X, Power, Loader2 } from 'lucide-react';

export default function Facilities() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // State untuk borang (Add / Edit)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: 0, pricing_type: 'Per Hari', active: true
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('facilities').select('*').order('created_at', { ascending: true });
    if (data) setFacilities(data);
    setLoading(false);
  };

  const openModal = (facility: any = null) => {
    if (facility) {
      setEditingId(facility.id);
      setFormData({
        name: facility.name, description: facility.description, 
        price: facility.price, pricing_type: facility.pricing_type, active: facility.active
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', price: 0, pricing_type: 'Per Hari', active: true });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (editingId) {
        // Update rekod
        const { error } = await supabase.from('facilities').update(formData).eq('id', editingId);
        if (error) throw error;
      } else {
        // Insert rekod baharu
        const { error } = await supabase.from('facilities').insert([formData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchFacilities();
    } catch (err: any) {
      alert('Ralat menyimpan fasiliti: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('facilities').update({ active: !currentStatus }).eq('id', id);
    if (!error) fetchFacilities();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengurusan Fasiliti</h1>
          <p className="text-slate-500 text-sm mt-1">Tambah, edit harga, dan urus status fasiliti surau.</p>
        </div>
        <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md flex items-center gap-2 transition">
          <Plus className="w-4 h-4" /> Tambah Fasiliti
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-semibold">Nama Fasiliti</th>
                <th className="px-6 py-3 font-semibold">Harga</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Memuatkan data...</td></tr>
              ) : facilities.map((facility) => (
                <tr key={facility.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{facility.name}</p>
                    <p className="text-xs text-slate-500 truncate max-w-xs mt-0.5">{facility.description}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {formatCurrency(facility.price)} <span className="text-xs text-slate-500 font-normal">/ {facility.pricing_type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${facility.active ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {facility.active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-2">
                    <button onClick={() => openModal(facility)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-md transition" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => toggleActive(facility.id, facility.active)} className={`${facility.active ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'} p-2 rounded-md transition`} title={facility.active ? "Nyahaktif" : "Aktifkan"}>
                      <Power className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Borang Fasiliti */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900">{editingId ? 'Edit Fasiliti' : 'Tambah Fasiliti Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Fasiliti *</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Ringkas</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-blue-500 outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Harga Asas (RM) *</label>
                  <input type="number" required min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Harga</label>
                  <select value={formData.pricing_type} onChange={e => setFormData({...formData, pricing_type: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-blue-500 outline-none bg-white">
                    <option value="Per Hari">Per Hari</option>
                    <option value="Per Jam">Per Jam</option>
                    <option value="Per Sesi">Per Sesi</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md font-medium transition">Batal</button>
                <button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition">
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Fasiliti'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
