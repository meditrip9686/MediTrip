import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useBookingStore } from '../../store/bookingStore';
import { ArrowLeft, ArrowRight, Pencil, HeartPulse, Building2, Package, User, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BookStep5() {
  const navigate = useNavigate();
  const { step1, step2, step3, step4, setStep } = useBookingStore();
  const [confirmed, setConfirmed] = useState(false);

  const total = step3.baseCost ?? 0;

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-dark mb-4">Review Your Plan</h1>
        <p className="text-slate-500 text-lg">Please double-check all details before proceeding to the final payment step.</p>
      </div>

      <div className="space-y-6">
        {/* Section Wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Treatment & Dates */}
          <div className="premium-card relative group">
            <Link to="/book/step-1" className="absolute top-6 right-6 p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <Pencil className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-dark">Procedure & Schedule</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Treatment</span>
                <span className="text-dark font-bold text-sm">{step1.treatmentName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Travel Window</span>
                <span className="text-dark font-bold text-sm">{step1.travelMonth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Nationality</span>
                <span className="text-dark font-bold text-sm">{step1.countryFrom}</span>
              </div>
            </div>
          </div>

          {/* Hospital & Doctor */}
          <div className="premium-card relative group">
            <Link to="/book/step-2" className="absolute top-6 right-6 p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <Pencil className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-dark">Provider Details</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Hospital</span>
                <span className="text-dark font-bold text-sm">{step2.hospitalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Specialist</span>
                <span className="text-dark font-bold text-sm">{step2.doctorName}</span>
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="premium-card relative group">
            <Link to="/book/step-4" className="absolute top-6 right-6 p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <Pencil className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-dark">Patient Info</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Name</span>
                <span className="text-dark font-bold text-sm">{step4.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Passport</span>
                <span className="text-dark font-bold text-sm">{step4.passportNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Emergency</span>
                <span className="text-dark font-bold text-sm">{step4.emergencyName}</span>
              </div>
            </div>
          </div>

          {/* Package Summary */}
          <div className="premium-card relative group">
            <Link to="/book/step-3" className="absolute top-6 right-6 p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <Pencil className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-dark">Selected Bundle</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Tier</span>
                <span className="text-dark font-bold text-sm">{step3.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Hotel & Transfer</span>
                <span className="text-success font-bold text-sm">Included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="premium-card !bg-slate-900 border-none relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-4">
              <div>
                 <p className="text-primary-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Grand Total Investment</p>
                 <div className="flex items-baseline gap-4">
                    <h2 className="text-5xl font-black text-white">₹{total?.toLocaleString()}</h2>
                    <span className="text-slate-400 text-xl font-medium">~${Math.round(total / 83).toLocaleString()} USD</span>
                 </div>
              </div>
              <div className="flex flex-col gap-3">
                 <div className="flex items-center gap-2 text-success">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Fixed-Price Guarantee</span>
                 </div>
                 <p className="text-slate-500 text-[10px] leading-tight max-w-[200px]">Includes all hospital fees, surgeon fees, and selected concierge services.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Confirm Checkbox */}
      <div className="premium-card !p-6 flex items-start gap-4 hover:border-primary-200 transition-colors cursor-pointer" onClick={() => setConfirmed(!confirmed)}>
        <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
           confirmed ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-200 bg-white'
        }`}>
           {confirmed && <ShieldCheck className="w-4 h-4" />}
        </div>
        <div>
           <h4 className="text-dark font-bold mb-1">Confirm Information Precision</h4>
           <p className="text-slate-500 text-sm">I confirm that all provided data matches my passport and medical history. I acknowledge that this is a premium consultation request.</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="pt-10 flex items-center justify-between border-t border-slate-100">
        <button 
          onClick={() => { setStep(4); navigate('/book/step-4'); }} 
          className="btn-secondary !px-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Previous Step
        </button>
        <button
          onClick={() => { setStep(6); navigate('/book/step-6'); }}
          disabled={!confirmed}
          className={`btn-primary !px-12 !py-5 shadow-2xl shadow-primary-500/30 ${!confirmed ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
          Secure Checkout <ArrowRight className="w-6 h-6 ml-3" />
        </button>
      </div>
    </div>
  );
}
