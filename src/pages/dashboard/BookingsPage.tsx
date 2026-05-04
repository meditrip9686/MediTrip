import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ArrowRight, Building2, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getPatientBookings, type BookingWithDetails } from '../../lib/api/bookings';

export default function BookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      if (!user) {
        setIsDataLoading(false);
        return;
      }
      try {
        const data = await getPatientBookings(user.id);
        setBookings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsDataLoading(false);
      }
    }
    fetchBookings();
  }, [user]);

  const getStatusBadge = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <span className="badge badge-green flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
      case 'pending':
        return <span className="badge badge-amber flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'cancelled':
        return <span className="badge badge-red flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="badge badge-blue">{status}</span>;
    }
  };

  if (authLoading || isDataLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">My Bookings</h1>
        <Link to="/book/step-1" className="btn-primary btn-sm">New Booking <ArrowRight className="w-4 h-4" /></Link>
      </div>

      {bookings.length === 0 ? (
        <div className="card border-dashed border-2 border-gray-200 text-center py-16">
          <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-500 mb-2">No bookings yet</h3>
          <p className="text-gray-400 text-sm mb-6">Start your medical journey by booking a treatment.</p>
          <Link to="/treatments" className="btn-primary">Browse Treatments</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((b) => (
            <div key={b.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <CalendarDays className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark">{b.treatment?.name || 'Treatment'}</h3>
                    <p className="text-sm text-gray-500">{b.travel_month || 'TBD'} • {b.companions || 0} companions</p>
                  </div>
                </div>
                <div>
                  {getStatusBadge(b.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y border-gray-50">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{b.hospital?.name || 'Hospital TBD'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary-600">₹{(Number(b.total_amount || 0) / 100000).toFixed(2)}L</span>
                  <span className="text-xs text-gray-400">Total Package</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Created {new Date(b.created_at || '').toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Link to={`/dashboard/messages?booking=${b.id}`} className="text-primary-500 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                  Contact Concierge <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

