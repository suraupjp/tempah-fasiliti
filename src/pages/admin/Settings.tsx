import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../lib/supabaseClient';
import { Save, Phone, Building2, Loader2 } from 'lucide-react';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    whatsapp_number: '',
    bank_name: '',
    account_name: '',
    account_number: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'site_config')
      .single();

    if (data && data.value) {
      setFormData(data.value);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ 
          key: 'site_config', 
          value: formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Tetapan berjaya disimpan.');
    } catch (err: any) {
      alert('Ralat menyimpan tetapan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Tetapan Sistem</h1>
        <p className="text-slate-500 text-sm mt-1">Urus maklumat WhatsApp AJK dan butiran akaun bank rasmi surau.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Memuatkan tetapan...</div>
      ) : (
        <form onSubmit={handleSave} className="max-w-2xl bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          
          {/* Seksyen WhatsApp */}
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-green-600" /> Notifikasi WhatsApp
            </h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombor Telefon AJK (Format Antarabangsa)</label>
              <input type="text" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} placeholder="Contoh: 60123456789" required
                className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-blue-500 outline-none max-w-md" />
              <p className="text-xs text-slate-500 mt-1">Sistem akan menggunakan nombor ini untuk menjana pautan WhatsApp automatik bagi pemohon.</p>
            </div>
          </div>

          {/* Seksyen Bank */}
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-600" /> Maklumat Akaun Bank
            </h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Bank</label>
                <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} placeholder="Contoh: Maybank" required
                  className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Akaun</label>
                <input type="text" name="account_name" value={formData.account_name} onChange={handleChange} placeholder="Contoh: SURAU PJ PERDANA" required
                  className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombor Akaun</label>
                <input type="text" name="account_number" value={formData.account_number} onChange={handleChange} placeholder="Contoh: 562112345678" required
                  className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="p-6 bg-slate-50 flex justify-end">
            <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-md flex items-center gap-2 transition shadow-sm">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
              Simpan Tetapan
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
