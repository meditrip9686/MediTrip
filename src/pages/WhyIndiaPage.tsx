import { Link } from 'react-router-dom';
import { IndianRupee, ShieldCheck, HeartPulse, TrendingDown, ArrowRight } from 'lucide-react';
import PageMeta from '../components/common/PageMeta';

const COST_DATA = [
  { procedure: 'Heart Bypass (CABG)', us: 123000, uk: 28000, india: 6500 },
  { procedure: 'Knee Replacement', us: 35000, uk: 18000, india: 5500 },
  { procedure: 'Spinal Fusion', us: 110000, uk: 32000, india: 9500 },
  { procedure: 'IVF Treatment (per cycle)', us: 15000, uk: 6500, india: 3500 },
  { procedure: 'Gastric Bypass', us: 25000, uk: 15000, india: 6000 },
  { procedure: 'Hair Transplant', us: 9000, uk: 6000, india: 2500 },
];

export default function WhyIndiaPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <PageMeta 
        title="Why India for Medical Tourism? Cost & Quality Comparison" 
        description="Compare the cost of medical treatments in India vs US and UK. Save up to 80% on JCI-accredited healthcare without compromising on quality." 
      />
      
      {/* Hero Header */}
      <div className="relative pt-32 pb-24 bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-dark" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="section-tag !text-primary-400">Destination India</span>
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6">
            World-Class Care.<br />
            <span className="text-primary-400">Accessible Prices.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover why over 2 million international patients travel to India annually for complex medical procedures, saving up to 80% compared to Western countries.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Cost Comparison Table */}
        <div className="premium-card mb-24 overflow-hidden">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingDown className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-dark mb-4">Cost Comparison Matrix</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">
              Average out-of-pocket costs in USD for uninsured/underinsured patients. Prices in India include surgery, hospital stay, and basic post-op care.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-6 border-b-2 border-slate-100 font-black text-slate-400 uppercase tracking-widest text-sm w-2/5">Medical Procedure</th>
                  <th className="p-6 border-b-2 border-slate-100 font-black text-slate-400 uppercase tracking-widest text-sm text-center">USA</th>
                  <th className="p-6 border-b-2 border-slate-100 font-black text-slate-400 uppercase tracking-widest text-sm text-center">UK (Private)</th>
                  <th className="p-6 border-b-2 border-primary-500 font-black text-primary-600 uppercase tracking-widest text-sm text-center bg-primary-50/50 rounded-t-xl">India (MediTrip)</th>
                  <th className="p-6 border-b-2 border-slate-100 font-black text-emerald-500 uppercase tracking-widest text-sm text-right">Savings</th>
                </tr>
              </thead>
              <tbody>
                {COST_DATA.map((row, i) => {
                  const savings = Math.round(((row.us - row.india) / row.us) * 100);
                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-6 border-b border-slate-50 font-bold text-dark">{row.procedure}</td>
                      <td className="p-6 border-b border-slate-50 text-slate-500 font-medium text-center">${row.us.toLocaleString()}</td>
                      <td className="p-6 border-b border-slate-50 text-slate-500 font-medium text-center">${row.uk.toLocaleString()}</td>
                      <td className="p-6 border-b border-slate-50 text-primary-600 font-black text-center bg-primary-50/30 text-lg">${row.india.toLocaleString()}</td>
                      <td className="p-6 border-b border-slate-50 text-emerald-500 font-black text-right group-hover:scale-110 transition-transform">{savings}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 text-center mt-6 uppercase tracking-wider font-bold">
            * Costs are estimates and vary based on hospital choice, implants, and length of stay.
          </p>
        </div>

        {/* Why the cost is lower */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="premium-card !p-8">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
              <IndianRupee className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-4">Currency Exchange</h3>
            <p className="text-slate-600 leading-relaxed font-medium">The favorable exchange rate of the USD/GBP/EUR to the Indian Rupee gives international patients immense purchasing power.</p>
          </div>
          <div className="premium-card !p-8">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-4">Lower Admin Costs</h3>
            <p className="text-slate-600 leading-relaxed font-medium">Unlike the US system, India has lower administrative, malpractice insurance, and operational overheads, directly passing savings to you.</p>
          </div>
          <div className="premium-card !p-8">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
              <HeartPulse className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-4">Same Implants</h3>
            <p className="text-slate-600 leading-relaxed font-medium">Hospitals use the exact same FDA-approved implants (Zimmer, Medtronic) but negotiate lower regional pricing from manufacturers.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="premium-card !bg-primary-600 !p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 relative z-10">Don't compromise your health due to high costs.</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">Get a free, no-obligation medical evaluation and exact cost estimate from our top specialists within 24 hours.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link to="/contact" className="btn-secondary !bg-white !text-primary-600 shadow-xl">
              Get a Free Quote <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/treatments" className="btn-secondary !bg-transparent text-white border-white/30 hover:bg-white/10">
              Browse Treatments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
