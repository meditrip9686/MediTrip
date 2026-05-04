import { supabase } from '../supabase';

export async function getDoctors() {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getDoctorById(id: string) {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getDoctorsByHospital(hospitalId: string) {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('hospital_id', hospitalId)
    .order('name');

  if (error) throw error;
  return data;
}

export async function getDoctorsBySpecialty(specialty: string) {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('specialty', specialty)
    .order('name');

  if (error) throw error;
  return data;
}
