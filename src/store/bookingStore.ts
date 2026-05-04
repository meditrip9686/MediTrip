import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookingStep1 {
  treatmentId: string;
  treatmentName: string;
  travelMonth: string;
  travelFlexible: boolean;
  countryFrom: string;
  companions: number;
}

export interface BookingStep2 {
  hospitalId: string;
  hospitalName: string;
  doctorId: string;
  doctorName: string;
}

export interface BookingStep3 {
  packageId: string;
  packageName: string;
  hotelIncluded: boolean;
  hotelTier: number;
  transfer: boolean;
  translator: boolean;
  visaAssistance: boolean;
  baseCost: number;
  totalCost: number;
}

export interface BookingStep4 {
  fullName: string;
  dob: string;
  gender: string;
  nationality: string;
  passportNo: string;
  passportExpiry: string;
  medicalSummary: string;
  emergencyName: string;
  emergencyPhone: string;
  languagePref: string;
  documentUrls: string[];
}

interface BookingState {
  currentStep: number;
  step1: Partial<BookingStep1>;
  step2: Partial<BookingStep2>;
  step3: Partial<BookingStep3>;
  step4: Partial<BookingStep4>;
  bookingId: string | null;
  setStep: (step: number) => void;
  setStep1: (data: Partial<BookingStep1>) => void;
  setStep2: (data: Partial<BookingStep2>) => void;
  setStep3: (data: Partial<BookingStep3>) => void;
  setStep4: (data: Partial<BookingStep4>) => void;
  setBookingId: (id: string) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      step1: {},
      step2: {},
      step3: {},
      step4: {},
      bookingId: null,
      setStep: (currentStep) => set({ currentStep }),
      setStep1: (data) => set((s) => ({ step1: { ...s.step1, ...data } })),
      setStep2: (data) => set((s) => ({ step2: { ...s.step2, ...data } })),
      setStep3: (data) => set((s) => ({ step3: { ...s.step3, ...data } })),
      setStep4: (data) => set((s) => ({ step4: { ...s.step4, ...data } })),
      setBookingId: (bookingId) => set({ bookingId }),
      resetBooking: () => set({ currentStep: 1, step1: {}, step2: {}, step3: {}, step4: {}, bookingId: null }),
    }),
    { name: 'meditrip-booking' }
  )
);
