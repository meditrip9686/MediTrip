export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-dark mb-8 text-center">Terms of Service</h1>
          <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
            <p className="text-sm text-gray-400">Last Updated: May 2026</p>
            
            <section>
              <h2 className="text-xl font-bold text-dark mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using MediTrip, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-3">2. Description of Service</h2>
              <p>MediTrip acts as a facilitator connecting international patients with healthcare providers in India. We do not provide medical advice, diagnosis, or treatment. All medical care is provided by the respective hospitals and doctors.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-3">3. Patient Responsibility</h2>
              <p>Patients are responsible for providing accurate medical history, obtaining necessary travel documents (including medical visas), and adhering to post-treatment recovery protocols provided by their surgeons.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-3">4. Limitation of Liability</h2>
              <p>MediTrip is not liable for any outcomes of medical procedures, hospital errors, or complications. Our liability is limited to the management of logistics and information provided through our platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-3">5. Booking & Payments</h2>
              <p>Treatment costs provided on the platform are estimates. Final pricing is determined by the hospital after a direct consultation. Payments for treatment are made directly to the healthcare provider.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
