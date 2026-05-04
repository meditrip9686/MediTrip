import { useState } from 'react';
import { 
  Plus, 
  Minus, 
  HelpCircle, 
  Search, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck,
  Globe,
  DollarSign,
  Clock
} from 'lucide-react';

const FAQS = [
  {
    category: 'General',
    q: 'How does MediTrip work?',
    a: 'MediTrip is an end-to-end medical concierge. We help you find the right hospital, get a medical opinion, arrange your visa, book your stay, and manage your entire clinical journey in India.'
  },
  {
    category: 'Payments',
    q: 'Do I pay MediTrip or the hospital?',
    a: 'You pay the hospital directly for your medical treatment. MediTrip provides coordination and support services. Some premium concierge packages may have separate service fees which are clearly disclosed upfront.'
  },
  {
    category: 'Travel',
    q: 'Can you help with my medical visa?',
    a: 'Yes, we provide a formal visa invitation letter from the partner hospital and guide you through the e-Medical Visa application process.'
  },
  {
    category: 'Clinical',
    q: 'How do I know the surgeons are qualified?',
    a: 'All surgeons in our network are fellowship-trained, board-certified, and vetted for their clinical outcomes. We only work with JCI and NABH accredited hospitals.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Premium Header */}
      <div className="relative pt-32 pb-24 bg-dark overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-dark" />
        <div className="absolute top-0 right-0 w-1/4 h-full bg-primary-500/5 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="section-tag !text-primary-400">Knowledge Base</span>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Frequently Asked <span className="text-primary-400">Questions</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about your medical journey, from clinical quality to travel logistics.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-32">
        {/* Search */}
        <div className="premium-card !p-2 mb-12 shadow-2xl">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for answers (e.g. 'Visa', 'Payment', 'Doctor')..." 
              className="w-full bg-transparent border-none py-6 pl-14 pr-6 text-dark font-medium focus:ring-0 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Globe, label: 'General' },
            { icon: DollarSign, label: 'Payments' },
            { icon: ShieldCheck, label: 'Safety' },
            { icon: Clock, label: 'Logistics' }
          ].map((cat, i) => (
            <button key={i} className="premium-card !p-6 flex flex-col items-center gap-3 hover:!border-primary-500 hover:!bg-primary-50 transition-all group">
              <cat.icon className="w-6 h-6 text-slate-400 group-hover:text-primary-600 transition-colors" />
              <span className="font-bold text-slate-600 group-hover:text-dark text-xs uppercase tracking-widest">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx} 
              className={`premium-card !p-0 overflow-hidden transition-all duration-300 ${openIndex === idx ? '!border-primary-500 shadow-xl' : ''}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-8 py-6 text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">0{idx + 1}</span>
                  <span className={`font-bold text-lg transition-colors ${openIndex === idx ? 'text-primary-600' : 'text-dark'}`}>{faq.q}</span>
                </div>
                <div className={`w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center transition-all ${openIndex === idx ? 'rotate-180 bg-primary-600 border-none' : ''}`}>
                  {openIndex === idx ? <Minus className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-slate-400" />}
                </div>
              </button>
              
              {openIndex === idx && (
                <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                  <div className="pl-12">
                    <p className="text-slate-500 text-lg leading-relaxed font-medium">
                      {faq.a}
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      <button className="text-xs font-black text-primary-500 uppercase tracking-widest hover:underline">Was this helpful?</button>
                      <span className="text-slate-200">|</span>
                      <button className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-dark">Report Issue</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Help CTA */}
        <div className="mt-20 premium-card !bg-slate-900 border-none text-white text-center !p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-primary-600/10 blur-[80px] -z-10" />
          <HelpCircle className="w-12 h-12 text-primary-400 mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4">Still have questions?</h3>
          <p className="text-slate-400 text-lg mb-10 font-medium">Our medical concierge team is available 24/7 to help you with personalized answers.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary !px-12">
              Chat With Us <MessageCircle className="w-5 h-5 ml-2" />
            </button>
            <button className="btn-secondary !bg-transparent !text-white !border-white/20 !px-12 hover:!bg-white/5">
              Contact Support <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
