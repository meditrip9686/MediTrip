import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { CheckCircle2, Camera } from 'lucide-react';

const schema = z.object({
  full_name: z.string().min(2),
  phone: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  passport_no: z.string().optional(),
  passport_expiry: z.string().optional(),
  emergency_name: z.string().optional(),
  emergency_phone: z.string().optional(),
  language_pref: z.string().optional(),
  country: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { profile } = useAuth() as any;
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: profile?.full_name ?? '',
      phone: profile?.phone ?? '',
      dob: profile?.dob ?? '',
      gender: profile?.gender ?? '',
      nationality: profile?.nationality ?? '',
      passport_no: profile?.passport_no ?? '',
      passport_expiry: profile?.passport_expiry ?? '',
      emergency_name: profile?.emergency_name ?? '',
      emergency_phone: profile?.emergency_phone ?? '',
      language_pref: profile?.language_pref ?? 'en',
      country: profile?.country ?? '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!profile?.id) return;
    
    // Convert empty strings to null for date fields
    const payload = {
      ...data,
      dob: data.dob || null,
      passport_expiry: data.passport_expiry || null,
    };

    const { error } = await supabase.from('profiles').update(payload).eq('id', profile.id);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-dark mb-6">My Profile</h1>

      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-success text-sm mb-6">
          <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Avatar */}
        <div className="card flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 bg-primary-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary-700 text-3xl font-bold">{profile?.full_name?.[0]?.toUpperCase() ?? 'U'}</span>
              )}
            </div>
            <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-white border-2 border-white">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="font-bold text-dark">{profile?.full_name}</p>
            <p className="text-gray-500 text-sm">{profile?.email}</p>
            <span className="badge badge-blue capitalize mt-1">{profile?.role}</span>
          </div>
        </div>

        {/* Personal Info */}
        <div className="card">
          <h2 className="text-lg font-bold text-dark mb-5">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name *</label>
              <input {...register('full_name')} className="input" />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input {...register('phone')} placeholder="+1 234 567 8900" className="input" />
            </div>
            <div>
              <label className="label">Date of Birth</label>
              <input {...register('dob')} type="date" className="input" />
            </div>
            <div>
              <label className="label">Gender</label>
              <select {...register('gender')} className="input">
                <option value="">Select...</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="label">Nationality</label>
              <input {...register('nationality')} placeholder="Bangladeshi" className="input" />
            </div>
            <div>
              <label className="label">Language Preference</label>
              <select {...register('language_pref')} className="input">
                <option value="en">English</option>
                <option value="bn">Bengali</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
            <div>
              <label className="label">Country</label>
              <input {...register('country')} placeholder="e.g. Bangladesh" className="input" />
            </div>
          </div>
        </div>

        {/* Passport */}
        <div className="card">
          <h2 className="text-lg font-bold text-dark mb-5">Passport Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Passport Number</label>
              <input {...register('passport_no')} placeholder="A1234567" className="input" />
            </div>
            <div>
              <label className="label">Passport Expiry Date</label>
              <input {...register('passport_expiry')} type="date" className="input" />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="card">
          <h2 className="text-lg font-bold text-dark mb-5">Emergency Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Contact Name</label>
              <input {...register('emergency_name')} placeholder="Family member name" className="input" />
            </div>
            <div>
              <label className="label">Contact Phone</label>
              <input {...register('emergency_phone')} placeholder="+1 234 567 8900" className="input" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto sm:self-start">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
