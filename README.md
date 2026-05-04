# 🏥 MediTrip — Premium Medical Tourism Concierge Platform

> A full-stack medical tourism platform built with **React + TypeScript**, **Supabase** (Auth + DB + Realtime), and **Tailwind CSS**. Connects international patients with world-class hospitals and specialist doctors in India.

---

## 🚀 Live Demo

| Portal | URL |
|---|---|
| Public Website | `http://localhost:5173/` |
| Patient Dashboard | `http://localhost:5173/dashboard` |
| Admin Panel | `http://localhost:5173/1234/admin/login` |

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS (custom design system) |
| Backend / DB | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (email/password) |
| State | Zustand (booking wizard) |
| Routing | React Router v6 |
| Realtime | Supabase Realtime Channels |
| Icons | Lucide React |

---

## 🛠️ Getting Started

### 1. Clone & Install
```bash
git clone <repo-url>
cd MediTrip
npm install
```

### 2. Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://wuagrnmurgsjfqhrdpck.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```
App will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

---

## 📂 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── ConfirmDialog.tsx     # Reusable styled confirmation modal
│   │   ├── ProtectedRoute.tsx    # Route guards (patient + admin)
│   │   └── ...
│   └── ui/                       # Shared UI components
│
├── context/
│   └── AuthContext.tsx           # Global auth state, profile, auto-healing
│
├── hooks/
│   └── useAuth.ts                # Hook to access auth context
│
├── layouts/
│   ├── PublicLayout.tsx          # Navbar + footer wrapper for public pages
│   ├── DashboardLayout.tsx       # Sidebar layout for patient dashboard
│   ├── AdminLayout.tsx           # Sidebar layout for admin panel
│   └── BookingLayout.tsx         # Step wizard layout
│
├── lib/
│   ├── supabase.ts               # Supabase client
│   └── api/
│       ├── treatments.ts
│       ├── hospitals.ts
│       ├── doctors.ts
│       └── packages.ts
│
├── pages/
│   ├── HomePage.tsx              # Landing page with hero, features, stats
│   ├── TreatmentsPage.tsx        # Browse treatments with chip filters
│   ├── TreatmentDetailPage.tsx   # Individual treatment detail
│   ├── HospitalsPage.tsx         # Browse hospitals with filters
│   ├── HospitalProfilePage.tsx   # Individual hospital profile
│   ├── DoctorsPage.tsx           # Browse doctors with filters
│   ├── DoctorProfilePage.tsx     # Individual doctor profile (NEW)
│   ├── PackagesPage.tsx          # All-inclusive treatment packages
│   ├── BlogPage.tsx              # Medical articles and guides
│   ├── BlogPostPage.tsx          # Dynamic blog post detail page (NEW)
│   ├── WhyIndiaPage.tsx          # Cost comparison & medical tourism guide (NEW)
│   ├── AboutPage.tsx             # Company story
│   ├── ContactPage.tsx           # Contact form
│   ├── FAQPage.tsx               # Frequently asked questions
│   ├── LoginPage.tsx             # Patient login
│   ├── SignupPage.tsx            # Patient signup
│   ├── TermsPage.tsx             # Terms of service
│   ├── PrivacyPage.tsx           # Privacy policy
│   ├── CookiePolicy.tsx          # Cookie policy
│   ├── NotFoundPage.tsx          # Premium branded 404 page (NEW)
│   │
│   ├── booking/
│   │   ├── BookStep1.tsx         # Select hospital
│   │   ├── BookStep2.tsx         # Select doctor
│   │   ├── BookStep3.tsx         # Select package
│   │   ├── BookStep4.tsx         # Travel details
│   │   ├── BookStep5.tsx         # Medical summary
│   │   ├── BookStep6.tsx         # Payment (requires auth)
│   │   └── BookingConfirmation.tsx
│   │
│   ├── dashboard/                # Patient portal (requires auth)
│   │   ├── DashboardHome.tsx     # Stats + quick actions
│   │   ├── BookingsPage.tsx      # View all bookings
│   │   ├── MessagesPage.tsx      # Real-time concierge chat
│   │   ├── DocumentsPage.tsx     # Upload medical records
│   │   ├── ProfilePage.tsx       # Edit patient profile
│   │   ├── PaymentsPage.tsx      # Payment history from Supabase
│   │   ├── ReviewsPage.tsx       # Submit & view treatment reviews
│   │   └── AftercarePage.tsx     # Post-treatment care guide
│   │
│   └── admin/                    # Admin panel (requires admin role)
│       ├── AdminLoginPage.tsx    # Secret admin login
│       ├── AdminDashboardHome.tsx # Live stats + recent bookings
│       ├── AdminTreatmentsPage.tsx # Full CRUD for treatments
│       ├── AdminHospitalsPage.tsx  # Full CRUD for hospitals
│       ├── AdminDoctorsPage.tsx    # Full CRUD for doctors
│       ├── AdminPackagesPage.tsx   # Full CRUD for packages
│       ├── AdminBookingsPage.tsx   # Manage all bookings + status
│       ├── AdminPatientsPage.tsx   # Browse all patients (NEW)
│       ├── AdminInquiriesPage.tsx  # Reply to support tickets (NEW)
│       └── AdminSettingsPage.tsx  # Platform settings (NEW)
│
├── store/
│   └── bookingStore.ts           # Zustand store for booking wizard
│
└── types/
    └── supabase.ts               # Auto-generated Supabase types
```

---

## 🗺️ All Pages — Quick Reference

### 🌐 Public Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, stats, featured treatments, hospitals, testimonials |
| `/treatments` | Treatments | Browse all treatments with category chip filters |
| `/treatments/:slug` | Treatment Detail | Full treatment info, cost, hospitals, doctors |
| `/hospitals` | Hospitals | Browse hospitals filtered by city/accreditation |
| `/hospitals/:id` | Hospital Profile | Full hospital page with doctors, packages, reviews |
| `/doctors` | Doctors | Browse specialists by specialty |
| `/doctors/:id` | Doctor Profile | Full doctor bio, credentials, stats, book CTA |
| `/packages` | Packages | All-inclusive treatment bundles with pricing |
| `/blog` | Blog | Health articles, travel guides, patient stories |
| `/about` | About | Company story, team, mission |
| `/contact` | Contact | Contact form + concierge info |
| `/faq` | FAQ | Frequently asked questions |
| `/login` | Login | Patient email/password login |
| `/signup` | Sign Up | Patient registration |
| `/terms` | Terms | Terms of Service |
| `/privacy` | Privacy | Privacy Policy |
| `/cookies` | Cookies | Cookie Policy |
| `*` | 404 | Premium branded not-found page |

---

### 👤 Patient Dashboard (Requires Login)

| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard Home | Welcome banner, live stats, quick actions |
| `/dashboard/bookings` | My Bookings | View all bookings with status |
| `/dashboard/messages` | Concierge Chat | Real-time chat with admin (Supabase Realtime) |
| `/dashboard/documents` | Documents | Upload/manage medical records |
| `/dashboard/profile` | My Profile | Edit personal info, nationality, phone |
| `/dashboard/payments` | Payments | Full payment history from Supabase |
| `/dashboard/reviews` | Reviews | Submit star ratings for completed treatments |
| `/dashboard/aftercare` | Aftercare | Post-treatment care guide and concierge CTA |

---

### 🔐 Admin Panel (Requires `role = 'admin'`)

**Secret Login URL:** `/1234/admin/login`

| Route | Page | Description |
|---|---|---|
| `/admin` | Dashboard | Live stats: bookings, revenue, patients, hospitals |
| `/admin/treatments` | Treatments | Add / Edit / Delete treatments |
| `/admin/hospitals` | Hospitals | Add / Edit / Delete hospitals |
| `/admin/doctors` | Doctors | Add / Edit / Delete doctors |
| `/admin/packages` | Packages | Add / Edit / Delete packages |
| `/admin/bookings` | Bookings | View all bookings, update status, add admin notes |
| `/admin/patients` | Patients | Browse all registered patients, view booking history |
| `/admin/inquiries` | Inquiries | Reply to patient support tickets, change status |
| `/admin/settings` | Settings | Platform config: General, Security, Notifications, Locale |

---

## 🔑 Authentication & Roles

- **Patient**: Regular signup via `/signup` — gets `role = 'patient'` profile created via DB trigger
- **Admin**: Set `role = 'admin'` directly in Supabase `profiles` table for a user
- **Auth Context**: `AuthContext.tsx` provides `user`, `profile`, `isLoading`, `signOut` globally
- **Auto-healing**: If a user exists in Auth but not in `profiles`, the context auto-creates the missing profile

### Making a User an Admin
```sql
-- Run in Supabase SQL Editor
UPDATE public.profiles SET role = 'admin' WHERE email = 'youremail@example.com';
```

---

## 🛡️ Row Level Security (RLS)

All tables have RLS enabled with a `is_admin()` SECURITY DEFINER function to prevent infinite recursion.

| Table | Patient Access | Admin Access |
|---|---|---|
| `profiles` | Own record only | All records |
| `bookings` | Own bookings | All bookings (full CRUD) |
| `hospitals` | Read-only | Full CRUD |
| `treatments` | Read-only | Full CRUD |
| `doctors` | Read-only | Full CRUD |
| `packages` | Read-only (available only) | Full CRUD |
| `payments` | Own payments | All payments |
| `messages` | Own messages | All messages |
| `documents` | Own documents | All documents |
| `reviews` | Own + published | Full CRUD |
| `support_tickets` | Own tickets | Full CRUD |
| `blog_posts` | Published only | Full CRUD |

---

## 💳 Payment Flow

The payment system is a **demo sandbox** — no real money is charged.

1. Patient enters a test card number (any 16-digit number)
2. `BookStep6.tsx` simulates payment processing with a 2-second delay
3. On success, a record is inserted into the `payments` table
4. Booking status is updated to `confirmed`
5. Patient is redirected to the confirmation page

**To integrate real payments:** Replace the simulation logic in `BookStep6.tsx` with Razorpay or Stripe SDK.

---

## 📡 Real-Time Features

MediTrip uses **Supabase Realtime** for live updates:

- **Concierge Chat** (`MessagesPage.tsx`) — Messages appear instantly without refresh
- Admins can reply from `AdminInquiriesPage.tsx`

---

## 🗄️ Database Schema

Key tables in the `public` schema:

```
profiles           — User profiles (linked to auth.users)
hospitals          — Partner hospitals
doctors            — Specialist doctors
treatments         — Medical procedures
packages           — All-inclusive bundles
bookings           — Patient bookings
payments           — Payment records
messages           — Concierge chat messages
documents          — Uploaded medical files
reviews            — Patient ratings and feedback
support_tickets    — Customer support inquiries
blog_posts         — Medical articles
```

---

## 🎨 Design System

Global CSS classes defined in `index.css`:

| Class | Usage |
|---|---|
| `.btn-primary` | Blue gradient CTA button |
| `.btn-secondary` | White outlined button |
| `.premium-card` | White rounded card with shadow |
| `.card` | Lighter card variant |
| `.input` | Styled form input |
| `.label` | Form field label |
| `.badge-blue` | Blue status badge |
| `.badge-green` | Green status badge |
| `.badge-amber` | Amber status badge |
| `.section-tag` | Small uppercase category label |

---

## 🔧 Environment & Deployment

### Development
```bash
npm run dev        # Start Vite dev server (localhost:5173)
```

### Production Build
```bash
npm run build      # Outputs to dist/
npm run preview    # Preview production build locally
```

### Deploy to Vercel / Netlify
1. Connect your GitHub repo
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add env vars: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

---

## 📋 Known Limitations / Future Improvements

- [ ] Razorpay / Stripe real payment integration
- [x] Email notifications via Supabase Edge Functions + Resend
- [x] Admin analytics charts (revenue trends, booking heatmap)
- [x] Multi-language support (Arabic, Hindi)
- [x] Blog detail page (`/blog/:slug`) with rich content
- [ ] PWA / offline support
- [x] SEO structured data (JSON-LD for doctors and hospitals)
- [x] "Why India" cost comparison page

---

## 📖 Detailed Pages Guide

### 🌐 Public Pages
*   **Home (`/`)**: Landing page showcasing value proposition, search functionality, statistics, and top specialties. (Supports i18n).
*   **Treatments (`/treatments`)**: Browse medical specialties.
*   **Treatment Details (`/treatments/:slug`)**: Specific details on a procedure including overview, recovery time, and associated costs.
*   **Hospitals (`/hospitals`)**: Directory of JCI-accredited partner hospitals with filtering.
*   **Hospital Profile (`/hospitals/:id`)**: Details on a specific facility, including its doctors, accreditations, and SEO JSON-LD.
*   **Doctors (`/doctors`)**: Directory of specialized surgeons.
*   **Doctor Profile (`/doctors/:id`)**: Deep-dive into a surgeon's background, success rates, and linked hospital, complete with SEO structured data.
*   **Packages (`/packages`)**: All-inclusive medical tourism packages combining treatment, travel, and accommodation.
*   **Why India (`/why-india`)**: A detailed cost comparison matrix showcasing savings for international patients.
*   **Blog (`/blog`) & Blog Post (`/blog/:slug`)**: Health journal featuring insights, patient stories, and dynamic content fetched directly from Supabase.
*   **Contact & About (`/contact`, `/about`)**: Information on MediTrip and contact forms for patient inquiries.

### 🛡️ Patient Portal (Dashboard)
*   **Dashboard Home (`/dashboard`)**: Overview of active treatments and quick actions.
*   **Bookings (`/dashboard/bookings`)**: Real-time status tracking of medical journeys.
*   **Messages (`/dashboard/messages`)**: Live chat with assigned concierge using Supabase Realtime.
*   **Documents (`/dashboard/documents`)**: Secure upload and storage of medical records.

### 👑 Admin Panel
*   **Dashboard Home (`/admin`)**: Real-time charts for revenue and bookings using Recharts.
*   **Content Management**: Full CRUD interfaces for Treatments (`/admin/treatments`), Hospitals (`/admin/hospitals`), Doctors (`/admin/doctors`), and Packages (`/admin/packages`).
*   **Patient Management (`/admin/patients`, `/admin/bookings`)**: Manage user accounts and update booking statuses.
*   **Support & Chat (`/admin/inquiries`, `/admin/messages`)**: Handle incoming contact forms and reply to live patient chats.

---

## 👨‍💻 Development Notes

- The booking wizard state is managed by **Zustand** (`bookingStore.ts`) — each step (`step1`, `step2`, etc.) is stored separately to avoid stale data bugs
- Admin RLS uses a `SECURITY DEFINER` function `is_admin()` to avoid infinite recursion when checking `profiles.role`
- The `AuthContext` auto-creates a `profiles` row if missing (handles race conditions with the DB trigger)

---

*Built with ❤️ using React, TypeScript, and Supabase*
