import { useState, useEffect } from 'react';
import { Users, Search, Loader2, Eye, Mail, Globe, Phone, X, CalendarDays, MessageSquare, FileText, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Patient {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  nationality: string | null;
  role: string;
  created_at: string;
  bookings?: { count: number }[];
}

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Patient | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  useEffect(() => { fetchPatients(); }, []);

  async function fetchPatients() {
    setIsLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'patient')
      .order('created_at', { ascending: false });
    setPatients(data || []);
    setIsLoading(false);
  }

  async function fetchPatientBookings(patientId: string) {
    setLoadingBookings(true);
    const { data } = await supabase
      .from('bookings')
      .select('*, treatment:treatments(name), hospital:hospitals(name)')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    setBookings(data || []);
    setLoadingBookings(false);
  }

  async function fetchPatientDocuments(patientId: string) {
    setLoadingDocuments(true);
    try {
      const { data: storageFiles } = await supabase.storage
        .from('patient-documents')
        .list(patientId);

      if (storageFiles && storageFiles.length > 0) {
        const fileData = await Promise.all(
          storageFiles.map(async (file) => {
            const path = `${patientId}/${file.name}`;
            const { data } = await supabase.storage
              .from('patient-documents')
              .createSignedUrl(path, 3600);
            
            return {
              name: file.name.split('-').slice(1).join('-') || file.name,
              size: file.metadata?.size || 0,
              url: data?.signedUrl || '',
            };
          })
        );
        setDocuments(fileData);
      } else {
        setDocuments([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDocuments(false);
    }
  }

  const openPatient = (p: Patient) => {
    setSelected(p);
    fetchPatientBookings(p.id);
    fetchPatientDocuments(p.id);
  };

  const filtered = patients.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.country?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor: Record<string, string> = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-purple-100 text-purple-700',
    in_progress: 'bg-blue-100 text-primary-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-dark">Patient Management</h1>
          <p className="text-slate-500">Browse and manage all registered patients.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-2xl">
          <Users className="w-5 h-5 text-primary-600" />
          <span className="font-black text-primary-700">{patients.length} Patients</span>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or country..." className="input pl-10 w-full" />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Patient', 'Country', 'Phone', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-16 text-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-400">No patients found</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center text-primary-700 font-black text-sm">
                        {p.full_name?.[0] ?? '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-dark">{p.full_name || '—'}</p>
                        <p className="text-xs text-slate-400">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Globe className="w-4 h-4 text-slate-400" /> {p.country || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" /> {p.phone || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(p.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openPatient(p)} className="p-2 hover:bg-primary-50 rounded-lg text-slate-400 hover:text-primary-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-700 font-black text-lg">
                  {selected.full_name?.[0] ?? '?'}
                </div>
                <div>
                  <h2 className="text-xl font-black text-dark">{selected.full_name || 'Unknown'}</h2>
                  <p className="text-sm text-slate-500">{selected.email}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              {/* Profile Info */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Globe, label: 'Country', value: selected.country },
                  { icon: Globe, label: 'Nationality', value: selected.nationality },
                  { icon: Phone, label: 'Phone', value: selected.phone },
                  { icon: Mail, label: 'Email', value: selected.email },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </p>
                    <p className="font-bold text-dark text-sm">{value || '—'}</p>
                  </div>
                ))}
              </div>

              {/* Medical Documents */}
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Medical Documents
                </h3>
                {loadingDocuments ? (
                  <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No documents uploaded</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="min-w-0 flex-1 mr-3">
                          <p className="font-bold text-dark text-xs truncate">{doc.name}</p>
                          <p className="text-[10px] text-slate-400">{(doc.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="p-2 bg-white rounded-xl text-primary-600 hover:text-primary-700 shadow-sm border border-slate-100 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bookings */}
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> Booking History
                </h3>
                {loadingBookings ? (
                  <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map(b => (
                      <div key={b.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="font-bold text-dark text-sm">{b.treatment?.name}</p>
                          <p className="text-xs text-slate-400">{b.hospital?.name} · {b.travel_month}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColor[b.status] || 'bg-slate-100 text-slate-500'}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
