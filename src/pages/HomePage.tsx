import { Link } from 'react-router-dom';
import PageMeta from '../components/common/PageMeta';
import { useTranslation } from 'react-i18next';

import { 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  Clock, 
  Star, 
  ChevronRight, 
  Play,
  Heart,
  Stethoscope,
  Building2,
  Users
} from 'lucide-react';
export default function HomePage() {
  const { t } = useTranslation();

  const stats = [
    { label: 'Happy Patients', value: '15,000+', icon: Users },
    { label: 'Partner Hospitals', value: '200+', icon: Building2 },
    { label: 'Specialist Doctors', value: '500+', icon: Stethoscope },
    { label: 'Success Rate', value: '98%', icon: Heart },
  ];

  const categories = [
    { name: 'Cardiology', icon: '❤️', slug: 'cardiac-bypass', count: '45+ Procedures' },
    { name: 'Orthopedics', icon: '🦴', slug: 'knee-replacement', count: '30+ Procedures' },
    { name: 'Fertility', icon: '👶', slug: 'ivf-treatment', count: '12+ Procedures' },
    { name: 'Neurology', icon: '🧠', slug: 'spine-surgery', count: '25+ Procedures' },
  ];

  return (
    <div className="flex flex-col">
      <PageMeta 
        title="Premium Medical Tourism in India" 
        description="Connect with world-class hospitals and specialist doctors in India. All-inclusive medical packages with 24/7 concierge support." 
      />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-white">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-50/50 skew-x-[-12deg] translate-x-1/4 -z-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in fade-in slide-in-from-left duration-1000">
              <div className="flex items-center gap-3 mb-6">
                <span className="section-tag">{t('hero.tag')}</span>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-success/10 rounded-full border border-success/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  <span className="text-[10px] font-black text-success uppercase tracking-wider">{t('hero.jci_title')}</span>
                </div>
              </div>
              <h1 className="text-6xl sm:text-7xl font-extrabold text-dark mb-6 leading-[1.1]">
                {t('hero.title1')} <br />
                <span className="gradient-text">{t('hero.title2')}</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
                {t('hero.subtitle') || "MediTrip connects you with India's most prestigious hospitals and elite surgeons. Experience premium care with a dedicated medical concierge."}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/treatments" className="btn-primary group">
                  Explore Treatments <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/hospitals" className="btn-secondary group">
                  View Hospitals
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Patient" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-primary-500 flex items-center justify-center text-white font-bold text-xs">
                    +5k
                  </div>
                </div>
                <div>
                  <div className="flex text-amber-400 mb-0.5">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Trusted by 15,000+ International Patients</p>
                </div>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right duration-1000">
              <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl shadow-primary-500/10 border-8 border-white animate-float">
                <img 
                  src="/hero-image.png" 
                  alt="Premium Healthcare" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
                
                {/* Floating Stats Card */}
                <div className="absolute bottom-8 left-8 right-8 glass-card p-6 rounded-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-success/20 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg leading-tight">24/7 Premium Support</p>
                        <p className="text-white/70 text-sm">Personal Concierge Service</p>
                      </div>
                    </div>
                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 text-primary-600 fill-current ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary-200/20 rounded-full blur-3xl animate-pulse delay-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary-500 transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-primary-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="section-tag">Expertise</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-dark">
                Specialized Care for <br />
                <span className="gradient-text">Complex Conditions</span>
              </h2>
            </div>
            <Link to="/treatments" className="btn-secondary">
              View All Procedures <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                to={`/treatments/${cat.slug}`}
                className="premium-card group"
              >
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-300 block origin-left">
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-bold text-dark mb-2">{cat.name}</h3>
                <p className="text-slate-500 mb-6 font-medium">{cat.count}</p>
                <div className="flex items-center text-primary-500 font-bold text-sm group-hover:translate-x-2 transition-transform">
                  Explore <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div className="premium-card bg-primary-50 border-none">
                  <Globe className="w-10 h-10 text-primary-600 mb-4" />
                  <h4 className="font-bold text-xl mb-2">Global Access</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">Seamless medical travel from any corner of the world.</p>
                </div>
                <div className="premium-card bg-slate-900 text-white border-none">
                  <ShieldCheck className="w-10 h-10 text-success mb-4" />
                  <h4 className="font-bold text-xl mb-2">Accredited Care</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Only JCI & NABH certified partner hospitals.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="premium-card bg-white shadow-2xl">
                  <Clock className="w-10 h-10 text-warning mb-4" />
                  <h4 className="font-bold text-xl mb-2">Zero Waiting</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">Direct priority access to India's top medical specialists.</p>
                </div>
                <div className="premium-card bg-primary-600 text-white border-none">
                  <Heart className="w-10 h-10 text-white mb-4" />
                  <h4 className="font-bold text-xl mb-2">End-to-End</h4>
                  <p className="text-white/70 text-sm leading-relaxed">Visa, hotel, translator, and recovery support included.</p>
                </div>
              </div>
            </div>

            <div>
              <span className="section-tag">Why Choose Us</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-dark mb-8 leading-tight">
                Your Health deserves <br />
                <span className="gradient-text">Elite Medical Care.</span>
              </h2>
              <div className="space-y-8">
                {[
                  { title: 'Personalized Concierge', text: 'A dedicated medical assistant for your entire journey.' },
                  { title: 'Transparent Pricing', text: 'No hidden costs. 60-80% savings compared to USA/UK.' },
                  { title: 'Post-Op Support', text: 'Comprehensive recovery and follow-up care plans.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500 transition-colors">
                      <span className="text-primary-600 font-bold group-hover:text-white">0{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-dark mb-2">{item.title}</h4>
                      <p className="text-slate-600 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary mt-12 w-full sm:w-auto">
                Start Your Journey Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[48px] bg-slate-900 overflow-hidden py-24 px-8 text-center shadow-2xl shadow-slate-900/40">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-6xl font-bold text-white mb-8">
                Ready to get your <br />
                <span className="text-primary-400">Treatment Plan?</span>
              </h2>
              <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                Connect with our medical experts today for a free, personalized consultation and cost estimation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup" className="btn-primary">
                  Get Free Consultation
                </Link>
                <Link to="/contact" className="btn-secondary !bg-transparent !text-white !border-slate-700 hover:!bg-white/5">
                  Talk to a Specialist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
