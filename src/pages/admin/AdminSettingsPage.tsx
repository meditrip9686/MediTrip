import { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Palette, 
  Database, 
  Save, 
  CheckCircle2, 
  Lock, 
  Loader2 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SettingSection {
  id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
}

const sections: SettingSection[] = [
  { id: 'general',  icon: Settings, title: 'General',      desc: 'Platform name, logo, contact details',   color: 'from-slate-600 to-slate-800' },
  { id: 'security', icon: Shield,   title: 'Security',     desc: 'Auth policies, admin password reset',    color: 'from-rose-500 to-red-600' },
  { id: 'notifications', icon: Bell, title: 'Notifications', desc: 'Email alerts, booking notifications', color: 'from-amber-500 to-orange-600' },
  { id: 'locale',   icon: Globe,    title: 'Locale & Currency', desc: 'Default language, currency format', color: 'from-blue-500 to-primary-600' },
  { id: 'appearance', icon: Palette, title: 'Appearance',  desc: 'Theme colors, branding assets',          color: 'from-purple-500 to-pink-600' },
  { id: 'database', icon: Database, title: 'Data & Backup', desc: 'Export data, manage backups',           color: 'from-emerald-500 to-teal-600' },
];

export default function AdminSettingsPage() {
  const [active, setActive] = useState('general');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [general, setGeneral] = useState({
    platform_name: 'MediTrip',
    support_email: 'support@meditrip.com',
    support_phone: '+91 98765 43210',
    tagline: 'World-Class Medical Care, Simplified.'
  });
  const [notifications, setNotifications] = useState({
    booking_alerts: true,
    urgent_alerts: true,
    payment_confirmation: true
  });
  const [locale, setLocale] = useState({
    currency: 'INR',
    language: 'English',
    timezone: 'Asia/Kolkata'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data } = await (supabase as any).from('platform_settings').select('*');
      if (data) {
        data.forEach((s: any) => {
          if (s.key === 'general') setGeneral(s.value);
          if (s.key === 'notifications') setNotifications(s.value);
          if (s.key === 'locale') setLocale(s.value);
        });
      }
    } catch (e) {
      console.error('Error fetching settings:', e);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentKey = active;
      let currentValue = {};
      
      if (active === 'general') currentValue = general;
      if (active === 'notifications') currentValue = notifications;
      if (active === 'locale') currentValue = locale;

      if (['general', 'notifications', 'locale'].includes(active)) {
        await (supabase as any).from('platform_settings').upsert({
          key: currentKey,
          value: currentValue
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error('Error saving settings:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const activeSection = sections.find(s => s.id === active)!;
  const ActiveIcon = activeSection.icon;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-dark">Admin Settings</h1>
        <p className="text-slate-500 mt-1">Manage your platform configuration and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  active === s.id
                    ? 'bg-primary-50 border border-primary-200 text-primary-700'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">{s.title}</p>
                  <p className="text-xs text-slate-400 leading-tight">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Panel Header */}
          <div className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeSection.color} flex items-center justify-center shadow-lg`}>
              <ActiveIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-black text-dark text-lg">{activeSection.title}</h2>
              <p className="text-slate-500 text-sm">{activeSection.desc}</p>
            </div>
          </div>

          {/* Settings Content */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            </div>
          ) : (
            <>
              {active === 'general' && (
                <div className="card space-y-6">
                  <h3 className="font-bold text-dark border-b border-slate-100 pb-4">Platform Information</h3>
                  <div className="space-y-2">
                    <label className="label">Platform Name</label>
                    <input 
                      value={general.platform_name} 
                      onChange={e => setGeneral({ ...general, platform_name: e.target.value })} 
                      className="input" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Support Email</label>
                    <input 
                      value={general.support_email} 
                      onChange={e => setGeneral({ ...general, support_email: e.target.value })} 
                      className="input" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Support Phone</label>
                    <input 
                      value={general.support_phone} 
                      onChange={e => setGeneral({ ...general, support_phone: e.target.value })} 
                      className="input" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Platform Tagline</label>
                    <input 
                      value={general.tagline} 
                      onChange={e => setGeneral({ ...general, tagline: e.target.value })} 
                      className="input" 
                    />
                  </div>
                </div>
              )}

              {active === 'security' && (
                <div className="card space-y-6">
                  <h3 className="font-bold text-dark border-b border-slate-100 pb-4">Security Settings</h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                    <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">Admin access is protected by Supabase Row Level Security. Changes here apply at the application level only.</p>
                  </div>
                  {[
                    { label: 'Require 2FA for Admin Login', defaultChecked: false },
                    { label: 'Lock accounts after 5 failed attempts', defaultChecked: true },
                    { label: 'Session timeout after 2 hours of inactivity', defaultChecked: true },
                  ].map(setting => (
                    <label key={setting.label} className="flex items-center justify-between cursor-pointer p-4 bg-slate-50 rounded-2xl">
                      <span className="font-medium text-dark text-sm">{setting.label}</span>
                      <input type="checkbox" defaultChecked={setting.defaultChecked} className="w-5 h-5 rounded accent-primary-600" />
                    </label>
                  ))}
                </div>
              )}

              {active === 'notifications' && (
                <div className="card space-y-6">
                  <h3 className="font-bold text-dark border-b border-slate-100 pb-4">Notification Preferences</h3>
                  {[
                    { label: 'New Booking Alerts', desc: 'Get notified when a patient completes a booking', checked: notifications.booking_alerts, key: 'booking_alerts' },
                    { label: 'Urgent Inquiry Alerts', desc: 'Get notified for high-priority patient inquiries', checked: notifications.urgent_alerts, key: 'urgent_alerts' },
                    { label: 'Payment Confirmation', desc: 'Receive alerts for every successful payment', checked: notifications.payment_confirmation, key: 'payment_confirmation' },
                  ].map(item => (
                    <label key={item.label} className="flex items-start gap-4 cursor-pointer p-4 bg-slate-50 rounded-2xl">
                      <input 
                        type="checkbox" 
                        checked={item.checked} 
                        onChange={e => setNotifications({ ...notifications, [item.key as keyof typeof notifications]: e.target.checked })} 
                        className="w-5 h-5 mt-0.5 rounded accent-primary-600" 
                      />
                      <div>
                        <p className="font-bold text-dark text-sm">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {active === 'locale' && (
                <div className="card space-y-6">
                  <h3 className="font-bold text-dark border-b border-slate-100 pb-4">Locale & Currency</h3>
                  <div className="space-y-2">
                    <label className="label">Default Currency</label>
                    <select 
                      value={locale.currency} 
                      onChange={e => setLocale({ ...locale, currency: e.target.value })} 
                      className="input appearance-none"
                    >
                      <option value="INR">₹ Indian Rupee (INR)</option>
                      <option value="USD">$ US Dollar (USD)</option>
                      <option value="EUR">€ Euro (EUR)</option>
                      <option value="GBP">£ British Pound (GBP)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="label">Default Language</label>
                    <select 
                      value={locale.language} 
                      onChange={e => setLocale({ ...locale, language: e.target.value })} 
                      className="input appearance-none"
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Arabic</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="label">Timezone</label>
                    <select 
                      value={locale.timezone} 
                      onChange={e => setLocale({ ...locale, timezone: e.target.value })} 
                      className="input appearance-none"
                    >
                      <option>Asia/Kolkata (IST, UTC+5:30)</option>
                      <option>UTC</option>
                      <option>America/New_York</option>
                    </select>
                  </div>
                </div>
              )}

              {(active === 'appearance' || active === 'database') && (
                <div className="card text-center py-16">
                  <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${activeSection.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                    <ActiveIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-dark mb-2">{activeSection.title} Settings</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">This section is under development. Advanced {activeSection.title.toLowerCase()} configuration will be available soon.</p>
                </div>
              )}

              {/* Save Button */}
              {(active !== 'appearance' && active !== 'database') && (
                <div className="flex justify-end">
                  <button onClick={handleSave} disabled={isSaving} className="btn-primary gap-2">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />)}
                    {isSaving ? 'Saving...' : (saved ? 'Saved!' : 'Save Changes')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
