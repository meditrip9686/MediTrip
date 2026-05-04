export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-dark mb-8 text-center">Privacy Policy</h1>
          <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
            <p className="text-sm text-gray-400">Last Updated: May 2026</p>
            
            <section>
              <h2 className="text-xl font-bold text-dark mb-3">1. Information We Collect</h2>
              <p>We collect personal information such as your name, email address, phone number, and medical records that you voluntarily provide to facilitate your medical journey.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-3">2. How We Use Your Information</h2>
              <p>Your information is used to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Share with hospitals for medical evaluation</li>
                <li>Communicate with you regarding your booking</li>
                <li>Facilitate medical visa assistance</li>
                <li>Improve our platform services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-3">3. Data Security</h2>
              <p>We implement industry-standard encryption and security measures to protect your sensitive medical data. Your medical records are only shared with the hospitals you explicitly select.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-3">4. Third-Party Sharing</h2>
              <p>We do not sell your data. We only share it with trusted partners (hospitals, doctors, concierge teams) necessary for your treatment journey.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark mb-3">5. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information at any time through your dashboard or by contacting our support team.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
