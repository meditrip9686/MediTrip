import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, CheckCircle2, Clock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface Payment {
  id: string;
  amount_inr: number;
  amount_usd: number;
  status: string;
  demo_last4: string;
  created_at: string;
  booking_id: string;
}

export default function PaymentsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      if (!user) { setIsDataLoading(false); return; }
      try {
        const { data: bookings } = await supabase
          .from('bookings')
          .select('id')
          .eq('patient_id', user.id);
        
        if (bookings && bookings.length > 0) {
          const bookingIds = bookings.map(b => b.id);
          const { data } = await supabase
            .from('payments')
            .select('*')
            .in('booking_id', bookingIds)
            .order('created_at', { ascending: false });
          setPayments(data || []);
        }
      } catch (error) { console.error(error); }
      finally { setIsDataLoading(false); }
    }
    fetchPayments();
  }, [user]);

  if (authLoading || isDataLoading) {
    return <div className="flex justify-center items-center py-32"><Loader2 className="w-10 h-10 animate-spin text-primary-500" /></div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-dark">Payment History</h1>
          <p className="text-slate-500 mt-1">All transactions are secure demo payments. No real money was charged.</p>
        </div>
        <Link to="/book/step-1" className="btn-primary btn-sm">New Booking <ArrowRight className="w-4 h-4" /></Link>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <p className="text-amber-800 text-sm font-medium">Sandbox Mode: All transactions are simulated. No real charges were made.</p>
      </div>

      {payments.length === 0 ? (
        <div className="premium-card !border-dashed !border-slate-200 text-center py-16">
          <CreditCard className="w-14 h-14 text-slate-300 mx-auto mb-5" />
          <h3 className="text-xl font-bold text-dark mb-2">No Payments Yet</h3>
          <p className="text-slate-500 text-sm mb-8">Your payment history will appear here after completing a booking.</p>
          <Link to="/book/step-1" className="btn-primary">Make a Booking</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {payments.map((p) => (
            <div key={p.id} className="premium-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${p.status === 'success' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  {p.status === 'success' 
                    ? <CheckCircle2 className="w-6 h-6 text-success" /> 
                    : <Clock className="w-6 h-6 text-danger" />}
                </div>
                <div>
                  <p className="font-bold text-dark">Card ending in ···· {p.demo_last4 || '----'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{new Date(p.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xl font-black text-dark">₹{Number(p.amount_inr).toLocaleString()}</p>
                  <p className="text-xs text-slate-400">≈ ${Number(p.amount_usd).toLocaleString()} USD</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${p.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
