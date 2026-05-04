import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBookingStore } from '../../store/bookingStore';
import { ArrowLeft, ArrowRight, User, Globe, Shield, Phone, FileText, Upload } from 'lucide-react';

const schema = z.object({
  fullName: z.string().min(2, 'Required'),
  dob: z.string().min(1, 'Required'),
  gender: z.string().min(1, 'Required'),
  nationality: z.string().min(1, 'Required'),
  passportNo: z.string().min(4, 'Required'),
  passportExpiry: z.string().min(1, 'Required'),
  medicalSummary: z.string().min(10, 'Please describe your condition (min 10 characters)'),
  emergencyName: z.string().min(2, 'Required'),
  emergencyPhone: z.string().min(5, 'Required'),
  languagePref: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function BookStep4() {
  const navigate = useNavigate();
  const { setStep4, setStep } = useBookingStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { languagePref: 'en' },
  });

  const onSubmit = (data: FormData) => {
    setStep4({ ...data, documentUrls: [] });
    setStep(5);
    navigate('/book/step-5');
  };

  const field = (name: keyof FormData, label: string, type = 'text', placeholder = '', icon?: any) => (
    <div className="space-y-2">
      <label className="label !mb-0">{label} *</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input {...register(name)} type={type} placeholder={placeholder} className={`input ${icon ? '!pl-12' : ''}`} />
      </div>
      {errors[name] && <p className="text-danger text-xs mt-1 font-bold">{errors[name]?.message as string}</p>}
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-dark mb-4">Patient Information</h1>
        <p className="text-slate-500 text-lg">Your data is secured with end-to-end medical grade encryption.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Personal Details */}
        <div className="premium-card">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-dark">Identity & Passport</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {field('fullName', 'Full Name (as on passport)', 'text', 'e.g. John Doe', <User className="w-4 h-4" />)}
            {field('dob', 'Date of Birth', 'date')}
            <div>
              <label className="label">Gender *</label>
              <select {...register('gender')} className="input !bg-slate-50 border-none">
                <option value="">Select gender...</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
              {errors.gender && <p className="text-danger text-xs mt-1 font-bold">{errors.gender.message}</p>}
            </div>
            {field('nationality', 'Nationality', 'text', 'e.g. Nigerian', <Globe className="w-4 h-4" />)}
            {field('passportNo', 'Passport Number', 'text', 'e.g. A1234567', <Shield className="w-4 h-4" />)}
            {field('passportExpiry', 'Passport Expiry', 'date')}
          </div>
        </div>

        {/* Medical History */}
        <div className="premium-card">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center text-danger">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-dark">Medical Condition</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="label">Medical Summary *</label>
              <textarea 
                {...register('medicalSummary')} 
                rows={4} 
                placeholder="Briefly describe your symptoms, current medications, and any past surgeries..." 
                className="input !bg-slate-50 border-none resize-none !py-4" 
              />
              {errors.medicalSummary && <p className="text-danger text-xs mt-1 font-bold">{errors.medicalSummary.message}</p>}
            </div>

            <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 hover:bg-white hover:border-primary-300 transition-all text-center group cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-500 mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-dark font-bold mb-1">Upload Medical Reports</p>
              <p className="text-slate-400 text-xs">PDF, JPG or PNG (Max 10MB)</p>
              <input type="file" multiple className="hidden" />
            </div>
          </div>
        </div>

        {/* Emergency & Preferences */}
        <div className="premium-card">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-dark">Emergency & Communication</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {field('emergencyName', 'Emergency Contact Name', 'text', 'Full name', <User className="w-4 h-4" />)}
            {field('emergencyPhone', 'Emergency Contact Phone', 'tel', '+1...', <Phone className="w-4 h-4" />)}
          </div>

          <div>
            <label className="label">Preferred Language for Assistance</label>
            <div className="grid grid-cols-3 gap-3">
              {['English', 'Bengali', 'Hindi'].map(lang => (
                <label key={lang} className="relative cursor-pointer group">
                   <input type="radio" {...register('languagePref')} value={lang.toLowerCase().substring(0, 2)} className="peer sr-only" />
                   <div className="p-4 border border-slate-100 rounded-2xl text-center font-bold text-slate-500 peer-checked:bg-primary-600 peer-checked:text-white peer-checked:border-primary-600 transition-all hover:bg-slate-50">
                      {lang}
                   </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="pt-10 flex items-center justify-between border-t border-slate-100">
          <button 
            type="button"
            onClick={() => { setStep(3); navigate('/book/step-3'); }} 
            className="btn-secondary !px-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Previous Step
          </button>
          <button 
            type="submit"
            className="btn-primary !px-12 !py-5 shadow-2xl shadow-primary-500/30"
          >
            Review & Confirm <ArrowRight className="w-6 h-6 ml-3" />
          </button>
        </div>
      </form>
    </div>
  );
}
