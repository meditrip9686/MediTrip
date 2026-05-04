import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  Globe, 
  ShieldCheck, 
  HeartPulse,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signUp(formData.email, formData.password, formData.fullName, formData.phone);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-white">
      {/* Left Side: Benefits & Trust */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-slate-900" />
        <div className="absolute -bottom-24 -left-24 w-full h-full bg-primary-500/5 blur-[120px] rounded-full" />
        
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
            Start Your <br />
            <span className="text-primary-400">Health Journey.</span>
          </h2>
          
          <div className="space-y-8 mt-12">
            {[
              { title: 'Free Clinical Evaluation', desc: 'Expert medical opinion within 24 hours.' },
              { title: 'Priority Access', desc: 'Skip the wait at Indias top hospitals.' },
              { title: 'Personal Concierge', desc: 'A dedicated manager for your entire trip.' }
            ].map((benefit, i) => (
              <div key={i} className="flex gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-all">
                  <CheckCircle2 className="w-6 h-6 text-primary-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg mb-1">{benefit.title}</p>
                  <p className="text-slate-400 text-sm font-medium">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-8 bg-white/5 backdrop-blur-md rounded-[32px] border border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <ShieldCheck className="w-8 h-8 text-primary-400" />
            <p className="text-white font-bold">HIPAA Compliant Platform</p>
          </div>
          <p className="text-slate-400 text-xs font-medium leading-relaxed">
            Your medical records and personal data are protected by bank-grade encryption and strict privacy protocols.
          </p>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-16 lg:p-24 bg-[#f8fafc]">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-dark mb-4">Create Account</h1>
            <p className="text-slate-500 font-medium">
              Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign in instead</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-danger text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="label">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="John Doe" 
                    className="input !pl-14" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@company.com" 
                    className="input !pl-14" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000" 
                    className="input !pl-14" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Min. 8 characters" 
                    className="input !pl-14" 
                    required 
                    minLength={8}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary !w-full !py-5 !text-lg !rounded-2xl shadow-2xl shadow-primary-500/30 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Join MediTrip <ArrowRight className="w-5 h-5 ml-2" /></>}
              </button>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                <span className="bg-[#f8fafc] px-4 text-slate-400">Or continue with</span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={signInWithGoogle}
              className="btn-secondary !w-full !bg-white !py-4 justify-center !text-sm gap-2"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
              Sign up with Google
            </button>
          </form>

          <div className="mt-12 p-6 bg-white border border-slate-100 rounded-3xl flex items-start gap-4">
            <Globe className="w-6 h-6 text-primary-500 flex-shrink-0" />
            <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
              By creating an account, you agree to our <Link to="/terms" className="text-dark font-bold underline">Terms of Service</Link> and <Link to="/privacy" className="text-dark font-bold underline">Privacy Policy</Link>. We will never share your medical data without your explicit consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
