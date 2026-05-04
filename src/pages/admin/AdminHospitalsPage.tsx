import { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Pencil, 
  Trash2, 
  ExternalLink,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ShieldCheck,
  Star
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

type Hospital = Database['public']['Tables']['hospitals']['Row'];

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  async function fetchHospitals() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .order('name');
    if (!error) setHospitals(data || []);
    setIsLoading(false);
  }

  const filtered = hospitals.filter(h => 
    h.name?.toLowerCase().includes(search.toLowerCase()) || 
    h.city?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Process accreditations from checkboxes or comma-separated string
    const accStr = formData.get('accreditations') as string;
    const accArray = accStr.split(',').map(s => s.trim()).filter(Boolean);

    const data = {
      name: formData.get('name') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      address: formData.get('address') as string,
      rating: Number(formData.get('rating')),
      review_count: Number(formData.get('review_count')),
      accreditations: accArray,
      partner_status: formData.get('partner_status') as string,
    };

    try {
      if (editingHospital) {
        const { error } = await supabase
          .from('hospitals')
          .update(data)
          .eq('id', editingHospital.id);
        if (error) throw error;
        setNotification({ type: 'success', message: 'Hospital updated successfully' });
      } else {
        const { error } = await supabase
          .from('hospitals')
          .insert(data);
        if (error) throw error;
        setNotification({ type: 'success', message: 'Hospital added successfully' });
      }
      setIsModalOpen(false);
      setEditingHospital(null);
      fetchHospitals();
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message });
    } finally {
      setFormLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hospital?')) return;
    const { error } = await supabase.from('hospitals').delete().eq('id', id);
    if (!error) {
      setNotification({ type: 'success', message: 'Hospital deleted' });
      fetchHospitals();
    } else {
      setNotification({ type: 'error', message: error.message });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Hospitals</h1>
          <p className="text-gray-500">Manage partner hospitals and their credentials.</p>
        </div>
        <button 
          onClick={() => { setEditingHospital(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Hospital
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
            placeholder="Search hospitals..." 
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((h) => (
            <div key={h.id} className="card p-6 group hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-dark">{h.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {h.city}, {h.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEditingHospital(h); setIsModalOpen(true); }}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-500 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(h.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {(h.accreditations || []).map((acc) => (
                  <span key={acc} className="badge badge-blue text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> {acc}
                  </span>
                ))}
                <span className={`badge ${h.partner_status === 'gold' ? 'badge-amber' : 'badge-blue'} text-xs font-bold uppercase`}>
                  {h.partner_status} Partner
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold">{h.rating}</span>
                  <span className="text-xs text-gray-400">({h.review_count} reviews)</span>
                </div>
                <a href={`/hospitals/${h.id}`} target="_blank" className="text-primary-500 text-xs font-bold flex items-center gap-1 hover:underline">
                  View Profile <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hospital Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-dark">
                {editingHospital ? 'Edit Hospital' : 'Add New Hospital'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="label">Hospital Name</label>
                  <input name="name" defaultValue={editingHospital?.name || ''} className="input" placeholder="e.g. Apollo Hospitals" required />
                </div>
                <div>
                  <label className="label">City</label>
                  <input name="city" defaultValue={editingHospital?.city || ''} className="input" placeholder="e.g. Delhi" required />
                </div>
                <div>
                  <label className="label">State</label>
                  <input name="state" defaultValue={editingHospital?.state || ''} className="input" placeholder="e.g. Delhi NCR" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Full Address</label>
                  <input name="address" defaultValue={editingHospital?.address || ''} className="input" placeholder="123 Hospital Lane..." />
                </div>
                <div>
                  <label className="label">Rating (1-5)</label>
                  <input type="number" step="0.1" name="rating" defaultValue={editingHospital?.rating || '4.5'} className="input" required />
                </div>
                <div>
                  <label className="label">Review Count</label>
                  <input type="number" name="review_count" defaultValue={editingHospital?.review_count || '0'} className="input" required />
                </div>
                <div>
                  <label className="label">Accreditations (comma separated)</label>
                  <input name="accreditations" defaultValue={editingHospital?.accreditations?.join(', ') || 'NABH, JCI'} className="input" placeholder="NABH, JCI" />
                </div>
                <div>
                  <label className="label">Partner Status</label>
                  <select name="partner_status" defaultValue={editingHospital?.partner_status || 'verified'} className="input">
                    <option value="verified">Verified</option>
                    <option value="gold">Gold</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={formLoading} className="btn-primary min-w-[120px]">
                  {formLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingHospital ? 'Save Changes' : 'Add Hospital')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
