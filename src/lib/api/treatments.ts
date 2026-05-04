import { supabase } from '../supabase';
import type { Database } from '../../types/supabase';

type Treatment = Database['public']['Tables']['treatments']['Row'];

export async function getTreatments(): Promise<Treatment[]> {
  const { data, error } = await supabase
    .from('treatments')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching treatments:', error);
    throw error;
  }
  
  return data || [];
}

export async function getTreatmentBySlug(slug: string): Promise<Treatment | null> {
  const { data, error } = await supabase
    .from('treatments')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error) {
    console.error(`Error fetching treatment ${slug}:`, error);
    return null;
  }
  
  return data;
}
