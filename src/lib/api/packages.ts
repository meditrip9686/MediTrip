import { supabase } from '../supabase';

export async function getPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      hospital:hospitals(*),
      treatment:treatments(*)
    `)
    .order('price_inr');

  if (error) throw error;
  return data;
}

export async function getPackageById(id: string) {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      hospital:hospitals(*),
      treatment:treatments(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getPackagesByHospital(hospitalId: string) {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      hospital:hospitals(*),
      treatment:treatments(*)
    `)
    .eq('hospital_id', hospitalId);

  if (error) throw error;
  return data;
}

export async function getPackagesByTreatment(treatmentId: string) {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      hospital:hospitals(*),
      treatment:treatments(*)
    `)
    .eq('treatment_id', treatmentId);

  if (error) throw error;
  return data;
}
