import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useBookingStore } from '../../store/bookingStore';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeft, CreditCard, Lock, AlertTriangle, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

export default function BookStep6() {
  const navigate = useNavigate();
  const { step1, step2, step3, step4, setStep, setBookingId } = useBookingStore();
  const { user } = useAuth();
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [failed, setFailed] = useState(false);

  const total = step3.baseCost ?? 0;
  const last4 = cardNumber.replace(/\s/g, '').slice(-4);

  const formatCard = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val: string) =>
    val.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2');

  const pay = async () => {
    if (!cardName || cardNumber.replace(/\s/g, '').length < 12 || expiry.length < 5 || cvv.length < 3) return;
    setProcessing(true);
    setFailed(false);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 2500));

    if (last4 === '1111' || last4 !== '0000') {
      const bId = `MED-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setBookingId(bId);

      if (user) {
        const { data: booking } = await supabase.from('bookings').insert({
          patient_id: user.id,
          treatment_id: step1.treatmentId || null,
          hospital_id: step2.hospitalId || null,
          doctor_id: step2.doctorId || null,
          package_id: step3.packageId || null,
          status: 'confirmed',
          travel_month: step1.travelMonth,
          travel_flexible: step1.travelFlexible,
          companions: step1.companions,
          medical_summary: step4.medicalSummary,
          total_amount: total,
        }).select().single();

        if (booking) {
          await supabase.from('payments').insert({
            booking_id: booking.id,
            amount_inr: total,
            amount_usd: Math.round(total / 83),
            status: 'success',
            demo_last4: last4,
          });
        }
      }

      setStep(7);
      navigate('/book/confirmation');
    } else {
      setFailed(true);
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-dark mb-4">Secure Checkout</h1>
        <p className="text-slate-500 text-lg">Finalize your medical consultation request with our encrypted payment portal.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-8">
           {/* Demo Banner */}
           <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-dark flex-shrink-0">
                 <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                 <h4 className="font-bold text-amber-900 mb-1">Sandbox Environment Active</h4>
                 <p className="text-amber-700 text-sm leading-relaxed">This is a simulation. Any card number works except those ending in <span className="font-black text-danger">0000</span>.</p>
              </div>
           </div>

           <div className="premium-card">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold text-dark flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-primary-500" />
                    Credit or Debit Card
                 </h3>
                 <div className="flex gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200" />
                    <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200" />
                    <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200" />
                 </div>
              </div>

              {failed && (
                <div className="mb-8 p-4 bg-danger/10 border border-danger/20 rounded-2xl text-danger font-bold text-sm flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                   <AlertTriangle className="w-5 h-5" />
                   Transaction Declined. Please use a different payment method.
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="label">Cardholder Name</label>
                  <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name as on card" className="input !bg-slate-50 border-none !py-4" />
                </div>
                <div className="space-y-2 relative">
                  <label className="label">Card Number</label>
                  <input value={cardNumber} onChange={(e) => setCardNumber(formatCard(e.target.value))} placeholder="0000 0000 0000 0000" className="input !bg-slate-50 border-none !py-4 font-mono tracking-widest" maxLength={19} />
                  <div className="absolute right-4 bottom-3 text-slate-300">
                    <Lock className="w-5 h-5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="label">Expiry (MM/YY)</label>
                    <input value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" className="input !bg-slate-50 border-none !py-4" maxLength={5} />
                  </div>
                  <div className="space-y-2">
                    <label className="label">CVV / CVC</label>
                    <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="***" className="input !bg-slate-50 border-none !py-4 font-mono" />
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-success">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">256-bit SSL Encryption</span>
                 </div>
                 <p className="text-slate-400 text-[10px] font-bold">Payments processed by SecureTrips™</p>
              </div>
           </div>
        </div>

        {/* Order Sidebar */}
        <div className="space-y-6">
           <div className="premium-card !p-6 bg-slate-900 border-none">
              <h4 className="text-white font-bold mb-6 pb-4 border-b border-white/10 uppercase tracking-widest text-xs">Selection Summary</h4>
              <div className="space-y-4 mb-8">
                 <div className="flex justify-between items-start">
                    <span className="text-slate-400 text-xs">Procedure</span>
                    <span className="text-white text-xs font-bold text-right ml-4">{step1.treatmentName}</span>
                 </div>
                 <div className="flex justify-between items-start">
                    <span className="text-slate-400 text-xs">Hospital</span>
                    <span className="text-white text-xs font-bold text-right ml-4">{step2.hospitalName}</span>
                 </div>
                 <div className="flex justify-between items-start">
                    <span className="text-slate-400 text-xs">Tier</span>
                    <span className="text-white text-xs font-bold text-right ml-4">{step3.packageName}</span>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                 <p className="text-primary-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Due</p>
                 <h2 className="text-3xl font-black text-white">₹{total?.toLocaleString()}</h2>
                 <p className="text-slate-500 text-xs mt-1">~${Math.round(total / 83).toLocaleString()} USD</p>
              </div>
           </div>

           <div className="premium-card !p-6 !bg-primary-50/30 border-primary-100">
              <div className="flex items-center gap-3 mb-4">
                 <CheckCircle2 className="w-5 h-5 text-success" />
                 <h4 className="text-dark font-bold text-sm">Safe & Verified</h4>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">Your booking is protected by our Medical Excellence Guarantee. Free cancellation up to 14 days before travel.</p>
           </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="pt-10 flex items-center justify-between border-t border-slate-100">
        <button 
          onClick={() => { setStep(5); navigate('/book/step-5'); }} 
          className="btn-secondary !px-8"
          disabled={processing}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
        <button
          onClick={pay}
          disabled={processing || !cardName || cardNumber.length < 17 || expiry.length < 5 || cvv.length < 3}
          className={`btn-primary !px-16 !py-5 shadow-2xl shadow-primary-500/30 min-w-[240px] ${processing ? 'opacity-80' : ''}`}
        >
          {processing ? (
            <span className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <Lock className="w-5 h-5" />
              Pay ₹{total?.toLocaleString()}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
