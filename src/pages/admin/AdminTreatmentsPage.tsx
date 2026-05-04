import { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Plus, 
  Search, 
  Filter, 
  Pencil, 
  Trash2, 
  ExternalLink,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

type Treatment = Database['public']['Tables']['treatments']['Row'];

export default function AdminTreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchTreatments();
  }, []);

  async function fetchTreatments() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('treatments')
      .select('*')
      .order('name');
    if (!error) setTreatments(data || []);
    setIsLoading(false);
  }

  const filtered = treatments.filter(t => 
    t.name?.toLowerCase().includes(search.toLowerCase()) || 
    t.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      slug: (formData.get('name') as string).toLowerCase().replace(/ /g, '-'),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      avg_cost_min: Number(formData.get('avg_cost_min')),
      avg_cost_max: Number(formData.get('avg_cost_max')),
      recovery_days: Number(formData.get('recovery_days')),
      success_rate: Number(formData.get('success_rate')),
    };

    try {
      if (editingTreatment) {
        const { error } = await supabase
          .from('treatments')
          .update(data)
          .eq('id', editingTreatment.id);
        if (error) throw error;
        setNotification({ type: 'success', message: 'Treatment updated successfully' });
      } else {
        const { error } = await supabase
          .from('treatments')
          .insert(data);
        if (error) throw error;
        setNotification({ type: 'success', message: 'Treatment added successfully' });
      }
      setIsModalOpen(false);
      setEditingTreatment(null);
      fetchTreatments();
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message });
    } finally {
      setFormLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this treatment?')) return;
    const { error } = await supabase.from('treatments').delete().eq('id', id);
    if (!error) {
      setNotification({ type: 'success', message: 'Treatment deleted' });
      fetchTreatments();
    } else {
      setNotification({ type: 'error', message: error.message });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Treatments</h1>
          <p className="text-gray-500">Manage medical procedures and pricing ranges.</p>
        </div>
        <button 
          onClick={() => { setEditingTreatment(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Treatment
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
            placeholder="Search treatments..." 
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
          {filtered.map((t) => (
            <div key={t.id} className="card p-6 group hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEditingTreatment(t); setIsModalOpen(true); }}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-500 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(t.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-dark mb-1">{t.name}</h3>
              <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-4">{t.category}</p>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 mb-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Avg. Cost</p>
                  <p className="font-bold text-dark">₹{(Number(t.avg_cost_min)/100000).toFixed(1)}L - ₹{(Number(t.avg_cost_max)/100000).toFixed(1)}L</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Success Rate</p>
                  <p className="font-bold text-dark text-emerald-600">{t.success_rate}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Recovery: {t.recovery_days} days</span>
                <a href={`/treatments/${t.slug}`} target="_blank" className="text-primary-500 text-xs font-bold flex items-center gap-1 hover:underline">
                  Preview <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Treatment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-dark">
                {editingTreatment ? 'Edit Treatment' : 'Add New Treatment'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label">Treatment Name</label>
                  <input name="name" defaultValue={editingTreatment?.name || ''} className="input" placeholder="e.g. Knee Replacement" required />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select name="category" defaultValue={editingTreatment?.category || 'Orthopedic'} className="input">
                    <option>Orthopedic</option>
                    <option>Cardiac</option>
                    <option>Oncology</option>
                    <option>IVF</option>
                    <option>Cosmetic</option>
                    <option>Neuro</option>
                    <option>Transplant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea name="description" defaultValue={editingTreatment?.description || ''} className="input min-h-[100px] py-3" placeholder="Brief overview of the treatment..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div>
                  <label className="label">Min Cost (INR)</label>
                  <input type="number" name="avg_cost_min" defaultValue={editingTreatment?.avg_cost_min || ''} className="input" placeholder="300000" required />
                </div>
                <div>
                  <label className="label">Max Cost (INR)</label>
                  <input type="number" name="avg_cost_max" defaultValue={editingTreatment?.avg_cost_max || ''} className="input" placeholder="500000" required />
                </div>
                <div>
                  <label className="label">Recovery (Days)</label>
                  <input type="number" name="recovery_days" defaultValue={editingTreatment?.recovery_days || ''} className="input" placeholder="14" required />
                </div>
                <div>
                  <label className="label">Success Rate (%)</label>
                  <input type="number" name="success_rate" defaultValue={editingTreatment?.success_rate || ''} className="input" placeholder="98" required />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={formLoading} className="btn-primary min-w-[120px]">
                  {formLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingTreatment ? 'Save Changes' : 'Add Treatment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
