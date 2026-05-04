import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  Star, 
  ShieldCheck, 
  Search,
  Award,
  Building2
} from 'lucide-react';
import { getDoctors } from '../lib/api/doctors';
import type { Database } from '../types/supabase';
import PageMeta from '../components/common/PageMeta';

type Doctor = Database['public']['Tables']['doctors']['Row'];

const SPECIALTIES = ['All', 'Orthopedic', 'Cardiac', 'IVF', 'Oncology', 'Cosmetic', 'Neuro', 'Dental', 'Eye'];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Failed to load doctors:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  const filtered = doctors.filter(d => {
    const matchSearch = d.name?.toLowerCase().includes(search.toLowerCase()) || d.specialty?.toLowerCase().includes(search.toLowerCase());
    const matchSpec = specialty === 'All' || d.specialty === specialty;
    // Note: Doctor table might not have city, but we can filter by hospital later if needed.
    // For now, let's just do search and specialty.
    return matchSearch && matchSpec;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <PageMeta 
        title="Top Medical Specialists & Surgeons" 
        description="Find and consult with India's top fellowship-trained doctors and surgeons across various medical specialties." 
      />
      {/* Premium Header */}
      <div className="relative pt-32 pb-24 bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-dark" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="section-tag !text-primary-400">Expert Specialists</span>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              World-Class <span className="text-primary-400">Physicians</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              Consult with fellowship-trained surgeons and internationally recognized medical experts dedicated to your care.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20">
        {/* Advanced Filters */}
        <div className="premium-card !p-4 mb-10 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by doctor name or specialty..."
              className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-dark font-medium focus:ring-0 placeholder:text-slate-400"
            />
          </div>
          <div className="h-8 w-px bg-slate-100 hidden lg:block" />
          <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                onClick={() => setSpecialty(s)}
                className={`whitespace-nowrap px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  specialty === s 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-dark'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="premium-card animate-pulse h-80 bg-slate-100 border-none" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((d) => (
              <div key={d.id} className="premium-card group !p-0 overflow-hidden flex flex-col h-full hover:!border-primary-500 transition-all duration-500 shadow-xl hover:shadow-primary-500/10">
                <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden flex-shrink-0">
                  {d.photo_url ? (
                    <img src={d.photo_url} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Stethoscope className="w-16 h-16 text-slate-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <Link to={`/book/step-1?doctor=${d.id}`} className="btn-primary !w-full !py-3 !text-xs justify-center shadow-none">
                      Request Consultation
                    </Link>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <p className="text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{d.specialty}</p>
                    <h3 className="text-xl font-bold text-dark group-hover:text-primary-600 transition-colors leading-tight">
                      {d.name}
                    </h3>
                    <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-wider">{d.experience_yrs} Years Experience</p>
                  </div>

                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                      <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-primary-500">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      Fellowship Trained
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                      <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-success">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      Verified Expert
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-black text-dark">4.9</span>
                    </div>
                    <Link to={`/hospitals/${d.hospital_id}`} className="text-slate-400 hover:text-primary-500 transition-colors">
                      <Building2 className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
