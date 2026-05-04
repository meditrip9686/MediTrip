import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  Globe, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import PageMeta from '../components/common/PageMeta';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <PageMeta 
        title="Contact Us & Free Quote" 
        description="Contact MediTrip's 24/7 medical concierge for a free evaluation, treatment quote, or any questions about traveling to India for healthcare." 
      />
      {/* Premium Header */}
      <div className="relative pt-32 pb-48 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-slate-900" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-500/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="section-tag !text-primary-400">Concierge Desk</span>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            We’re Here to <span className="text-primary-400">Support You</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Have questions about a procedure, hospital, or visa? Our medical consultants are available 24/7 to assist with your healthcare journey.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-32">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="premium-card !p-8 group hover:!bg-primary-600 transition-all duration-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full -mr-12 -mt-12 group-hover:bg-white/10 transition-colors" />
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
                <Phone className="w-7 h-7 text-primary-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-dark group-hover:text-white mb-4 transition-colors">Call Our Experts</h3>
              <p className="text-slate-500 font-medium group-hover:text-primary-100 mb-8 transition-colors">Available for instant consultation and emergency support.</p>
              <a href="tel:+918001234567" className="text-xl font-black text-primary-600 group-hover:text-white transition-colors flex items-center gap-2">
                +91 (800) 123-4567 <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>

            <div className="premium-card !p-8 group hover:!bg-dark transition-all duration-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 rounded-full -mr-12 -mt-12 group-hover:bg-white/5 transition-colors" />
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors">
                <Mail className="w-7 h-7 text-dark group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-dark group-hover:text-white mb-4 transition-colors">Email Concierge</h3>
              <p className="text-slate-500 font-medium group-hover:text-slate-400 mb-8 transition-colors">Send us your medical reports for a free clinical evaluation.</p>
              <a href="mailto:concierge@meditrip.in" className="text-lg font-black text-dark group-hover:text-primary-400 transition-colors flex items-center gap-2">
                concierge@meditrip.in <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>

            <div className="premium-card !p-8 bg-white">
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary-500 mb-8">Global Offices</h4>
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-dark mb-1">HQ - New Delhi, India</p>
                    <p className="text-slate-500 text-sm font-medium">Cyber City, Phase 3, Gurugram, Haryana 122002</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-dark mb-1">Dubai Representative</p>
                    <p className="text-slate-500 text-sm font-medium">Business Bay, Dubai, UAE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="premium-card !p-10 lg:!p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary-600" />
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold text-dark mb-4">Request a <span className="gradient-text">Medical Quote</span></h2>
                <p className="text-slate-500 font-medium mb-12">Fill out the form below and one of our clinical case managers will contact you with a customized treatment plan within 24 hours.</p>
                
                <form className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="label">Full Name</label>
                      <input type="text" placeholder="John Doe" className="input" />
                    </div>
                    <div className="space-y-2">
                      <label className="label">Email Address</label>
                      <input type="email" placeholder="john@example.com" className="input" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="label">Phone Number</label>
                      <input type="tel" placeholder="+1 (555) 000-0000" className="input" />
                    </div>
                    <div className="space-y-2">
                      <label className="label">Interested Treatment</label>
                      <select className="input appearance-none">
                        <option>Select Procedure</option>
                        <option>Knee Replacement</option>
                        <option>Cardiac Surgery</option>
                        <option>IVF Treatment</option>
                        <option>Spine Surgery</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="label">How can we help you?</label>
                    <textarea 
                      placeholder="Describe your medical condition or any specific requirements..." 
                      rows={5} 
                      className="input resize-none"
                    />
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                    <button type="submit" className="btn-primary !py-5 !px-12 w-full sm:w-auto shadow-2xl shadow-primary-500/40">
                      Send Request <Send className="w-5 h-5 ml-2" />
                    </button>
                    <p className="text-slate-400 text-xs font-medium flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-success" /> Your data is 256-bit encrypted & HIPAA compliant.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Support Badges */}
            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              {[
                { icon: MessageSquare, title: '24/7 Support', text: 'Real-time chat with doctors' },
                { icon: Clock, title: 'Quick Response', text: 'Quotes within 24 hours' },
                { icon: Globe, title: 'Multilingual', text: 'Support in 10+ languages' }
              ].map((item, i) => (
                <div key={i} className="premium-card !p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-dark leading-tight">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
