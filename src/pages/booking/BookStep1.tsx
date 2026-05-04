import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBookingStore } from '../../store/bookingStore';
import { ArrowRight, Loader2, Search, Calendar, Globe, Users2, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTreatments } from '../../lib/api/treatments';
import type { Database } from '../../types/supabase';

type Treatment = Database['public']['Tables']['treatments']['Row'];

const schema = z.object({
  treatmentName: z.string().min(1, 'Please select a treatment'),
  travelMonth: z.string().min(1, 'Please select a travel month'),
  travelFlexible: z.boolean(),
  countryFrom: z.string().min(1, 'Please select your country'),
  companions: z.number().min(0),
});

type FormData = z.infer<typeof schema>;

const MONTHS = ['January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026', 'October 2026', 'November 2026', 'December 2026'];
const COUNTRIES = ['Bangladesh', 'Nigeria', 'Iraq', 'Oman', 'Kenya', 'Ethiopia', 'UK', 'USA', 'Canada', 'Other'];

export default function BookStep1() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setStep1, setStep } = useBookingStore();
  
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function fetchT() {
      try {
        const data = await getTreatments();
        setTreatments(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchT();
  }, []);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      treatmentName: searchParams.get('treatment') ? searchParams.get('treatment')!.replace(/-/g, ' ') : '',
      travelFlexible: true,
      companions: 0,
    },
  });

  const selectedTreatment = watch('treatmentName');
  const selectedMonth = watch('travelMonth');

  const filteredTreatments = treatments.filter(t => 
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: FormData) => {
    const selectedT = treatments.find(t => 
      t.name?.toLowerCase() === data.treatmentName.toLowerCase() || 
      t.slug?.toLowerCase() === data.treatmentName.toLowerCase()
    );
    
    setStep1({ 
      ...data, 
      treatmentName: selectedT?.name || data.treatmentName,
      treatmentId: selectedT?.id || '', 
      travelMonth: data.travelMonth 
    });
    setStep(2);
    navigate('/book/step-2');
  };

  return (
    <div className="space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-dark mb-4">Your Medical Journey Starts Here</h1>
        <p className="text-slate-500 text-lg">Select your preferred treatment and travel window to begin your personalized care plan.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Treatment Selection */}
        <div className="premium-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark">What treatment are you looking for?</h2>
              <p className="text-sm text-slate-400">Search and select from our specialized procedures</p>
            </div>
          </div>

          <div className="relative">
             <input
               type="text"
               placeholder="Search procedures (e.g. Knee Replacement, IVF...)"
               className="input !pl-12 !py-5"
               value={searchTerm || selectedTreatment}
               onChange={(e) => {
                 setSearchTerm(e.target.value);
                 setIsSearching(true);
               }}
               onFocus={() => setIsSearching(true)}
             />
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             
             {isSearching && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-30 max-h-64 overflow-y-auto">
                 {isLoading ? (
                   <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-500" /></div>
                 ) : filteredTreatments.length > 0 ? (
                   filteredTreatments.map(t => (
                     <button
                       key={t.id}
                       type="button"
                       className="w-full text-left p-4 hover:bg-primary-50 flex items-center justify-between group transition-colors"
                       onClick={() => {
                         setValue('treatmentName', t.name!);
                         setSearchTerm('');
                         setIsSearching(false);
                       }}
                     >
                       <div>
                         <p className="font-bold text-dark group-hover:text-primary-600">{t.name}</p>
                         <p className="text-xs text-slate-400 uppercase tracking-widest">{t.category}</p>
                       </div>
                       <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                     </button>
                   ))
                 ) : (
                   <div className="p-8 text-center text-slate-400">No procedures found matching "{searchTerm}"</div>
                 )}
               </div>
             )}
          </div>
          {errors.treatmentName && <p className="text-danger text-xs mt-2 font-bold">{errors.treatmentName.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Travel Month */}
          <div className="premium-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-dark">Preferred Month</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {MONTHS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setValue('travelMonth', m)}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                    selectedMonth === m 
                    ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/20' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-primary-200 hover:text-primary-600'
                  }`}
                >
                  {m.split(' ')[0]}
                </button>
              ))}
            </div>
            <input type="hidden" {...register('travelMonth')} />
            {errors.travelMonth && <p className="text-danger text-xs mt-2 font-bold">{errors.travelMonth.message}</p>}
          </div>

          {/* Country */}
          <div className="premium-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-dark">Country of Origin</h3>
            </div>

            <div className="relative">
              <select {...register('countryFrom')} className="input !bg-slate-50 border-none !py-4 appearance-none cursor-pointer">
                <option value="">Select country...</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronLeft className="w-4 h-4 -rotate-90" />
              </div>
            </div>
            {errors.countryFrom && <p className="text-danger text-xs mt-2 font-bold">{errors.countryFrom.message}</p>}

            <div className="mt-6 flex items-center gap-3">
               <input type="checkbox" id="flexible" {...register('travelFlexible')} className="w-5 h-5 rounded-md border-slate-300 text-primary-600 focus:ring-primary-500" />
               <label htmlFor="flexible" className="text-sm font-bold text-slate-600">Dates are flexible</label>
            </div>
          </div>
        </div>

        {/* Companions */}
        <div className="premium-card !p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center text-success">
                <Users2 className="w-6 h-6" />
             </div>
             <div>
                <h3 className="text-lg font-bold text-dark">Traveling with companions?</h3>
                <p className="text-sm text-slate-400">Excludes the patient</p>
             </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <button 
              type="button" 
              className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 hover:text-primary-600 transition-colors"
              onClick={() => setValue('companions', Math.max(0, watch('companions') - 1))}
            >
              -
            </button>
            <span className="w-8 text-center font-black text-dark text-lg">{watch('companions')}</span>
            <button 
              type="button" 
              className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 hover:text-primary-600 transition-colors"
              onClick={() => setValue('companions', watch('companions') + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <button type="submit" className="btn-primary !px-12 !py-5 shadow-2xl shadow-primary-500/30">
            Select Hospital & Doctor <ArrowRight className="w-6 h-6 ml-3" />
          </button>
        </div>
      </form>
    </div>
  );
}
