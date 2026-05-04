import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, FileText, MessageSquare, Plane, ArrowRight, Package, Star, Loader2, CheckCircle2, HeartPulse, CreditCard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export default function DashboardHome() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState({ bookings: 0, messages: 0, documents: 0, nextTravel: 'None' });
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) { setIsDataLoading(false); return; }
      try {
        const [
          { count: bookingsCount },
          { count: messagesCount },
          { count: docsCount },
          { data: recentBooking }
        ] = await Promise.all([
          supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('patient_id', user.id),
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('sender_id', user.id),
          supabase.from('documents').select('*', { count: 'exact', head: true }).eq('patient_id', user.id),
          supabase.from('bookings').select('travel_month').eq('patient_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle()
        ]);
        setStats({ bookings: bookingsCount || 0, messages: messagesCount || 0, documents: docsCount || 0, nextTravel: recentBooking?.travel_month || 'None' });
      } catch (error) { console.error(error); }
      finally { setIsDataLoading(false); }
    }
    fetchStats();
  }, [user]);

  if (authLoading || isDataLoading) {
    return <div className="flex justify-center items-center py-32"><Loader2 className="w-10 h-10 animate-spin text-primary-500" /></div>;
  }

  const statCards = [
    { icon: CalendarDays, label: 'Active Bookings', value: stats.bookings.toString(), colorBg: 'bg-primary-500', href: '/dashboard/bookings' },
    { icon: MessageSquare, label: 'Messages', value: stats.messages.toString(), colorBg: 'bg-amber-500', href: '/dashboard/messages' },
    { icon: FileText, label: 'Documents', value: stats.documents.toString(), colorBg: 'bg-emerald-500', href: '/dashboard/documents' },
    { icon: Plane, label: 'Next Travel', value: stats.nextTravel, colorBg: 'bg-purple-500', href: '/dashboard/bookings' },
  ];

  const quickActions = [
    { icon: FileText, label: 'Upload Medical Records', href: '/dashboard/documents', color: 'from-blue-500 to-primary-600' },
    { icon: MessageSquare, label: 'Message Concierge', href: '/dashboard/messages', color: 'from-amber-500 to-orange-600' },
    { icon: Star, label: 'Write a Review', href: '/dashboard/reviews', color: 'from-purple-500 to-pink-600' },
    { icon: HeartPulse, label: 'Aftercare & Follow-Up', href: '/dashboard/aftercare', color: 'from-emerald-500 to-teal-600' },
    { icon: CreditCard, label: 'Payment History', href: '/dashboard/payments', color: 'from-slate-600 to-slate-800' },
    { icon: ShieldCheck, label: 'My Profile', href: '/dashboard/profile', color: 'from-rose-500 to-red-600' },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Premium Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-primary-900 p-8 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-500/10 blur-3xl rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-primary-400 text-xs font-black uppercase tracking-[0.3em] mb-2">Patient Portal</p>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Welcome back,<br /><span className="text-primary-400">{profile?.full_name?.split(' ')[0] ?? 'Patient'}</span> 👋
            </h1>
            <p className="text-slate-400 mt-3 font-medium">Your world-class medical journey continues here.</p>
          </div>
          <Link to="/book/step-1" className="btn-primary !bg-white !text-primary-700 hover:!bg-primary-50 flex-shrink-0 shadow-2xl shadow-white/10">
            New Booking <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, colorBg, href }) => (
          <Link key={label} to={href} className="premium-card group hover:!border-primary-300 transition-all duration-300 flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-2xl ${colorBg} flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-dark">{value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Booking Status Banner */}
      {stats.bookings === 0 ? (
        <div className="premium-card !border-dashed !border-primary-200 !bg-primary-50/30 text-center py-14">
          <Package className="w-14 h-14 text-primary-300 mx-auto mb-5" />
          <h3 className="text-xl font-bold text-dark mb-2">No Active Bookings</h3>
          <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">Start your medical journey by browsing our curated treatments and world-class hospitals.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/treatments" className="btn-primary">Browse Treatments</Link>
            <Link to="/hospitals" className="btn-secondary">View Hospitals</Link>
          </div>
        </div>
      ) : (
        <div className="premium-card !bg-emerald-50 !border-emerald-200">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-7 h-7 text-success" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-dark text-lg">You have {stats.bookings} active booking{stats.bookings > 1 ? 's' : ''}!</h3>
              <p className="text-sm text-slate-600 mt-0.5">Our concierge team will reach out to you shortly for next steps.</p>
            </div>
            <Link to="/dashboard/bookings" className="btn-secondary btn-sm flex-shrink-0">View Details</Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-dark mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map(({ icon: Icon, label, href, color }) => (
            <Link key={label} to={href} className="premium-card group flex flex-col items-center text-center gap-4 py-6 hover:!border-primary-300 transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs font-bold text-slate-600 leading-tight">{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
