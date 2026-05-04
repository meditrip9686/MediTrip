import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  ChevronRight, 
  ArrowRight, 
  Clock, 
  Users2, 
  TrendingUp, 
  ShieldCheck,
  Star,
  Activity,
  DollarSign,
  HelpCircle,
  Stethoscope,
  Building2,
  Calendar
} from 'lucide-react';
import { getTreatmentBySlug } from '../lib/api/treatments';
import type { Database } from '../types/supabase';

type Treatment = Database['public']['Tables']['treatments']['Row'];

const TREATMENTS_DB: Record<string, {
  icon: string; usaCost: number; patientsServed: number; includes: string[];
  faqs: { q: string; a: string }[];
  hospitals: { name: string; city: string; rating: number; cost: number }[];
  timeline: { day: string; event: string }[];
}> = {
  'knee-replacement': {
    icon: '🦴',
    usaCost: 3300000, patientsServed: 1240,
    includes: ['Surgeon & anaesthesia fees', '5-7 night hospital stay', 'Post-op physiotherapy', 'Implant cost', '1 follow-up consultation', 'Pre-surgery investigations'],
    timeline: [
      { day: 'Day 1', event: 'Surgery & ICU monitoring' },
      { day: 'Day 2–3', event: 'Physical therapy begins' },
      { day: 'Day 5–7', event: 'Discharge from hospital' },
      { day: 'Week 3', event: 'Outpatient review' },
      { day: 'Month 3', event: 'Full weight-bearing' },
    ],
    hospitals: [
      { name: 'Apollo Hospital', city: 'Delhi', rating: 4.8, cost: 380000 },
      { name: 'Fortis Healthcare', city: 'Mumbai', rating: 4.7, cost: 420000 },
      { name: 'Manipal Hospital', city: 'Bangalore', rating: 4.6, cost: 350000 },
    ],
    faqs: [
      { q: 'How long will I need to stay in India?', a: 'Most patients stay 10–14 days in total — 5–7 in hospital, then a few days at the hotel before flying home.' },
      { q: 'What implant brands are used?', a: 'All our partner hospitals use globally certified implants — Zimmer Biomet, Stryker, or DePuy.' },
    ],
  },
};

const GENERIC_DB = {
  icon: '✨', usaCost: 5000000, patientsServed: 500,
  includes: ['Surgeon & anaesthesia fees', 'Hospital stay', 'Follow-up consultation', 'Diagnostics'],
  timeline: [
    { day: 'Day 1', event: 'Surgery' },
    { day: 'Day 3', event: 'Discharge' },
    { day: 'Week 2', event: 'Follow-up' },
  ],
  hospitals: [],
  faqs: [
    { q: 'How long will I need to stay in India?', a: 'Varies by procedure, typically 7-14 days.' },
  ],
};

export default function TreatmentDetailPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  
  const [t, setT] = useState<Treatment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchT() {
      try {
        const data = await getTreatmentBySlug(slug);
        setT(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchT();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-64 bg-slate-100 rounded-[40px] mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-slate-100 rounded-card" />
            <div className="h-80 bg-slate-100 rounded-card" />
          </div>
        </div>
      </div>
    );
  }

  if (!t) return <div className="min-h-screen flex items-center justify-center">Treatment not found</div>;

  const db = TREATMENTS_DB[slug] || GENERIC_DB;
  const savings = Math.round(((db.usaCost - (t.avg_cost_min || 0)) / db.usaCost) * 100);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Premium Hero Header */}
      <div className="relative pt-32 pb-48 bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-dark" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-500/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/treatments" className="inline-flex items-center gap-2 text-primary-400 font-bold mb-8 hover:text-white transition-colors group">
            <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" /> All Treatments
          </Link>
          
          <div className="max-w-4xl">
            <span className="badge-blue !bg-primary-500/20 !text-primary-300 mb-6 !py-1.5 !px-4 border border-primary-500/30">
              {t.category} Excellence
            </span>
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-8 leading-tight">
              {t.name}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-1">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Avg. Cost in India</p>
                <p className="text-2xl font-bold text-white">₹{(t.avg_cost_min || 0).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Success Rate</p>
                <p className="text-2xl font-bold text-success">{t.success_rate}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Recovery Time</p>
                <p className="text-2xl font-bold text-white">{t.recovery_days} Days</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Cost Savings</p>
                <p className="text-2xl font-bold text-primary-400">Up to {savings}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <div className="premium-card">
              <h2 className="text-3xl font-bold mb-6">Procedure Overview</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-10 font-medium">
                {t.description}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                <div>
                  <h4 className="font-bold text-dark mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" /> What's Included
                  </h4>
                  <ul className="space-y-3">
                    {db.includes.map(item => (
                      <li key={item} className="text-slate-500 text-sm font-bold flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-dark mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary-500" /> Key Benefits
                  </h4>
                  <ul className="space-y-3">
                    <li className="text-slate-500 text-sm font-bold flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                      Zero waiting period for major surgeries
                    </li>
                    <li className="text-slate-500 text-sm font-bold flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                      Access to robotic and minimally invasive tech
                    </li>
                    <li className="text-slate-500 text-sm font-bold flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                      Treatment by fellowship-trained surgeons
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="premium-card">
              <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
                <Clock className="w-7 h-7 text-primary-500" /> Patient Journey Timeline
              </h3>
              <div className="space-y-10 relative">
                <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-100" />
                {db.timeline.map((step, idx) => (
                  <div key={idx} className="flex gap-8 relative z-10 group">
                    <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-primary-500 group-hover:bg-primary-50 transition-all">
                      <span className="text-sm font-black text-dark group-hover:text-primary-600 tracking-tighter uppercase">{step.day.replace('Day ', '')}</span>
                    </div>
                    <div className="pt-3">
                      <h4 className="font-extrabold text-lg text-dark mb-1">{step.day}</h4>
                      <p className="text-slate-500 font-medium">{step.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-8 px-2 flex items-center gap-3">
                <HelpCircle className="w-7 h-7 text-primary-500" /> Frequently Asked Questions
              </h3>
              {db.faqs.map((faq, idx) => (
                <div key={idx} className="premium-card !p-8 group hover:!border-primary-200 transition-all cursor-pointer">
                  <h4 className="font-extrabold text-lg text-dark mb-3 flex items-center justify-between">
                    {faq.q}
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-all" />
                  </h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="premium-card !bg-primary-600 border-none text-white sticky top-24 shadow-2xl shadow-primary-600/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h3 className="text-2xl font-bold mb-6">Book Treatment</h3>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                  <span className="text-primary-100 text-sm font-bold uppercase">Estimated Cost</span>
                  <span className="text-xl font-bold">₹{(t.avg_cost_min || 0).toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-white/80">
                    <ShieldCheck className="w-4 h-4 text-primary-300" /> No Advance Payment
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-white/80">
                    <Calendar className="w-4 h-4 text-primary-300" /> Instant Confirmation
                  </div>
                </div>
              </div>

              <Link 
                to={`/book/step-1?treatment=${t.id}`}
                className="btn-secondary !bg-white !text-primary-600 w-full justify-center !py-5 !text-lg !rounded-2xl font-black mb-4 border-none shadow-xl"
              >
                Proceed to Booking
              </Link>
              <button className="w-full py-4 text-sm font-bold text-white/80 hover:text-white transition-colors">
                Download Procedure Guide (PDF)
              </button>
            </div>

            <div className="premium-card">
              <h4 className="font-bold mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-500" /> Top Partner Hospitals
              </h4>
              <div className="space-y-4">
                {db.hospitals.map((h, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-50 transition-colors">
                      <Building2 className="w-6 h-6 text-slate-400 group-hover:text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-dark group-hover:text-primary-600 transition-colors leading-tight">{h.name}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{h.city}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-auto text-slate-200 group-hover:text-primary-500" />
                  </div>
                ))}
              </div>
              <Link to="/hospitals" className="block text-center text-primary-500 font-bold text-xs mt-8 uppercase tracking-widest hover:underline">
                View All Partner Hospitals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
