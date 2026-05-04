-- MediTrip Initial Sample Data & Security Policies
-- Run this in the Supabase SQL Editor to populate your platform.

-- ==========================================
-- 1. CLEANUP & SETUP
-- ==========================================
TRUNCATE public.profiles, public.treatments, public.hospitals, public.doctors, public.packages, public.bookings, public.payments CASCADE;

-- ==========================================
-- 2. TREATMENTS
-- ==========================================
INSERT INTO public.treatments (name, slug, category, description, avg_cost_min, avg_cost_max, success_rate, recovery_days)
VALUES 
('Knee Replacement', 'knee-replacement', 'Orthopedic', 'Total knee arthroplasty using advanced robotic-assisted technology.', 350000, 550000, 98, 42),
('Cardiac Bypass (CABG)', 'cardiac-bypass', 'Cardiac', 'Traditional and minimally invasive coronary artery bypass surgery.', 450000, 750000, 96, 56),
('IVF Treatment', 'ivf-treatment', 'IVF', 'Comprehensive In-Vitro Fertilization including ICSI and PGD options.', 300000, 500000, 65, 14),
('Spine Surgery', 'spine-surgery', 'Neuro', 'Discectomy and spinal fusion using minimally invasive techniques.', 400000, 700000, 94, 84),
('Dental Implants', 'dental-implants', 'Dental', 'Full mouth rehabilitation with high-quality titanium or zirconia implants.', 150000, 300000, 99, 7);

-- ==========================================
-- 3. HOSPITALS
-- ==========================================
-- We removed partner_status to avoid constraint violations
INSERT INTO public.hospitals (name, description, address, city, state, rating, review_count, accreditations, specialties, images)
VALUES 
('Fortis Memorial Research Institute', 'Multi-super speciality hospital with world-class clinicians.', 'Sector 44, Gurgaon', 'Gurgaon', 'Haryana', 4.8, 1250, ARRAY['JCI', 'NABH'], ARRAY['Cardiology', 'Orthopedics', 'Oncology'], ARRAY['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800']),
('Apollo Hospitals', 'Indias largest healthcare provider with a legacy of excellence.', 'Greams Road, Chennai', 'Chennai', 'Tamil Nadu', 4.9, 2100, ARRAY['JCI', 'NABH', 'NABL'], ARRAY['Transplants', 'Cardiology', 'Neurology'], ARRAY['https://images.unsplash.com/photo-1586773860418-d319a39ec5cc?auto=format&fit=crop&q=80&w=800']),
('Max Super Speciality Hospital', 'Advanced technology meets compassionate care.', 'Saket, New Delhi', 'New Delhi', 'Delhi', 4.7, 980, ARRAY['NABH'], ARRAY['Orthopedics', 'Fertility', 'Urology'], ARRAY['https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=800']);

-- ==========================================
-- 4. DOCTORS (Linking to Hospital IDs)
-- ==========================================
DO $$
DECLARE
    fortis_id uuid;
    apollo_id uuid;
    max_id uuid;
BEGIN
    SELECT id INTO fortis_id FROM public.hospitals WHERE name = 'Fortis Memorial Research Institute' LIMIT 1;
    SELECT id INTO apollo_id FROM public.hospitals WHERE name = 'Apollo Hospitals' LIMIT 1;
    SELECT id INTO max_id FROM public.hospitals WHERE name = 'Max Super Speciality Hospital' LIMIT 1;

    INSERT INTO public.doctors (name, specialty, hospital_id, degree, experience_yrs, success_rate, photo_url, bio, is_verified)
    VALUES 
    ('Dr. Ashok Seth', 'Cardiology', apollo_id, 'MBBS, MD, FRCP', 35, 98, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200', 'World-renowned cardiologist with over 20,000 surgeries.', true),
    ('Dr. Vikram Shah', 'Orthopedics', fortis_id, 'MBBS, MS (Ortho)', 25, 99, 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200', 'Expert in robotic-assisted joint replacement.', true),
    ('Dr. Rita Bakshi', 'Fertility', max_id, 'MBBS, MD', 20, 70, 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200', 'Pioneer in IVF and assisted reproductive technologies.', true);
END $$;

-- ==========================================
-- 5. PACKAGES (Linking to Hospital & Treatment IDs)
-- ==========================================
DO $$
DECLARE
    knee_id uuid;
    cardiac_id uuid;
    fortis_id uuid;
    apollo_id uuid;
BEGIN
    SELECT id INTO knee_id FROM public.treatments WHERE name = 'Knee Replacement' LIMIT 1;
    SELECT id INTO cardiac_id FROM public.treatments WHERE name = 'Cardiac Bypass (CABG)' LIMIT 1;
    SELECT id INTO fortis_id FROM public.hospitals WHERE name = 'Fortis Memorial Research Institute' LIMIT 1;
    SELECT id INTO apollo_id FROM public.hospitals WHERE name = 'Apollo Hospitals' LIMIT 1;

    INSERT INTO public.packages (title, treatment_id, hospital_id, price_inr, duration_days, hotel_included, hotel_tier, transfer, translator, visa_assistance, is_available)
    VALUES 
    ('Standard Knee Package', knee_id, fortis_id, 350000, 10, true, 3, true, false, true, true),
    ('Premium Knee Package', knee_id, fortis_id, 480000, 14, true, 5, true, true, true, true),
    ('Elite Cardiac Care', cardiac_id, apollo_id, 750000, 21, true, 5, true, true, true, true);
END $$;

-- ==========================================
-- 6. RLS SECURITY POLICIES (Comprehensive)
-- ==========================================

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.profiles;
CREATE POLICY "Enable insert for all users" ON public.profiles FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- TREATMENTS (Public read)
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view treatments" ON public.treatments;
CREATE POLICY "Public can view treatments" ON public.treatments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage treatments" ON public.treatments;
CREATE POLICY "Admins can manage treatments" ON public.treatments FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- HOSPITALS (Public read)
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view hospitals" ON public.hospitals;
CREATE POLICY "Public can view hospitals" ON public.hospitals FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage hospitals" ON public.hospitals;
CREATE POLICY "Admins can manage hospitals" ON public.hospitals FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- DOCTORS (Public read)
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view doctors" ON public.doctors;
CREATE POLICY "Public can view doctors" ON public.doctors FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage doctors" ON public.doctors;
CREATE POLICY "Admins can manage doctors" ON public.doctors FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- PACKAGES (Public read)
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view packages" ON public.packages;
CREATE POLICY "Public can view packages" ON public.packages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage packages" ON public.packages;
CREATE POLICY "Admins can manage packages" ON public.packages FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- BOOKINGS (Patient/Admin access)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Patients can manage own bookings" ON public.bookings;
CREATE POLICY "Patients can manage own bookings" ON public.bookings FOR ALL USING (auth.uid() = patient_id);
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- PAYMENTS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert payments" ON public.payments;
CREATE POLICY "Anyone can insert payments" ON public.payments FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (EXISTS (SELECT 1 FROM bookings WHERE id = payments.booking_id AND patient_id = auth.uid()));
