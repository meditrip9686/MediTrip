import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  GraduationCap, Building2, History, Star, CheckCircle2,
  ArrowLeft, Loader2, Stethoscope, ArrowRight, ShieldCheck
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import PageMeta from '../components/common/PageMeta';
import JsonLd from '../components/common/JsonLd';

export default function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctor() {
      if (!id) return;
      const { data } = await supabase
        .from('doctors')
        .select('*, hospital:hospitals(*)')
        .eq('id', id)
        .single();
      setDoctor(data);
      setIsLoading(false);
    }
    fetchDoctor();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f8fafc]">
        <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Stethoscope className="w-16 h-16 text-slate-300" />
        <h2 className="text-xl font-bold text-dark">Doctor Not Found</h2>
        <Link to="/doctors" className="btn-primary">Browse Doctors</Link>
      </div>
    );
  }

  const doctorStructuredData = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": `Dr. ${doctor.name}`,
    "image": doctor.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || 'Doctor')}`,
    "medicalSpecialty": doctor.specialty,
    "description": doctor.bio,
    "memberOf": doctor.hospital ? {
      "@type": "Hospital",
      "name": doctor.hospital.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": doctor.hospital.city
      }
    } : undefined
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <PageMeta 
        title={`Dr. ${doctor.name} - ${doctor.specialty} | MediTrip`} 
        description={doctor.bio ? doctor.bio.substring(0, 160) : `Book a consultation with Dr. ${doctor.name}, a leading ${doctor.specialty} specialist.`} 
      />
      <JsonLd data={doctorStructuredData} />
      
      {/* Dark Hero */}
      <div className="relative bg-slate-900 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-slate-900" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-500/10 rounded-full blur-[80px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/doctors" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Doctors
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-8">
            <div className="relative flex-shrink-0">
              <img
                src={doctor.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || 'Doctor')}&background=0EA5E9&color=fff&size=200`}
                alt={doctor.name || ''}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover ring-4 ring-primary-500/30 shadow-2xl"
              />
              {doctor.is_verified && (
                <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {doctor.is_verified && (
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-black rounded-full uppercase tracking-wider">
                    ✓ Verified Specialist
                  </span>
                )}
                <span className="px-3 py-1 bg-white/10 text-slate-300 text-xs font-bold rounded-full">
                  {doctor.specialty}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{doctor.name}</h1>
              <p className="text-primary-400 font-bold mb-2">{doctor.degree}</p>
              {doctor.hospital && (
                <p className="text-slate-400 flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4" /> {doctor.hospital.name}, {doctor.hospital.city}
                </p>
              )}

              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                  <p className="text-3xl font-black text-white">{doctor.experience_yrs}</p>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Years Exp.</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                  <p className="text-3xl font-black text-emerald-400">{doctor.success_rate}%</p>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Success Rate</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <p className="text-3xl font-black text-amber-400">4.9</p>
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400 self-center" />
                  </div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Patient Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Bio & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            {doctor.bio && (
              <div className="premium-card">
                <h2 className="text-xl font-bold text-dark mb-4">About Dr. {doctor.name?.split(' ').pop()}</h2>
                <p className="text-slate-600 leading-relaxed text-[15px]">{doctor.bio}</p>
              </div>
            )}

            {/* Qualifications */}
            <div className="premium-card">
              <h2 className="text-xl font-bold text-dark mb-6">Qualifications & Expertise</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Degree</p>
                    <p className="font-bold text-dark">{doctor.degree}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <History className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Experience</p>
                    <p className="font-bold text-dark">{doctor.experience_yrs} Years of Practice</p>
                  </div>
                </div>
                {doctor.hospital && (
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Hospital</p>
                      <p className="font-bold text-dark">{doctor.hospital.name}</p>
                      <p className="text-xs text-slate-400">{doctor.hospital.city}, {doctor.hospital.state}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Why Choose */}
            <div className="premium-card">
              <h2 className="text-xl font-bold text-dark mb-6">Why Choose This Doctor</h2>
              <div className="space-y-3">
                {[
                  'International patient experience with multilingual support',
                  'Board-certified with verifiable credentials',
                  `${doctor.success_rate}% documented success rate across all procedures`,
                  'Available for pre-consultation video calls',
                  'Full post-treatment aftercare and follow-up included',
                ].map(p => (
                  <div key={p} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-600 text-sm">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking CTA */}
          <div className="space-y-6">
            <div className="premium-card sticky top-24">
              <p className="text-xs font-black text-primary-600 uppercase tracking-widest mb-2">Book This Specialist</p>
              <h3 className="text-lg font-black text-dark mb-1">Dr. {doctor.name}</h3>
              <p className="text-slate-500 text-sm mb-6">{doctor.specialty} · {doctor.hospital?.name}</p>

              <Link
                to={`/book/step-1?doctor=${doctor.id}`}
                className="btn-primary !w-full justify-center !py-4 mb-3"
              >
                Book a Consultation <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="btn-secondary !w-full justify-center !py-3 !text-sm">
                Ask a Question First
              </Link>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  Free initial consultation
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  Full case management included
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  24/7 concierge support
                </div>
              </div>
            </div>

            {/* Hospital Card */}
            {doctor.hospital && (
              <Link to={`/hospitals/${doctor.hospital.id}`} className="premium-card block group hover:!border-primary-300 transition-all">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Affiliated Hospital</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                    <Building2 className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">{doctor.hospital.name}</p>
                    <p className="text-xs text-slate-400">{doctor.hospital.city} · {(doctor.hospital.accreditations || []).slice(0,2).join(', ')}</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
