import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../store/bookingStore';
import { getPackagesByHospital } from '../../lib/api/packages';
import { 
  Package, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Crown,
  Sparkles,
  Plus,
  Loader2
} from 'lucide-react';
import type { Database } from '../../types/supabase';

type Package = Database['public']['Tables']['packages']['Row'];

export default function BookStep3() {
  const navigate = useNavigate();
  const { step2, step3, setStep3, setStep } = useBookingStore();
  
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(step3.packageId || '');

  useEffect(() => {
    async function fetchP() {
      if (!step2.hospitalId) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await getPackagesByHospital(step2.hospitalId);
        setPackages(data);
        if (data.length > 0 && !selectedPackageId) {
          setSelectedPackageId(data[0].id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchP();
  }, [step2.hospitalId]);

  const onNext = () => {
    if (!selectedPackageId) return;
    const pkg = packages.find(p => p.id === selectedPackageId);
    
    setStep3({ 
      packageId: selectedPackageId, 
      packageName: pkg?.title || '',
      baseCost: pkg?.price_inr || 0,
      hotelIncluded: pkg?.hotel_included || false,
      transfer: pkg?.transfer || false
    });
    setStep(4);
    navigate('/book/step-4');
  };

  if (isLoading) return <div className="py-20 text-center"><Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto" /></div>;

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-dark mb-4">Select Your Comfort</h1>
        <p className="text-slate-500 text-lg">Choose an all-inclusive bundle that best fits your recovery needs and budget.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {packages.map((pkg, idx) => (
          <button
            key={pkg.id}
            onClick={() => setSelectedPackageId(pkg.id)}
            className={`w-full text-left premium-card !p-0 overflow-hidden group border-2 transition-all duration-500 relative ${
              selectedPackageId === pkg.id 
              ? 'border-primary-500 ring-4 ring-primary-500/5 shadow-2xl scale-[1.02]' 
              : 'border-white hover:border-slate-200 grayscale-[0.3] hover:grayscale-0'
            }`}
          >
            {/* Header Badge */}
            <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest ${
              idx === 1 ? 'bg-amber-400 text-dark' : 'bg-primary-600 text-white'
            }`}>
              {idx === 1 ? 'Most Popular' : 'Premium Choice'}
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  selectedPackageId === pkg.id ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-400'
                }`}>
                  {idx === 1 ? <Crown className="w-7 h-7" /> : <Package className="w-7 h-7" />}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-dark">{pkg.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black bg-success/10 text-success px-2 py-0.5 rounded tracking-widest uppercase">Fixed Price</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  International Surgeon Fee
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  {pkg.duration_days} Days Hospital Stay
                </div>
                <div className={`flex items-center gap-3 font-bold text-sm ${pkg.hotel_included ? 'text-slate-600' : 'text-slate-300'}`}>
                  {pkg.hotel_included ? <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" /> : <Plus className="w-5 h-5 text-slate-200 flex-shrink-0" />}
                  4-Star Hotel Accommodation
                </div>
                <div className={`flex items-center gap-3 font-bold text-sm ${pkg.transfer ? 'text-slate-600' : 'text-slate-300'}`}>
                  {pkg.transfer ? <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" /> : <Plus className="w-5 h-5 text-slate-200 flex-shrink-0" />}
                  Private Airport Transfers
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50 flex items-end justify-between">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Starting From</p>
                  <p className="text-3xl font-black text-dark">₹{pkg.price_inr?.toLocaleString()}</p>
                </div>
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedPackageId === pkg.id ? 'bg-primary-500 border-primary-500 text-white scale-110' : 'border-slate-100 text-transparent'
                }`}>
                  <Check className="w-6 h-6" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Add-ons Placeholder (Premium Styling) */}
      <div className="premium-card !p-8 bg-slate-900 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-primary-400">
                  <Sparkles className="w-8 h-8" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-white mb-1">Concierge VIP Add-ons</h3>
                  <p className="text-slate-400 text-sm">Personal assistant, city tours, and premium recovery suites.</p>
               </div>
            </div>
            <button type="button" className="text-primary-400 font-bold text-sm hover:text-white transition-colors flex items-center gap-2 border-b border-primary-400/30 pb-1">
               Explore VIP Services <ArrowRight className="w-4 h-4" />
            </button>
         </div>
      </div>

      {/* Navigation */}
      <div className="pt-10 flex items-center justify-between border-t border-slate-100">
        <button 
          onClick={() => { setStep(2); navigate('/book/step-2'); }} 
          className="btn-secondary !px-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Previous Step
        </button>
        <button 
          onClick={onNext}
          disabled={!selectedPackageId}
          className={`btn-primary !px-12 !py-5 shadow-2xl shadow-primary-500/30 ${!selectedPackageId ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
          Provide Patient Info <ArrowRight className="w-6 h-6 ml-3" />
        </button>
      </div>
    </div>
  );
}
