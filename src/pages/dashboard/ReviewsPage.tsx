import { useState, useEffect } from 'react';
import { Star, CheckCircle2, Loader2, Send, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface Booking {
  id: string;
  treatment?: { name: string };
  hospital?: { name: string };
  status: string;
}

interface Review {
  id: string;
  rating: number;
  body: string;
  treatment_name: string;
  created_at: string;
  is_published: boolean;
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setIsLoading(true);
      const [{ data: bData }, { data: rData }] = await Promise.all([
        supabase.from('bookings')
          .select('id, status, treatment:treatments(name), hospital:hospitals(name)')
          .eq('patient_id', user!.id)
          .eq('status', 'completed'),
        supabase.from('reviews')
          .select('*')
          .eq('patient_id', user!.id)
          .order('created_at', { ascending: false }),
      ]);
      setBookings(bData || []);
      setReviews(rData || []);
      setIsLoading(false);
    }
    load();
  }, [user]);

  const handleSubmit = async () => {
    if (!rating || !body.trim() || !selectedBooking || !user) return;
    setSubmitting(true);
    const booking = bookings.find(b => b.id === selectedBooking);
    await supabase.from('reviews').insert({
      patient_id: user.id,
      booking_id: selectedBooking,
      rating,
      body: body.trim(),
      treatment_name: booking?.treatment?.name || '',
      patient_name: user.email || '',
      is_published: false,
    });
    setSubmitted(true);
    setRating(0);
    setBody('');
    setSelectedBooking('');
    setSubmitting(false);
    // Refresh
    const { data } = await supabase.from('reviews').select('*').eq('patient_id', user.id).order('created_at', { ascending: false });
    setReviews(data || []);
  };

  if (isLoading) return <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-primary-500" /></div>;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-black text-dark">My Reviews</h1>
        <p className="text-slate-500 mt-1">Your feedback helps thousands of international patients choose with confidence.</p>
      </div>

      {/* Submit Review */}
      {bookings.length > 0 && !submitted && (
        <div className="premium-card">
          <h2 className="text-lg font-bold text-dark mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" /> Write a Review
          </h2>
          <div className="space-y-6">
            <div>
              <label className="label">Select Completed Treatment</label>
              <select value={selectedBooking} onChange={e => setSelectedBooking(e.target.value)} className="input">
                <option value="">Choose a booking…</option>
                {bookings.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.treatment?.name} at {b.hospital?.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(s)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        s <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm font-bold text-slate-500 self-center">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="label">Share Your Experience</label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Tell us about the quality of care, communication, facilities, and overall experience…"
                className="input min-h-[120px] py-3 text-sm"
                rows={5}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!rating || !body.trim() || !selectedBooking || submitting}
              className="btn-primary disabled:opacity-50 gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {submitted && (
        <div className="premium-card !bg-emerald-50 !border-emerald-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-dark">Review Submitted!</p>
            <p className="text-sm text-slate-500">Your review is pending approval and will be published shortly.</p>
          </div>
        </div>
      )}

      {/* No completed bookings */}
      {bookings.length === 0 && reviews.length === 0 && (
        <div className="premium-card !border-dashed !border-slate-200 text-center py-16">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-dark mb-2">No Reviews Yet</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">
            Reviews are available once your treatment is marked as completed by our team.
          </p>
          <Link to="/dashboard/bookings" className="btn-primary">View My Bookings</Link>
        </div>
      )}

      {/* Previous Reviews */}
      {reviews.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-dark mb-5">Your Reviews ({reviews.length})</h2>
          <div className="flex flex-col gap-4">
            {reviews.map(r => (
              <div key={r.id} className="premium-card">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="font-bold text-dark">{r.treatment_name}</p>
                    <p className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{r.body}</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    r.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <MessageSquare className="w-3 h-3" />
                    {r.is_published ? 'Published' : 'Pending Review'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
