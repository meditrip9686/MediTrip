import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight, Activity, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { getTreatments } from '../lib/api/treatments';
import type { Database } from '../types/supabase';
import PageMeta from '../components/common/PageMeta';

type Treatment = Database['public']['Tables']['treatments']['Row'];

const CATEGORIES = ['All', 'Orthopedic', 'Cardiac', 'Cosmetic', 'IVF', 'Dental', 'Neuro', 'Oncology', 'Eye'];

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    async function fetchTreatments() {
      try {
        const data = await getTreatments();
        setTreatments(data);
      } catch (error) {
        console.error('Failed to load treatments:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTreatments();
  }, []);

  const filtered = treatments.filter((t) => {
    const matchSearch = t.name?.toLowerCase().includes(search.toLowerCase()) || false;
    const matchCat = category === 'All' || t.category === category;
    return matchSearch && matchCat;
  });

  const applyCategory = (cat: string) => {
    setCategory(cat);
    if (cat !== 'All' && !activeFilters.includes(cat)) {
      setActiveFilters((p) => [...p.filter((f) => CATEGORIES.includes(f) ? false : true), cat]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <PageMeta 
        title="Medical Treatments & Procedures" 
        description="Browse affordable, high-quality medical treatments and procedures available at JCI-accredited hospitals in India." 
      />
      {/* Premium Header */}
      <div className="relative pt-32 pb-20 bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-dark" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-500/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="section-tag !text-primary-400">Treatment Catalog</span>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Elite Medical <span className="text-primary-400">Procedures</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover world-class medical treatments in India's most prestigious hospitals at a fraction of the global cost.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
        {/* Advanced Search Bar */}
        <div className="glass-card !bg-white p-2 rounded-[32px] shadow-2xl flex flex-col lg:flex-row gap-2 items-stretch lg:items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by procedure name (e.g. Knee Replacement)..."
              className="w-full bg-transparent border-none py-6 pl-14 pr-6 text-dark font-medium focus:ring-0 placeholder:text-slate-400"
            />
          </div>
          <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar p-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => applyCategory(c)}
                className={`whitespace-nowrap px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  category === c 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-dark'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-3 overflow-x-auto py-8 no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => applyCategory(c)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                category === c 
                  ? 'bg-dark text-white shadow-lg shadow-dark/20' 
                  : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8 px-2">
          <p className="text-slate-500 font-medium">
            Showing <span className="text-dark font-bold">{filtered.length}</span> results
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="premium-card animate-pulse h-80 !bg-slate-100 border-none" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 premium-card">
            <SlidersHorizontal className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-dark mb-2">No matching treatments</h3>
            <p className="text-slate-500 mb-8">Try adjusting your search or category filters.</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn-secondary">
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((t) => (
              <Link 
                key={t.id} 
                to={`/treatments/${t.slug}`}
                className="premium-card group flex flex-col !p-0 overflow-hidden"
              >
                {/* Card Body */}
                <div className="p-8 flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 transition-all duration-300">
                      <Activity className="w-6 h-6 text-primary-600 group-hover:text-white" />
                    </div>
                    <span className="badge-blue">{t.category}</span>
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-dark mb-3 group-hover:text-primary-600 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                    {t.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> Avg. Cost
                      </p>
                      <p className="text-sm font-extrabold text-dark">
                        ₹{(t.avg_cost_min || 0).toLocaleString()} +
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Success
                      </p>
                      <p className="text-sm font-extrabold text-success">
                        {t.success_rate}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between group-hover:bg-primary-50 transition-colors">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-tight">
                      {t.recovery_days} Days Recovery
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-primary-600 font-bold text-sm">
                    View <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Need Help CTA */}
        <div className="mt-24 premium-card !bg-primary-600 border-none text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 py-4">
            <h2 className="text-3xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
            <p className="text-primary-100 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
              Our medical consultants can help you find specialized treatments and provide customized cost estimates within 24 hours.
            </p>
            <Link to="/contact" className="btn-secondary !bg-white !text-primary-600 border-none !px-12">
              Speak to a Consultant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
