import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // We keep the loading screen for at least 2 seconds to show the animation
    const timer = setTimeout(() => {
      setShow(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      <div className="relative">
        {/* Animated Rings */}
        <div className="absolute inset-0 -m-4 rounded-full border-4 border-primary-100 animate-[ping_2s_linear_infinite]" />
        <div className="absolute inset-0 -m-8 rounded-full border-2 border-primary-50/50 animate-[ping_3s_linear_infinite]" />
        
        {/* Logo Container */}
        <div className="relative w-32 h-32 bg-white rounded-[40px] shadow-2xl flex items-center justify-center p-6 animate-[bounce_2s_ease-in-out_infinite]">
          <img src="/logo.png" alt="MediTrip Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <h2 className="text-2xl font-black text-dark tracking-tight">
          Medi<span className="text-primary-500">Trip</span>
        </h2>
        
        {/* Loading Bar */}
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full animate-[loading_2s_ease-in-out_infinite]" />
        </div>
        
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">
          Excellence in Healthcare
        </p>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
