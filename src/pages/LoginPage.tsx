import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  HeartPulse,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-white">
      {/* Left Side: Branding & Trust */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-slate-900" />
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <HeartPulse className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tight">
              Medi<span className="text-primary-400">Trip</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-bold text-white mb-8 leading-tight">
            Welcome Back to <br />
            <span className="text-primary-400">Elite Healthcare.</span>
          </h2>
          <p className="text-xl text-slate-400 mb-12 leading-relaxed">
            Access your personalized medical journey, chat with consultants, and manage your health documents in one secure place.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-white font-bold">256-bit Encryption</p>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Medical Grade Security</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-12 border-t border-white/10">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-slate-900" alt="" />
            ))}
          </div>
          <p className="text-slate-400 text-sm font-bold">JOINED BY 15,000+ PATIENTS</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-16 lg:p-24 bg-[#f8fafc]">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-dark mb-4">Log In</h1>
            <p className="text-slate-500 font-medium">
              New to MediTrip? <Link to="/signup" className="text-primary-600 font-bold hover:underline">Create a free account</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-danger text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="label">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com" 
                    className="input !pl-14" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="label mb-0">Password</label>
                  <Link to="/forgot-password" className="text-xs font-bold text-slate-400 hover:text-primary-600">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="input !pl-14" 
                    required 
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary !w-full !py-5 !text-lg !rounded-2xl shadow-2xl shadow-primary-500/30 flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5 ml-2" /></>}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                <span className="bg-[#f8fafc] px-4 text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={signInWithGoogle}
                className="btn-secondary !bg-white !py-4 justify-center !text-sm gap-2"
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
                Google
              </button>
              <button type="button" className="btn-secondary !bg-white !py-4 justify-center !text-sm gap-2">
                Apple ID
              </button>
            </div>
          </form>

          <p className="mt-12 text-center text-slate-400 text-xs font-medium leading-relaxed">
            By logging in, you agree to our <Link to="/terms" className="underline">Terms of Service</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
