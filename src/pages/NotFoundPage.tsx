import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Stethoscope } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-slate-900 to-slate-900" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Animated icon */}
        <div className="w-24 h-24 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
          <Stethoscope className="w-12 h-12 text-primary-400" />
        </div>

        {/* 404 Number */}
        <h1 className="text-[10rem] font-black text-white/5 leading-none select-none absolute left-1/2 -translate-x-1/2 top-0 -mt-8">
          404
        </h1>

        <p className="text-primary-400 text-xs font-black uppercase tracking-[0.4em] mb-4">Page Not Found</p>
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
          We couldn't find<br />that <span className="text-primary-400">page</span>
        </h2>
        <p className="text-slate-400 text-lg mb-12 font-medium leading-relaxed max-w-md mx-auto">
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary gap-2 justify-center !py-4 !px-8"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            to="/treatments"
            className="px-8 py-4 rounded-2xl border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
          >
            <Search className="w-5 h-5" />
            Browse Treatments
          </Link>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-8 text-slate-500 text-sm font-bold flex items-center gap-2 mx-auto hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to previous page
        </button>
      </div>
    </div>
  );
}
