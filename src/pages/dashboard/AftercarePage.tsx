import { HeartPulse, Pill, Phone, MessageSquare, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const aftercareSteps = [
  { icon: Calendar, title: 'Schedule Follow-Up', desc: 'Your post-procedure check-up will be arranged by your concierge within 72 hours of discharge.', status: 'pending', color: 'from-blue-500 to-primary-600' },
  { icon: Pill, title: 'Medication Reminders', desc: 'Your care team will share your prescribed medication schedule and dosage instructions.', status: 'pending', color: 'from-amber-500 to-orange-600' },
  { icon: Phone, title: 'Emergency Hotline', desc: 'Our 24/7 concierge line is available for any urgent post-treatment concerns.', status: 'available', color: 'from-emerald-500 to-teal-600' },
  { icon: MessageSquare, title: 'Teleconsultation', desc: 'Connect with your treating doctor via secure video call for follow-up consultations.', status: 'pending', color: 'from-purple-500 to-pink-600' },
];

export default function AftercarePage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-900 p-8 md:p-10">
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="relative z-10">
          <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.3em] mb-2">Recovery Support</p>
          <h1 className="text-3xl font-black text-white mb-2">Aftercare & Follow-Up</h1>
          <p className="text-slate-400 font-medium">Your wellness journey doesn't end at discharge — we're with you every step of the way.</p>
        </div>
      </div>

      <div className="premium-card !border-dashed !border-emerald-200 !bg-emerald-50/30 text-center py-12">
        <div className="w-20 h-20 rounded-3xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <HeartPulse className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-dark mb-2">No Active Aftercare Program</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">Post-treatment checklists, medication reminders, and follow-up schedules will appear here after your procedure is completed.</p>
        <Link to="/dashboard/bookings" className="btn-primary">View My Bookings</Link>
      </div>

      <div>
        <h2 className="text-xl font-bold text-dark mb-5">What's Included in Your Aftercare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aftercareSteps.map(({ icon: Icon, title, desc, status, color }) => (
            <div key={title} className="premium-card flex gap-5">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-dark">{title}</h4>
                  {status === 'available' 
                    ? <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full">Available</span>
                    : <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full">Post-Treatment</span>}
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="premium-card !bg-primary-600 border-none text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">24/7 Concierge Support</h3>
              <p className="text-primary-200 text-sm">We're always available for your post-treatment needs.</p>
            </div>
          </div>
          <Link to="/dashboard/messages" className="btn-primary !bg-white !text-primary-700 hover:!bg-primary-50 flex-shrink-0">
            Message Concierge
          </Link>
        </div>
      </div>
    </div>
  );
}
