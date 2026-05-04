import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, CheckCircle2, ArrowRight, Building2, Clock,
  Plane, Languages, ShieldCheck, Hotel, Stethoscope, Filter, Search
} from 'lucide-react';
import { getPackages } from '../lib/api/packages';
import PageMeta from '../components/common/PageMeta';

const CATEGORIES = ['All', 'Cardiac', 'Orthopaedic', 'Oncology', 'Neurology', 'Cosmetic', 'Fertility'];

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    async function fetchPackages() {
      try {
        const data = await getPackages();
        setPackages(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPackages();
  }, []);

  const filtered = packages.filter(pkg => {
    const matchCat = category === 'All' || pkg.treatment?.category === category;
    const matchSearch =
      pkg.title?.toLowerCase().includes(search.toLowerCase()) ||
      pkg.treatment?.name?.toLowerCase().includes(search.toLowerCase()) ||
      pkg.hospital?.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featureIcons: Record<string, React.ElementType> = {
    hotel_included: Hotel,
    transfer: Plane,
    translator: Languages,
    visa_assistance: ShieldCheck,
  };

  const featureLabels: Record<string, string> = {
    hotel_included: 'Hotel Stay',
    transfer: 'Airport Transfer',
    translator: 'Translator',
    visa_assistance: 'Visa Assistance',
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <PageMeta 
        title="All-Inclusive Medical Packages" 
        description="Transparent, all-inclusive medical travel packages to India including treatment, hospital stay, airport transfers, and visa assistance." 
      />
      {/* Hero Header */}
      <div className="relative pt-32 pb-32 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/60 via-slate-900 to-slate-900" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-primary-500/10 blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="inline-block text-primary-400 text-xs font-black uppercase tracking-[0.3em] mb-4">All-Inclusive Care</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Treatment <span className="text-primary-400">Packages</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mb-10">
            Transparent, fixed-price medical bundles — surgery, hospital stay, hotel, and full concierge support included.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search packages, treatments, hospitals..."
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/15 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-28">

        {/* Category Filter Bar */}
        <div className="premium-card mb-10 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex-shrink-0">Category</span>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                category === c
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between mb-8 px-1">
          <p className="text-slate-500 font-medium">
            Found <span className="text-dark font-bold">{isLoading ? '…' : filtered.length}</span> packages
          </p>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Sorted by price</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="premium-card animate-pulse h-[480px] bg-slate-100 border-none" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="premium-card text-center py-20">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-5" />
            <h3 className="text-xl font-bold text-dark mb-2">No Packages Found</h3>
            <p className="text-slate-500 text-sm mb-6">Try adjusting your search or category filter.</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((pkg) => {
              const price = Number(pkg.price_inr || 0);
              const usd = Math.round(price / 83);
              const duration = pkg.duration_days;
              const activeFeatures = Object.entries(featureLabels).filter(([key]) => pkg[key]);

              return (
                <div
                  key={pkg.id}
                  className="premium-card group flex flex-col hover:!border-primary-400 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 transition-all duration-300 shadow-md">
                      <Stethoscope className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-right">
                      {pkg.hotel_included && (
                        <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                          {pkg.hotel_tier}★ Hotel
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-dark mb-1 group-hover:text-primary-600 transition-colors leading-tight">
                    {pkg.title || pkg.treatment?.name}
                  </h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> {pkg.hospital?.name || 'Hospital Partner'}
                  </p>
                  {duration && (
                    <p className="text-slate-400 text-xs font-bold flex items-center gap-1.5 mb-6">
                      <Clock className="w-3.5 h-3.5" /> {duration}-day program
                    </p>
                  )}

                  {/* Included Features */}
                  <div className="space-y-3 mb-8 flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What's Included</p>
                    <div className="flex items-center gap-2.5 text-slate-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      Surgeon, Anaesthesia & ICU Care
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      Private Hospital Room
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      Concierge & Case Manager
                    </div>
                    {activeFeatures.map(([key, label]) => {
                      const Icon = featureIcons[key];
                      return (
                        <div key={key} className="flex items-center gap-2.5 text-slate-600 text-sm font-medium">
                          <Icon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                          {label}
                        </div>
                      );
                    })}
                  </div>

                  {/* Price & CTA */}
                  <div className="mt-auto pt-6 border-t border-slate-50">
                    <div className="flex items-end justify-between mb-5">
                      <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Fixed Price</p>
                        <p className="text-3xl font-black text-dark">₹{price.toLocaleString()}</p>
                        <p className="text-xs text-slate-400 mt-0.5">≈ ${usd.toLocaleString()} USD</p>
                      </div>
                      <div className="text-right">
                        <p className="text-success font-black text-xs uppercase tracking-widest">Save ~35%</p>
                        <p className="text-slate-400 text-[10px] font-bold">vs global avg.</p>
                      </div>
                    </div>
                    <Link
                      to={`/book/step-1?package=${pkg.id}`}
                      className="btn-primary !w-full justify-center !py-4 group-hover:shadow-xl group-hover:shadow-primary-500/20 transition-shadow"
                    >
                      Select Package <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Trust Strip */}
        {!isLoading && filtered.length > 0 && (
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, label: 'Fixed Price Guarantee', desc: 'No hidden costs, ever' },
              { icon: Stethoscope, label: 'Expert Surgeons', desc: 'Board-certified specialists' },
              { icon: Plane, label: 'End-to-End Travel', desc: 'Flights, hotel & transfers' },
              { icon: Languages, label: '24/7 Concierge', desc: 'Multilingual support team' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="premium-card flex flex-col items-center text-center gap-3 py-8">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-dark text-sm">{label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
