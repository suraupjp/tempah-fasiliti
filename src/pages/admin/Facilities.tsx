import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../lib/supabaseClient';
import { formatCurrency } from '../../lib/utils';
import { Plus, Edit2, X, Power, Loader2, ImageIcon } from 'lucide-react';

export default function Facilities() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // State fail gambar yang baru dipilih
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // State untuk borang (Add / Edit) - Tambah images array
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: 0, pricing_type: 'Per Hari', active: true, images: [] as string[]
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
    setSelectedFiles([]); // Kosongkan pilihan fail lama
    if (facility) {
      setEditingId(facility.id);
      setFormData({
        name: facility.name, description: facility.description, 
        price: facility.price, pricing_type: facility.pricing_type, active: facility.active,
        images: facility.images || []
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', price: 0, pricing_type: 'Per Hari', active: true, images: [] });
    }
    setIsModalOpen(true);
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = formData.images.filter((_, index) => index !== indexToRemove);
    setFormData({ ...formData, images: newImages });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      let imageUrls = [...formData.images];

      // 1. Proses muat naik gambar baharu (jika ada dipilih)
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileExt = file.name.split('.').pop();
          // Jana nama unik untuk gambar
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('fasiliti')
            .upload(fileName, file);
            
          if (uploadError) throw uploadError;
          
          // Dapatkan URL awam gambar tersebut
          const { data: { publicUrl } } = supabase.storage
            .from('fasiliti')
            .getPublicUrl(fileName);
            
          imageUrls.push(publicUrl);
        }
      }

      // Gabungkan URL gambar dengan data borang
      const finalData = { ...formData, images: imageUrls };

      if (editingId) {
        // Update rekod
        const { error } = await supabase.from('facilities').update(finalData).eq('id', editingId);
        if (error) throw error;
      } else {
        // Insert rekod baharu
        const { error } = await supabase.from('facilities').insert([finalData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchFacilities();
    } catch (err: any) {
      alert('Ralat menyimpan fasiliti: ' + err.message);
    } finally {
      setProcessing(false);
      setSelectedFiles([]);
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
                  <td className="px-6 py-4 flex gap-4 items-center">
                    {/* Thumbnail Kecil di Table */}
                    {facility.images && facility.images.length > 0 ? (
                      <img src={facility.images[0]} alt="thumb" className="w-12 h-12 rounded object-cover border border-slate-200" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">{facility.name}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">{facility.description}</p>
                    </div>
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
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60] overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden my-8">
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Gambar Fasiliti (Boleh pilih lebih dari 1)</label>
                
                {/* Pratonton Gambar Sedia Ada */}
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-3">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 group">
                        <img src={img} alt="Preview" className="w-full h-full object-cover rounded-md border border-slate-200" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Input Pilih Gambar Baru */}
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-slate-200 rounded-md p-1" 
                />
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
                <button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed">
                  {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Sedang Muat Naik...</> : 'Simpan Fasiliti'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
