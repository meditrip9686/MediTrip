import { Link } from 'react-router-dom';
import { useBookingStore } from '../../store/bookingStore';
import { CheckCircle2, ArrowRight, Phone } from 'lucide-react';

const NEXT_STEPS = [
  { done: true, text: 'Check your email for confirmation' },
  { done: false, text: 'Upload any remaining medical documents' },
  { done: false, text: 'Apply for Indian medical visa' },
  { done: false, text: 'Book your flight to India' },
  { done: false, text: 'Your concierge will call you within 24 hours' },
];

export default function BookingConfirmation() {
  const { bookingId, step1, step2 } = useBookingStore();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="card text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-dark mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 mb-1">Booking Reference:</p>
          <p className="text-2xl font-black text-primary-500 mb-6">{bookingId}</p>

          <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
            <h3 className="font-bold text-dark mb-3">Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><p className="text-gray-500">Treatment</p><p className="font-medium">{step1.treatmentName}</p></div>
              <div><p className="text-gray-500">Hospital</p><p className="font-medium">{step2.hospitalName}</p></div>
              <div><p className="text-gray-500">Doctor</p><p className="font-medium">{step2.doctorName}</p></div>
              <div><p className="text-gray-500">Travel Month</p><p className="font-medium">{step1.travelMonth}</p></div>
            </div>
          </div>

          {/* Concierge Info */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 text-left mb-6">
            <h3 className="font-bold text-dark mb-2">Your Patient Concierge</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-bold text-lg">R</span>
              </div>
              <div>
                <p className="font-semibold text-dark">Ravi Kumar</p>
                <p className="text-sm text-gray-500">Senior Patient Coordinator</p>
                <a href="https://wa.me/91XXXXXXXXXX" className="text-primary-500 text-sm flex items-center gap-1 mt-0.5 hover:underline">
                  <Phone className="w-3 h-3" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card mb-6">
          <h3 className="font-bold text-dark mb-4">What Happens Next</h3>
          <ul className="flex flex-col gap-3">
            {NEXT_STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${step.done ? 'bg-success' : 'bg-gray-200'}`}>
                  {step.done ? (
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                  )}
                </div>
                <span className={`text-sm ${step.done ? 'text-dark font-medium' : 'text-gray-500'}`}>{step.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/dashboard" className="btn-primary flex-1 justify-center">
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/dashboard/documents" className="btn-secondary flex-1 justify-center">
            Upload Documents
          </Link>
        </div>
      </div>
    </div>
  );
}
