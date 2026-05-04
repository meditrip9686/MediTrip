import { useState, useEffect } from 'react';
import { 
  UserRound, 
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
  Building2,
  GraduationCap,
  History,
  Star
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

type Doctor = Database['public']['Tables']['doctors']['Row'] & {
  hospital?: { name: string };
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<{ id: string, name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchDoctors();
    fetchHospitals();
  }, []);

  async function fetchDoctors() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('doctors')
      .select('*, hospital:hospitals(name)')
      .order('name');
    if (!error) setDoctors(data || []);
    setIsLoading(false);
  }

  async function fetchHospitals() {
    const { data } = await supabase.from('hospitals').select('id, name');
    if (data) setHospitals(data);
  }

  const filtered = doctors.filter(d => 
    d.name?.toLowerCase().includes(search.toLowerCase()) || 
    d.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get('name') as string,
      specialty: formData.get('specialty') as string,
      hospital_id: formData.get('hospital_id') as string,
      degree: formData.get('degree') as string,
      experience_yrs: Number(formData.get('experience_yrs')),
      success_rate: Number(formData.get('success_rate')),
      bio: formData.get('bio') as string,
      is_verified: formData.get('is_verified') === 'on',
      photo_url: formData.get('photo_url') as string || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
    };

    try {
      if (editingDoctor) {
        const { error } = await supabase
          .from('doctors')
          .update(data)
          .eq('id', editingDoctor.id);
        if (error) throw error;
        setNotification({ type: 'success', message: 'Doctor updated successfully' });
      } else {
        const { error } = await supabase
          .from('doctors')
          .insert(data);
        if (error) throw error;
        setNotification({ type: 'success', message: 'Doctor added successfully' });
      }
      setIsModalOpen(false);
      setEditingDoctor(null);
      fetchDoctors();
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message });
    } finally {
      setFormLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (!error) {
      setNotification({ type: 'success', message: 'Doctor deleted' });
      fetchDoctors();
    } else {
      setNotification({ type: 'error', message: error.message });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Doctors</h1>
          <p className="text-gray-500">Manage medical specialists and their credentials.</p>
        </div>
        <button 
          onClick={() => { setEditingDoctor(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Doctor
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
            placeholder="Search doctors by name or specialty..." 
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <div key={d.id} className="card p-6 group hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src={d.photo_url || ''} alt={d.name || ''} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-50" />
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="text-lg font-bold text-dark">{d.name}</h3>
                      {d.is_verified && <CheckCircle2 className="w-4 h-4 text-primary-500" />}
                    </div>
                    <p className="text-sm text-primary-500 font-medium">{d.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEditingDoctor(d); setIsModalOpen(true); }}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-500 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(d.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span>{d.hospital?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span>{d.degree}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <History className="w-4 h-4 text-gray-400" />
                  <span>{d.experience_yrs} Years Experience</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1 text-emerald-600">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold">{d.success_rate}% Success</span>
                </div>
                <button className="text-primary-500 text-xs font-bold flex items-center gap-1 hover:underline">
                  View Bio <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-dark">
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label">Full Name</label>
                  <input name="name" defaultValue={editingDoctor?.name || ''} className="input" placeholder="Dr. John Doe" required />
                </div>
                <div>
                  <label className="label">Specialty</label>
                  <input name="specialty" defaultValue={editingDoctor?.specialty || ''} className="input" placeholder="e.g. Cardiology" required />
                </div>
                <div>
                  <label className="label">Hospital</label>
                  <select name="hospital_id" defaultValue={editingDoctor?.hospital_id || ''} className="input" required>
                    <option value="">Select Hospital</option>
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Degree</label>
                  <input name="degree" defaultValue={editingDoctor?.degree || ''} className="input" placeholder="e.g. MBBS, MD" required />
                </div>
                <div>
                  <label className="label">Experience (Years)</label>
                  <input type="number" name="experience_yrs" defaultValue={editingDoctor?.experience_yrs || ''} className="input" placeholder="15" required />
                </div>
                <div>
                  <label className="label">Success Rate (%)</label>
                  <input type="number" name="success_rate" defaultValue={editingDoctor?.success_rate || ''} className="input" placeholder="95" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Photo URL</label>
                  <input name="photo_url" defaultValue={editingDoctor?.photo_url || ''} className="input" placeholder="https://..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Bio</label>
                  <textarea name="bio" defaultValue={editingDoctor?.bio || ''} className="input min-h-[100px] py-3" placeholder="Brief professional background..." />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" name="is_verified" defaultChecked={editingDoctor?.is_verified || false} id="is_verified" className="w-5 h-5 rounded-lg border-gray-300 text-primary-500 focus:ring-primary-500" />
                  <label htmlFor="is_verified" className="text-sm font-medium text-dark cursor-pointer">Verified Profile</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={formLoading} className="btn-primary min-w-[120px]">
                  {formLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingDoctor ? 'Save Changes' : 'Add Doctor')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
