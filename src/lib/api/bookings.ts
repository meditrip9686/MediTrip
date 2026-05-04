import { supabase } from '../supabase';
import type { Database } from '../../types/supabase';

type Booking = Database['public']['Tables']['bookings']['Row'];
type Treatment = Database['public']['Tables']['treatments']['Row'];
type Hospital = Database['public']['Tables']['hospitals']['Row'];

export type BookingWithDetails = Booking & {
  treatment: Treatment | null;
  hospital: Hospital | null;
};

export async function getPatientBookings(patientId: string): Promise<BookingWithDetails[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, treatment:treatments(*), hospital:hospitals(*)')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching patient bookings:', error);
    throw error;
  }
  
  return data as any || [];
}
