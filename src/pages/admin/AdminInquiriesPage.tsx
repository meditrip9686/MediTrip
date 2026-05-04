import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Loader2, Search, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Inquiry {
  id: string;
  patient_id: string;
  booking_id: string | null;
  issue: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
  profiles?: { full_name: string | null; email: string | null; country: string | null };
}

const STATUS_OPTIONS = ['All', 'open', 'in_progress', 'resolved'];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  open:        { label: 'Open',        color: 'bg-amber-100 text-amber-700',   icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-primary-700',  icon: AlertCircle },
  resolved:    { label: 'Resolved',    color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  async function fetchInquiries() {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('support_tickets')
        .select('*, profiles(full_name, email, country)')
        .order('created_at', { ascending: false });
      setInquiries(data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }

  useEffect(() => { fetchInquiries(); }, []);

  const filtered = inquiries.filter(i => {
    const matchStatus = statusFilter === 'All' || i.status === statusFilter;
    const matchSearch = i.issue?.toLowerCase().includes(search.toLowerCase()) ||
      i.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      i.profiles?.email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    setSaving(id);
    await supabase.from('support_tickets').update({ status: newStatus }).eq('id', id);
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
    setSaving(null);
  };

  const handleReply = async (id: string) => {
    const reply = replyText[id];
    if (!reply?.trim()) return;
    setSaving(id);
    await supabase.from('support_tickets').update({ admin_reply: reply, status: 'resolved' }).eq('id', id);
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, admin_reply: reply, status: 'resolved' } : i));
    setReplyText(prev => ({ ...prev, [id]: '' }));
    setSaving(null);
  };

  const stats = {
    total: inquiries.length,
    open: inquiries.filter(i => i.status === 'open').length,
    inProgress: inquiries.filter(i => i.status === 'in_progress').length,
    resolved: inquiries.filter(i => i.status === 'resolved').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-dark">Inquiry Management</h1>
          <p className="text-slate-500 mt-1">Review and respond to patient support tickets.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Inquiries', value: stats.total, color: 'bg-slate-100 text-slate-700' },
          { label: 'Open', value: stats.open, color: 'bg-amber-100 text-amber-700' },
          { label: 'In Progress', value: stats.inProgress, color: 'bg-blue-100 text-primary-700' },
          { label: 'Resolved', value: stats.resolved, color: 'bg-emerald-100 text-emerald-700' },
        ].map(s => (
          <div key={s.label} className="card p-6">
            <p className="text-3xl font-black text-dark">{s.value}</p>
            <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-bold ${s.color}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name, email, or issue..."
            className="input pl-10 w-full"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                statusFilter === s ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <MessageSquare className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-500">No Inquiries Found</h3>
          <p className="text-slate-400 text-sm mt-2">Adjust your filters or wait for new patient submissions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(inquiry => {
            const cfg = statusConfig[inquiry.status] || statusConfig['open'];
            const StatusIcon = cfg.icon;
            const isOpen = expanded === inquiry.id;

            return (
              <div key={inquiry.id} className="card overflow-hidden">
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : inquiry.id)}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary-700 font-black text-sm">
                      {inquiry.profiles?.full_name?.[0] ?? '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-dark text-sm">{inquiry.profiles?.full_name ?? 'Unknown Patient'}</p>
                      <p className="text-xs text-slate-400">{inquiry.profiles?.email} • {inquiry.profiles?.country}</p>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">{inquiry.issue}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                    <p className="text-xs text-slate-400 whitespace-nowrap">{new Date(inquiry.created_at).toLocaleDateString()}</p>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-6">
                    {/* Full Issue */}
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Patient Issue</p>
                      <p className="text-sm text-dark leading-relaxed">{inquiry.issue}</p>
                    </div>

                    {/* Previous Reply */}
                    {inquiry.admin_reply && (
                      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Your Reply</p>
                        <p className="text-sm text-dark leading-relaxed">{inquiry.admin_reply}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Status Change */}
                      <div className="flex gap-2 flex-wrap">
                        {['open', 'in_progress', 'resolved'].map(s => (
                          <button
                            key={s}
                            disabled={inquiry.status === s || saving === inquiry.id}
                            onClick={() => handleStatusChange(inquiry.id, s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                              inquiry.status === s ? 'bg-primary-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                          >
                            {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>

                      {/* Reply Box */}
                      <div className="flex-1 flex gap-2">
                        <input
                          value={replyText[inquiry.id] || ''}
                          onChange={e => setReplyText(prev => ({ ...prev, [inquiry.id]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleReply(inquiry.id)}
                          placeholder="Type a reply to the patient..."
                          className="input flex-1 !py-2 text-sm"
                        />
                        <button
                          onClick={() => handleReply(inquiry.id)}
                          disabled={!replyText[inquiry.id]?.trim() || saving === inquiry.id}
                          className="btn-primary !p-2.5 rounded-xl disabled:opacity-50"
                        >
                          {saving === inquiry.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
