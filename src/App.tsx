import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import BookingLayout from './layouts/BookingLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import TreatmentsPage from './pages/TreatmentsPage';
import TreatmentDetailPage from './pages/TreatmentDetailPage';
import HospitalsPage from './pages/HospitalsPage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import PackagesPage from './pages/PackagesPage';
import { HospitalProfilePage } from './pages/HospitalProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiePolicy from './pages/CookiePolicy';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import WhyIndiaPage from './pages/WhyIndiaPage';
import NotFoundPage from './pages/NotFoundPage';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import BookingsPage from './pages/dashboard/BookingsPage';
import DocumentsPage from './pages/dashboard/DocumentsPage';
import MessagesPage from './pages/dashboard/MessagesPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import ReviewsPage from './pages/dashboard/ReviewsPage';
import AftercarePage from './pages/dashboard/AftercarePage';

// Booking Pages
import BookStep1 from './pages/booking/BookStep1';
import BookStep2 from './pages/booking/BookStep2';
import BookStep3 from './pages/booking/BookStep3';
import BookStep4 from './pages/booking/BookStep4';
import BookStep5 from './pages/booking/BookStep5';
import BookStep6 from './pages/booking/BookStep6';
import BookingConfirmation from './pages/booking/BookingConfirmation';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import AdminTreatmentsPage from './pages/admin/AdminTreatmentsPage';
import AdminHospitalsPage from './pages/admin/AdminHospitalsPage';
import AdminDoctorsPage from './pages/admin/AdminDoctorsPage';
import AdminPackagesPage from './pages/admin/AdminPackagesPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminPatientsPage from './pages/admin/AdminPatientsPage';
import { AdminRoute } from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Secret Login */}
        <Route path="/1234/admin/login" element={<AdminLoginPage />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardHome />} />
          <Route path="treatments" element={<AdminTreatmentsPage />} />
          <Route path="hospitals" element={<AdminHospitalsPage />} />
          <Route path="doctors" element={<AdminDoctorsPage />} />
          <Route path="packages" element={<AdminPackagesPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="patients" element={<AdminPatientsPage />} />
          <Route path="inquiries" element={<AdminInquiriesPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/treatments" element={<TreatmentsPage />} />
          <Route path="/treatments/:slug" element={<TreatmentDetailPage />} />
          <Route path="/hospitals" element={<HospitalsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorProfilePage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/hospitals/:id" element={<HospitalProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/why-india" element={<WhyIndiaPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="aftercare" element={<AftercarePage />} />
        </Route>

        {/* Booking Wizard */}
        <Route path="/book" element={<BookingLayout />}>
          <Route path="step-1" element={<BookStep1 />} />
          <Route path="step-2" element={<BookStep2 />} />
          <Route path="step-3" element={<BookStep3 />} />
          <Route path="step-4" element={<BookStep4 />} />
          <Route path="step-5" element={<BookStep5 />} />
          <Route path="step-6" element={
            <ProtectedRoute>
              <BookStep6 />
            </ProtectedRoute>
          } />
          <Route path="confirmation" element={<BookingConfirmation />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
