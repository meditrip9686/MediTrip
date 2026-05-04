import { Link } from 'react-router-dom';
import { Globe, Shield, Play, MessageCircle, Mail, Phone, MapPin, HeartPulse, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/5 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Medi<span className="text-primary-400">Trip</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed font-medium">
              India's premier medical concierge service, connecting global patients with world-class healthcare excellence and personalized care.
            </p>
            <div className="flex gap-4">
              {[Globe, Shield, Play, MessageCircle].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest text-xs opacity-50">Quick Links</h4>
            <ul className="space-y-4">
              {['Treatments', 'Hospitals', 'Doctors', 'Packages', 'Why India', 'About Us', 'Contact'].map((link) => (
                <li key={link}>
                  <Link 
                    to={`/${link.toLowerCase().replace(' ', '-')}`} 
                    className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest text-xs opacity-50">Our Services</h4>
            <ul className="space-y-4">
              {[
                'Medical Visa Support',
                'Hotel & Stay Booking',
                'Language Translators',
                'Airport Transfers',
                'Post-Op Recovery',
                'Medical Concierge'
              ].map((service) => (
                <li key={service} className="text-slate-400 hover:text-slate-300 transition-colors cursor-pointer">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest text-xs opacity-50">Get In Touch</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Call Us</p>
                  <p className="text-white font-medium">+91 (800) 123-4567</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Email Us</p>
                  <p className="text-white font-medium">concierge@meditrip.in</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Visit Us</p>
                  <p className="text-white font-medium">Gurugram, Delhi NCR, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-medium">
            © {currentYear} MediTrip Global Services. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
