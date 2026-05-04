import { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Pencil, 
  Trash2, 
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Stethoscope,
  Hotel,
  Car,
  Languages,
  Clock,
  Ticket
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

type PackageRow = Database['public']['Tables']['packages']['Row'] & {
  treatment?: { name: string };
  hospital?: { name: string };
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [treatments, setTreatments] = useState<{ id: string, name: string }[]>([]);
  const [hospitals, setHospitals] = useState<{ id: string, name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageRow | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchPackages();
    fetchInitialData();
  }, []);

  async function fetchPackages() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('packages')
      .select('*, treatment:treatments(name), hospital:hospitals(name)')
      .order('price_inr');
    if (!error) setPackages(data || []);
    setIsLoading(false);
  }

  async function fetchInitialData() {
    const [tRes, hRes] = await Promise.all([
      supabase.from('treatments').select('id, name'),
      supabase.from('hospitals').select('id, name')
    ]);
    if (tRes.data) setTreatments(tRes.data);
    if (hRes.data) setHospitals(hRes.data);
  }

  const filtered = packages.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) || 
    p.treatment?.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.hospital?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get('title') as string,
      treatment_id: formData.get('treatment_id') as string,
      hospital_id: formData.get('hospital_id') as string,
      price_inr: Number(formData.get('price_inr')),
      duration_days: Number(formData.get('duration_days')),
      hotel_included: formData.get('hotel_included') === 'on',
      hotel_tier: Number(formData.get('hotel_tier')),
      transfer: formData.get('transfer') === 'on',
      translator: formData.get('translator') === 'on',
      visa_assistance: formData.get('visa_assistance') === 'on',
      is_available: formData.get('is_available') === 'on',
    };

    try {
      if (editingPackage) {
        const { error } = await supabase
          .from('packages')
          .update(data)
          .eq('id', editingPackage.id);
        if (error) throw error;
        setNotification({ type: 'success', message: 'Package updated successfully' });
      } else {
        const { error } = await supabase
          .from('packages')
          .insert(data);
        if (error) throw error;
        setNotification({ type: 'success', message: 'Package added successfully' });
      }
      setIsModalOpen(false);
      setEditingPackage(null);
      fetchPackages();
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message });
    } finally {
      setFormLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (!error) {
      setNotification({ type: 'success', message: 'Package deleted' });
      fetchPackages();
    } else {
      setNotification({ type: 'error', message: error.message });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Packages</h1>
          <p className="text-gray-500">Manage service tiers and inclusions for treatments.</p>
        </div>
        <button 
          onClick={() => { setEditingPackage(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      {notification && (
        <div className={`fixed top-20 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        } animate-in fade-in slide-in-from-right-4`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, treatment or hospital..." 
            className="input pl-10 w-full"
          />
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className={`card p-6 group hover:shadow-xl transition-all duration-300 border-2 ${p.is_available ? 'border-transparent' : 'border-red-100 opacity-75'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                  <Package className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEditingPackage(p); setIsModalOpen(true); }}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-500 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-lg font-bold text-dark truncate">{p.title}</h3>
                  {!p.is_available && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">UNAVAILABLE</span>}
                </div>
                <div className="flex items-center gap-2 text-xs text-primary-500 font-bold uppercase tracking-wider">
                  <Stethoscope className="w-3 h-3" /> {p.treatment?.name}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{p.hospital?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{p.duration_days} Days Duration</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-6">
                <div className={`p-2 rounded-xl flex items-center justify-center ${p.hotel_included ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-300'}`} title="Accommodation">
                  <Hotel className="w-5 h-5" />
                </div>
                <div className={`p-2 rounded-xl flex items-center justify-center ${p.transfer ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-300'}`} title="Airport Transfer">
                  <Car className="w-5 h-5" />
                </div>
                <div className={`p-2 rounded-xl flex items-center justify-center ${p.translator ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-300'}`} title="Translator">
                  <Languages className="w-5 h-5" />
                </div>
                <div className={`p-2 rounded-xl flex items-center justify-center ${p.visa_assistance ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-300'}`} title="Visa Assistance">
                  <Ticket className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div>
                  <p className="text-xs text-gray-400">Total Price</p>
                  <p className="text-xl font-bold text-dark">₹{p.price_inr?.toLocaleString()}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i < (p.hotel_tier || 0) ? 'bg-amber-400' : 'bg-gray-100'}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-dark">
                {editingPackage ? 'Edit Package' : 'Add New Package'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="label">Package Title</label>
                  <input name="title" defaultValue={editingPackage?.title || ''} className="input" placeholder="e.g. Premium Cardiac Care" required />
                </div>
                <div>
                  <label className="label">Treatment</label>
                  <select name="treatment_id" defaultValue={editingPackage?.treatment_id || ''} className="input" required>
                    <option value="">Select Treatment</option>
                    {treatments.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Hospital</label>
                  <select name="hospital_id" defaultValue={editingPackage?.hospital_id || ''} className="input" required>
                    <option value="">Select Hospital</option>
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Price (INR)</label>
                  <input type="number" name="price_inr" defaultValue={editingPackage?.price_inr || ''} className="input" placeholder="500000" required />
                </div>
                <div>
                  <label className="label">Duration (Days)</label>
                  <input type="number" name="duration_days" defaultValue={editingPackage?.duration_days || ''} className="input" placeholder="14" required />
                </div>
                <div>
                  <label className="label">Hotel Tier (1-5 stars)</label>
                  <input type="number" min="0" max="5" name="hotel_tier" defaultValue={editingPackage?.hotel_tier || '3'} className="input" required />
                </div>
                
                <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" name="hotel_included" defaultChecked={editingPackage?.hotel_included || true} id="hotel_included" className="w-5 h-5 rounded-lg border-gray-300 text-primary-500 focus:ring-primary-500" />
                    <label htmlFor="hotel_included" className="text-sm font-medium text-dark cursor-pointer">Hotel</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" name="transfer" defaultChecked={editingPackage?.transfer || true} id="transfer" className="w-5 h-5 rounded-lg border-gray-300 text-primary-500 focus:ring-primary-500" />
                    <label htmlFor="transfer" className="text-sm font-medium text-dark cursor-pointer">Transfer</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" name="translator" defaultChecked={editingPackage?.translator || false} id="translator" className="w-5 h-5 rounded-lg border-gray-300 text-primary-500 focus:ring-primary-500" />
                    <label htmlFor="translator" className="text-sm font-medium text-dark cursor-pointer">Translator</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" name="visa_assistance" defaultChecked={editingPackage?.visa_assistance || true} id="visa_assistance" className="w-5 h-5 rounded-lg border-gray-300 text-primary-500 focus:ring-primary-500" />
                    <label htmlFor="visa_assistance" className="text-sm font-medium text-dark cursor-pointer">Visa Assist</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" name="is_available" defaultChecked={editingPackage?.is_available || true} id="is_available" className="w-5 h-5 rounded-lg border-gray-300 text-primary-500 focus:ring-primary-500" />
                    <label htmlFor="is_available" className="text-sm font-medium text-dark cursor-pointer">Available</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={formLoading} className="btn-primary min-w-[120px]">
                  {formLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingPackage ? 'Save Changes' : 'Add Package')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
