import { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  X,
  User,
  Building2,
  Stethoscope
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, treatment:treatments(name), hospital:hospitals(name), patient:profiles!patient_id(full_name, email)')
      .order('created_at', { ascending: false });
    if (!error) setBookings(data || []);
    setIsLoading(false);
  }

  const filtered = bookings.filter(b => 
    b.patient?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.treatment?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.hospital?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true);
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (!error) {
      fetchBookings();
      setSelectedBooking((prev: any) => prev ? { ...prev, status } : prev);
      setNotification({ type: 'success', message: `Booking marked as ${status}` });
      setTimeout(() => setNotification(null), 3000);
    }
    setUpdating(false);
  };

  const saveAdminNotes = async (id: string) => {
    setSavingNotes(true);
    const { error } = await supabase.from('bookings').update({ admin_notes: adminNotes }).eq('id', id);
    if (!error) {
      setNotification({ type: 'success', message: 'Admin notes saved' });
      setTimeout(() => setNotification(null), 3000);
    }
    setSavingNotes(false);
  };

  const getStatusBadge = (status: string | null) => {
    const map: Record<string, string> = {
      confirmed: 'bg-emerald-100 text-emerald-700',
      pending: 'bg-amber-100 text-amber-700',
      cancelled: 'bg-red-100 text-red-700',
      in_progress: 'bg-blue-100 text-primary-700',
      completed: 'bg-purple-100 text-purple-700',
      draft: 'bg-slate-100 text-slate-600',
    };
    const label = status === 'in_progress' ? 'In Progress' : (status?.charAt(0).toUpperCase() + (status?.slice(1) || ''));
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${map[status || ''] || 'bg-slate-100 text-slate-500'}`}>{label}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Bookings</h1>
          <p className="text-gray-500">Monitor and manage patient medical journeys.</p>
        </div>
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
            placeholder="Search by patient, treatment, or hospital..." 
            className="input pl-10 w-full"
          />
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Patient</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Treatment</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Hospital</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Travel</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">No bookings found</td>
                </tr>
              ) : filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 font-bold">
                        {b.patient?.full_name?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-dark">{b.patient?.full_name}</p>
                        <p className="text-xs text-gray-400">{b.patient?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-dark">{b.treatment?.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {b.hospital?.name}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-dark font-medium">{b.travel_month}</p>
                    <p className="text-xs text-gray-400">{b.travel_flexible ? 'Flexible' : 'Fixed'}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(b.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { setSelectedBooking(b); setIsModalOpen(true); }}
                      className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-primary-500 transition-all border border-transparent hover:border-gray-100 hover:shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-bold text-dark">Booking Details</h2>
                <span className="text-xs font-mono text-gray-400 px-2 py-1 bg-white rounded-lg border border-gray-100">
                  ID: {selectedBooking.id.split('-')[0]}...
                </span>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <User className="w-3 h-3" /> Patient Information
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="font-bold text-dark">{selectedBooking.patient?.full_name}</p>
                    <p className="text-sm text-gray-500">{selectedBooking.patient?.email}</p>
                    <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                      <p><strong>Nationality:</strong> {selectedBooking.patient?.nationality || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Stethoscope className="w-3 h-3" /> Medical Details
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-sm font-bold text-dark mb-1">{selectedBooking.treatment?.name}</p>
                    <p className="text-xs text-gray-500 italic">"{selectedBooking.medical_summary}"</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Building2 className="w-3 h-3" /> Trip & Hospital
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Hospital:</span>
                      <span className="font-bold text-dark">{selectedBooking.hospital?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Travel Date:</span>
                      <span className="font-bold text-dark">{selectedBooking.travel_month}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Companions:</span>
                      <span className="font-bold text-dark">{selectedBooking.companions}</span>
                    </div>
                  </div>
                </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3" /> Update Status
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(selectedBooking.id, s)}
                          disabled={updating || selectedBooking.status === s}
                          className={`px-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider capitalize transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                            selectedBooking.status === s
                              ? 'bg-primary-600 text-white'
                              : s === 'cancelled' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="px-8 pb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Admin Notes (Internal)</h3>
              <div className="flex gap-3">
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this booking (not visible to patient)..."
                  className="input flex-1 min-h-[80px] py-3 text-sm"
                />
                <button
                  onClick={() => saveAdminNotes(selectedBooking.id)}
                  disabled={savingNotes}
                  className="btn-primary px-4 self-end rounded-xl"
                >
                  {savingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                </button>
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
