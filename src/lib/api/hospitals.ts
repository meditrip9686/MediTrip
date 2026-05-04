import { supabase } from '../supabase';
import type { Database } from '../../types/supabase';

type Hospital = Database['public']['Tables']['hospitals']['Row'];
type Doctor = Database['public']['Tables']['doctors']['Row'];

export async function getHospitals(): Promise<Hospital[]> {
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .order('rating', { ascending: false });
    
  if (error) {
    console.error('Error fetching hospitals:', error);
    throw error;
  }
  
  return data || [];
}

export async function getHospitalById(id: string): Promise<{ hospital: Hospital | null, doctors: Doctor[] }> {
  const { data: hospital, error: hospitalError } = await supabase
    .from('hospitals')
    .select('*')
    .eq('id', id)
    .single();
    
  if (hospitalError) {
    console.error(`Error fetching hospital ${id}:`, hospitalError);
    return { hospital: null, doctors: [] };
  }
  
  const { data: doctors, error: doctorsError } = await supabase
    .from('doctors')
    .select('*')
    .eq('hospital_id', id);
    
  if (doctorsError) {
    console.error(`Error fetching doctors for hospital ${id}:`, doctorsError);
  }
  
  return { hospital, doctors: doctors || [] };
}
