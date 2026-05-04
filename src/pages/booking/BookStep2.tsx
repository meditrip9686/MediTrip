import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../store/bookingStore';
import { getHospitals } from '../../lib/api/hospitals';
import { getDoctorsByHospital } from '../../lib/api/doctors';
import { 
  Building2, 
  Stethoscope, 
  Star, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import type { Database } from '../../types/supabase';

type Hospital = Database['public']['Tables']['hospitals']['Row'];
type Doctor = Database['public']['Tables']['doctors']['Row'];

export default function BookStep2() {
  const navigate = useNavigate();
  const { step1, step2, setStep2, setStep } = useBookingStore();
  
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const [selectedHospital, setSelectedHospital] = useState<string>(step2.hospitalId || '');
  const [selectedDoctor, setSelectedDoctor] = useState<string>(step2.doctorId || '');

  useEffect(() => {
    async function fetchH() {
      try {
        const data = await getHospitals();
        setHospitals(data);
        if (step2.hospitalId) {
          fetchD(step2.hospitalId);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchH();
  }, []);

  async function fetchD(hId: string) {
    setLoadingDoctors(true);
    try {
      const data = await getDoctorsByHospital(hId);
      setDoctors(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDoctors(false);
    }
  }

  const handleHospitalSelect = (hId: string) => {
    setSelectedHospital(hId);
    setSelectedDoctor('');
    fetchD(hId);
  };

  const onNext = () => {
    if (!selectedHospital) return;
    const hospital = hospitals.find(h => h.id === selectedHospital);
    const doctor = doctors.find(d => d.id === selectedDoctor);
    
    setStep2({ 
      hospitalId: selectedHospital, 
      hospitalName: hospital?.name || '',
      doctorId: selectedDoctor,
      doctorName: doctor?.name || ''
    });
    setStep(3);
    navigate('/book/step-3');
  };

  if (isLoading) return <div className="py-20 text-center"><Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto" /></div>;

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-dark mb-4">Choose Excellence</h1>
        <p className="text-slate-500 text-lg">Select a world-class facility and lead specialist for your procedure.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Hospital Selection */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-dark flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary-500" />
              1. Select Hospital
            </h2>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{hospitals.length} Partners Available</span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {hospitals.map(h => (
              <button
                key={h.id}
                onClick={() => handleHospitalSelect(h.id)}
                className={`w-full text-left premium-card !p-6 group border-2 transition-all duration-300 ${
                  selectedHospital === h.id 
                  ? 'border-primary-500 ring-4 ring-primary-500/5 bg-primary-50/10' 
                  : 'border-white hover:border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden border border-slate-50">
                    <img src={h.images?.[0]} alt={h.name} className="w-full h-full object-cover" />
                  </div>
                  {selectedHospital === h.id && <CheckCircle2 className="w-6 h-6 text-primary-500" />}
                </div>
                <h3 className="text-lg font-bold text-dark mb-1">{h.name}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <MapPin className="w-3 h-3" /> {h.city}, {h.state}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-dark font-black text-sm">{h.rating}</span>
                    <span className="text-slate-400 font-bold">({h.review_count})</span>
                  </div>
                  <div className="flex gap-1">
                    {h.accreditations?.map(a => <span key={a} className="text-[9px] font-black bg-success/10 text-success px-2 py-0.5 rounded">{a}</span>)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Selection */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold flex items-center gap-2 transition-opacity ${!selectedHospital ? 'opacity-30' : 'opacity-100'}`}>
              <Stethoscope className="w-6 h-6 text-primary-500" />
              2. Select Specialist
            </h2>
          </div>

          {!selectedHospital ? (
            <div className="h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                  <ArrowLeft className="w-6 h-6" />
               </div>
               <p className="text-slate-400 font-bold">Select a hospital first to view available specialists.</p>
            </div>
          ) : loadingDoctors ? (
            <div className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-primary-500 mx-auto" /></div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {doctors.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDoctor(d.id)}
                  className={`w-full text-left premium-card !p-5 group border-2 transition-all duration-300 ${
                    selectedDoctor === d.id 
                    ? 'border-primary-500 ring-4 ring-primary-500/5 bg-primary-50/10' 
                    : 'border-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-50 shadow-sm">
                      {d.photo_url ? <img src={d.photo_url} alt={d.name} className="w-full h-full object-cover" /> : <Stethoscope className="w-8 h-8 text-slate-300 m-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-dark truncate pr-4">{d.name}</h4>
                        {selectedDoctor === d.id && <CheckCircle2 className="w-5 h-5 text-primary-500" />}
                      </div>
                      <p className="text-primary-600 text-[10px] font-black uppercase tracking-widest">{d.specialty}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase">
                          <ShieldCheck className="w-3 h-3 text-success" /> Verified
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase">
                           {d.experience_yrs}Y Exp.
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {doctors.length === 0 && (
                <div className="text-center py-12 text-slate-400 font-bold">No specialists listed for this procedure yet.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="pt-10 flex items-center justify-between border-t border-slate-100">
        <button 
          onClick={() => { setStep(1); navigate('/book/step-1'); }} 
          className="btn-secondary !px-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Previous Step
        </button>
        <button 
          onClick={onNext}
          disabled={!selectedHospital}
          className={`btn-primary !px-12 !py-5 shadow-2xl shadow-primary-500/30 ${!selectedHospital ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
          Customize Package <ArrowRight className="w-6 h-6 ml-3" />
        </button>
      </div>
    </div>
  );
}
