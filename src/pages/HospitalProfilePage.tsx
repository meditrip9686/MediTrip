import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Users2, 
  Award, 
  Clock, 
  ArrowLeft,
  Calendar,
  Stethoscope,
  Heart,
  Globe,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { getHospitalById } from '../lib/api/hospitals';
import type { Database } from '../types/supabase';
import PageMeta from '../components/common/PageMeta';
import JsonLd from '../components/common/JsonLd';

type Hospital = Database['public']['Tables']['hospitals']['Row'];
type Doctor = Database['public']['Tables']['doctors']['Row'];

export function HospitalProfilePage() {
  const { id = '' } = useParams();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchData() {
      try {
        const hData = await getHospitalById(id);
        setHospital(hData.hospital);
        setDoctors(hData.doctors);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-96 bg-slate-100 rounded-[40px] mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-slate-100 rounded-card" />
              <div className="h-96 bg-slate-100 rounded-card" />
            </div>
            <div className="h-80 bg-slate-100 rounded-card" />
          </div>
        </div>
      </div>
    );
  }

  if (!hospital) return <div>Hospital not found</div>;

  const hospitalStructuredData = {
    "@context": "https://schema.org",
    "@type": "Hospital",
    "name": hospital.name,
    "image": hospital.images && hospital.images.length > 0 ? hospital.images[0] : `https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800`,
    "description": hospital.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": hospital.city,
      "addressRegion": hospital.state,
      "addressCountry": "IN"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": hospital.rating,
      "reviewCount": hospital.review_count || 100
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <PageMeta 
        title={`${hospital.name} in ${hospital.city} | MediTrip Partner`} 
        description={hospital.description ? hospital.description.substring(0, 160) : `Book your treatment at ${hospital.name}, a leading JCI-accredited facility in ${hospital.city}, India.`} 
      />
      <JsonLd data={hospitalStructuredData} />
      {/* Hero Header */}
      <div className="relative pt-32 pb-64 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-slate-900" />
        {hospital.images && hospital.images[0] && (
          <img 
            src={hospital.images[0]} 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            alt=""
          />
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/hospitals" className="inline-flex items-center gap-2 text-primary-400 font-bold mb-8 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Hospitals
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-6">
              {(hospital.accreditations || []).map(a => (
                <span key={a} className="bg-primary-500/20 backdrop-blur-md text-primary-300 border border-primary-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  {a} Accredited
                </span>
              ))}
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              {hospital.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-300">
              <div className="flex items-center gap-2 font-bold">
                <MapPin className="w-5 h-5 text-primary-500" /> {hospital.city}, {hospital.state}
              </div>
              <div className="flex items-center gap-2 font-bold">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> {hospital.rating} ({hospital.review_count} Reviews)
              </div>
              <div className="flex items-center gap-2 font-bold">
                <Globe className="w-5 h-5 text-primary-400" /> International Hub
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions Bar */}
            <div className="glass-card !bg-white/80 p-2 rounded-3xl shadow-2xl flex items-center justify-between">
              <div className="flex p-1 gap-1">
                {['overview', 'specialties', 'doctors', 'facilities'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all ${
                      activeTab === tab ? 'bg-dark text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* About Section */}
            {activeTab === 'overview' && (
              <div className="premium-card space-y-8 animate-in fade-in duration-500">
                <div>
                  <h3 className="text-2xl font-bold mb-4">About the Institution</h3>
                  <p className="text-slate-600 leading-relaxed text-lg font-medium">
                    {hospital.description}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                    <Award className="w-10 h-10 text-primary-600 mb-4" />
                    <h4 className="font-bold text-lg mb-2">Clinical Excellence</h4>
                    <p className="text-slate-500 text-sm font-medium">Equipped with the latest diagnostic and surgical technology available globally.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                    <Users2 className="w-10 h-10 text-primary-600 mb-4" />
                    <h4 className="font-bold text-lg mb-2">Patient-Centric Care</h4>
                    <p className="text-slate-500 text-sm font-medium">Dedicated international lounge and multilingual staff for seamless support.</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h4 className="font-bold mb-6 text-xl">International Patient Services</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      'Visa Assistance', 'Airport Pickup', 'Language Translators', 
                      'Private Deluxe Rooms', 'Post-Op Recovery', 'Concierge Desk'
                    ].map(s => (
                      <div key={s} className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success" /> {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Doctors Section */}
            {activeTab === 'doctors' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-2xl font-bold">Leading Specialists</h3>
                  <span className="text-slate-500 font-bold text-sm">{doctors.length} Doctors Available</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {doctors.map(d => (
                    <div key={d.id} className="premium-card flex gap-5 group">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0 bg-slate-100 border-2 border-white shadow-md">
                        {d.photo_url ? (
                          <img src={d.photo_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Stethoscope className="w-8 h-8 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-dark group-hover:text-primary-600 transition-colors mb-1">{d.name}</h4>
                        <p className="text-primary-600 text-xs font-black uppercase tracking-widest mb-3">{d.specialty}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-tight">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {d.experience_yrs}y Exp</span>
                          <span className="flex items-center gap-1 text-success"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specialties Section */}
            {activeTab === 'specialties' && (
              <div className="premium-card animate-in fade-in duration-500">
                <h3 className="text-2xl font-bold mb-8">Centers of Excellence</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {(hospital.specialties || []).map(s => (
                    <div key={s} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary-200 transition-all text-center group">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <Heart className="w-6 h-6 text-primary-500" />
                      </div>
                      <span className="font-bold text-dark">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="space-y-6">
            <div className="premium-card !bg-dark border-none text-white sticky top-24 shadow-2xl shadow-primary-900/20">
              <h3 className="text-2xl font-bold mb-6">Plan Your Visit</h3>
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500 transition-colors">
                    <Calendar className="w-6 h-6 text-primary-400 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold leading-tight">Fast-Track Booking</p>
                    <p className="text-slate-400 text-xs mt-0.5">Priority appointments within 48h</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500 transition-colors">
                    <PhoneCall className="w-6 h-6 text-primary-400 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold leading-tight">Dedicated Concierge</p>
                    <p className="text-slate-400 text-xs mt-0.5">24/7 Personal health assistant</p>
                  </div>
                </div>
              </div>

              <Link to={`/book/step-1?hospital=${hospital.id}`} className="btn-primary w-full justify-center !py-5 !text-lg mb-4">
                Start Booking Now
              </Link>
              <button className="btn-secondary !bg-transparent !text-white !border-white/20 w-full justify-center !py-5 hover:!bg-white/10">
                Contact Hospital Desk
              </button>
              <p className="text-center text-slate-500 text-xs font-medium mt-6 leading-relaxed">
                * MediTrip offers up to 20% discount on hospital standard rates through our partner network.
              </p>
            </div>

            <div className="premium-card">
              <h4 className="font-bold mb-4 text-lg">Hospital Location</h4>
              <div className="aspect-square bg-slate-100 rounded-3xl mb-4 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-slate-300" />
              </div>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                {hospital.address}<br />
                {hospital.city}, {hospital.state}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
