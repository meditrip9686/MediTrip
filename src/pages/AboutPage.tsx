import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Globe, 
  Award, 
  Heart, 
  Target,
  Eye,
  ArrowRight
} from 'lucide-react';
import PageMeta from '../components/common/PageMeta';

export default function AboutPage() {
  const values = [
    { title: 'Excellence', text: 'We partner only with JCI & NABH accredited hospitals of international repute.', icon: Award },
    { title: 'Compassion', text: 'Every patient is a guest, and we ensure their journey is comfortable and stress-free.', icon: Heart },
    { title: 'Transparency', text: 'Clear, upfront pricing with no hidden costs or surprise medical bills.', icon: ShieldCheck },
    { title: 'Accessibility', text: 'Connecting patients from across the globe to India’s leading healthcare hub.', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <PageMeta 
        title="About Us" 
        description="Learn about our mission to make world-class healthcare accessible globally through our premium medical concierge platform." 
      />
      {/* Premium Header */}
      <div className="relative pt-40 pb-32 bg-dark overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-dark" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="section-tag !text-primary-400">Our Story</span>
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-8 leading-tight">
            Redefining the <br />
            <span className="text-primary-400">Medical Journey.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
            MediTrip was founded on a simple belief: world-class healthcare should be accessible to everyone, regardless of their geographic borders.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Founded', value: '2018' },
            { label: 'Patients Served', value: '15k+' },
            { label: 'Partner Hospitals', value: '200+' },
            { label: 'NPS Score', value: '92%' }
          ].map((stat, i) => (
            <div key={i} className="premium-card text-center !py-10">
              <p className="text-4xl font-black text-dark mb-2 tracking-tight">{stat.value}</p>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-square bg-slate-200 rounded-[48px] overflow-hidden shadow-2xl relative z-10">
                <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-600 rounded-[40px] -z-10 flex flex-col justify-center p-8 text-white">
                <p className="text-4xl font-black mb-2">98%</p>
                <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">Average success rate across procedures</p>
              </div>
            </div>

            <div>
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-dark">Our Mission</h2>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  To provide a seamless, transparent, and high-quality medical travel experience that empowers patients to take control of their health without financial burden.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-dark">Our Vision</h2>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  To become the world’s most trusted medical concierge platform, recognized for ethical standards, clinical excellence, and compassionate care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="section-tag !text-primary-400">Our Core DNA</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Values that Drive Us</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="premium-card !bg-white/5 border-white/10 backdrop-blur-xl group hover:!bg-primary-600 hover:!border-primary-500 transition-all duration-500">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
                  <v.icon className="w-7 h-7 text-primary-400 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{v.title}</h3>
                <p className="text-slate-400 group-hover:text-primary-50 text-sm font-medium leading-relaxed transition-colors">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section Placeholder */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag">Leadership</span>
          <h2 className="text-4xl font-bold text-dark mb-16">The Minds Behind MediTrip</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { name: 'Dr. Sameer Gupta', role: 'Chief Medical Officer', img: 'https://i.pravatar.cc/300?u=1' },
              { name: 'Ananya Sharma', role: 'Head of Patient Care', img: 'https://i.pravatar.cc/300?u=2' },
              { name: 'Mark Wilson', role: 'Operations Director', img: 'https://i.pravatar.cc/300?u=3' },
            ].map((member, i) => (
              <div key={i} className="group">
                <div className="aspect-[4/5] rounded-[48px] overflow-hidden mb-6 shadow-xl relative">
                  <img src={member.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-2xl font-bold text-dark mb-1">{member.name}</h4>
                <p className="text-primary-600 font-black uppercase tracking-widest text-[10px]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="premium-card !bg-primary-600 !p-16 text-center border-none shadow-2xl shadow-primary-500/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 skew-x-[-20deg] translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-6">Experience the Elite Concierge Care</h2>
              <p className="text-primary-50 text-lg mb-10 max-w-2xl mx-auto font-medium">Join thousands of international patients who have successfully transformed their lives with MediTrip.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup" className="btn-secondary !bg-white !text-primary-600 border-none !px-12 !py-5">
                  Get Started Today
                </Link>
                <Link to="/contact" className="btn-secondary !bg-transparent !text-white !border-white/30 !px-12 !py-5 hover:!bg-white/10">
                  Talk to Us <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
