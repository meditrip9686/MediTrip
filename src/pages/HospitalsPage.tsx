import { Link } from 'react-router-dom';
import { 
  Building2, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Users2, 
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getHospitals } from '../lib/api/hospitals';
import type { Database } from '../types/supabase';
import PageMeta from '../components/common/PageMeta';

type Hospital = Database['public']['Tables']['hospitals']['Row'];

const CITIES = ['All', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'];
const SPECIALTIES = ['All', 'Orthopedic', 'Cardiac', 'IVF', 'Oncology', 'Cosmetic', 'Neuro'];

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState('All');
  const [specialty, setSpecialty] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchHospitals() {
      try {
        const data = await getHospitals();
        setHospitals(data);
      } catch (error) {
        console.error('Failed to load hospitals:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHospitals();
  }, []);

  const filtered = hospitals.filter((h) => {
    const matchCity = city === 'All' || h.city?.toLowerCase().includes(city.toLowerCase()) || h.state?.toLowerCase().includes(city.toLowerCase());
    const matchSpec = specialty === 'All' || (h.specialties && h.specialties.includes(specialty));
    const matchSearch = h.name?.toLowerCase().includes(search.toLowerCase()) || h.city?.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSpec && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <PageMeta 
        title="JCI-Accredited Partner Hospitals" 
        description="Explore our network of premium, internationally accredited partner hospitals in India equipped with state-of-the-art facilities." 
      />
      {/* Premium Header */}
      <div className="relative pt-32 pb-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-slate-900" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="section-tag !text-primary-400">Accredited Network</span>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Partner <span className="text-primary-400">Hospitals</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              We partner exclusively with JCI and NABH accredited facilities that meet the highest international standards of clinical excellence and patient safety.
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
              placeholder="Search by hospital name or city..."
              className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-dark font-medium focus:ring-0 placeholder:text-slate-400"
            />
          </div>
          <div className="h-8 w-px bg-slate-100 hidden lg:block" />
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest min-w-[50px]">City</span>
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    city === c ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest min-w-[50px]">Specialty</span>
              {SPECIALTIES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpecialty(s)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    specialty === s ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-10 px-2">
          <p className="text-slate-500 font-medium">
            Found <span className="text-dark font-bold">{filtered.length}</span> verified hospitals
          </p>
          <div className="flex items-center gap-2 text-primary-600 font-bold text-sm cursor-pointer hover:text-primary-700 transition-colors">
            <Filter className="w-4 h-4" /> Reset Filters
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="premium-card animate-pulse h-64 bg-slate-100 border-none" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((h) => (
              <div key={h.id} className="premium-card group !p-0 overflow-hidden flex flex-col sm:flex-row h-full">
                {/* Hospital Image / Icon */}
                <div className="w-full sm:w-48 bg-slate-100 relative overflow-hidden flex-shrink-0">
                  {h.images && h.images[0] ? (
                    <img src={h.images[0]} alt={h.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      Partner
                    </span>
                  </div>
                </div>

                {/* Hospital Details */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-extrabold text-dark group-hover:text-primary-600 transition-colors leading-tight mb-2">{h.name}</h2>
                      <p className="text-slate-500 text-sm font-bold flex items-center gap-1.5 uppercase tracking-wide">
                        <MapPin className="w-4 h-4 text-primary-500" /> {h.city}, {h.state}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
                    {h.description}
                  </p>

                  <div className="flex items-center gap-6 mb-8 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <span className="text-sm font-bold text-dark">{h.rating}</span>
                      <span className="text-xs text-slate-400 font-medium">({h.review_count})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users2 className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Verified</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {(h.accreditations || []).map((a) => (
                      <span key={a} className="badge-blue !bg-primary-50 !text-primary-600 flex items-center gap-1 text-[10px]">
                        <ShieldCheck className="w-3 h-3" /> {a}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Link to={`/hospitals/${h.id}`} className="btn-primary !py-3 !text-sm flex-1 justify-center shadow-none">
                      View Profile <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <Link to={`/book/step-1?hospital=${h.id}`} className="btn-secondary !py-3 !text-sm flex-1 justify-center">
                      Book Care
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
