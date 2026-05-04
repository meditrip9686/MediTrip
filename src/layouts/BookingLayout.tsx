import { Outlet, Link } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';
import { HeartPulse, ChevronLeft, ShieldCheck } from 'lucide-react';

const STEPS = [
  'Treatment & Dates',
  'Hospital & Doctor',
  'Package & Add-ons',
  'Patient Details',
  'Review',
  'Payment',
];

export default function BookingLayout() {
  const { currentStep } = useBookingStore();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Premium Header */}
      <header className="bg-dark py-6 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xl font-black tracking-tight">
                Medi<span className="text-primary-500">Trip</span>
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2 text-success">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Booking</span>
              </div>
              <Link to="/" className="text-slate-400 hover:text-white text-sm font-bold flex items-center gap-2 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Cancel
              </Link>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8">
            <div className="flex justify-between items-end mb-3">
              <div>
                <span className="text-primary-500 text-[10px] font-black uppercase tracking-[0.2em]">Step {currentStep} of {STEPS.length}</span>
                <h2 className="text-white text-lg font-bold mt-1">{STEPS[currentStep - 1]}</h2>
              </div>
              <span className="text-slate-500 text-xs font-bold">{Math.round((currentStep / STEPS.length) * 100)}% Complete</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 transition-all duration-700 ease-out ${
                    i + 1 <= currentStep ? 'bg-primary-500' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>

      {/* Footer Trust Bar */}
      <footer className="py-8 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs font-bold">Need help? Call our 24/7 concierge at +1 (800) MEDI-TRIP</p>
          <div className="flex items-center gap-4 grayscale opacity-50">
             <span className="text-[10px] font-black text-slate-400 border border-slate-200 px-2 py-1 rounded">HIPAA COMPLIANT</span>
             <span className="text-[10px] font-black text-slate-400 border border-slate-200 px-2 py-1 rounded">GDPR READY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
