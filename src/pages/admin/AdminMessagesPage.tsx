import { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Loader2, MessageSquare, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  content: string;
  is_urgent: boolean;
  created_at: string;
}

interface PatientContact {
  id: string;
  full_name: string | null;
  email: string | null;
  last_message_at: string;
  unread: boolean;
}

export default function AdminMessagesPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<PatientContact[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch unique patients who have messaged
  useEffect(() => {
    fetchContacts();
    // Subscribe to new messages overall to update contacts list
    const channel = supabase
      .channel('admin-global-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchContacts();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Fetch messages for selected patient
  useEffect(() => {
    if (!selectedPatientId) return;
    fetchMessages(selectedPatientId);

    const channel = supabase
      .channel(`admin-messages-${selectedPatientId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        const newMsg = payload.new as Message;
        if (newMsg.sender_id === selectedPatientId || newMsg.receiver_id === selectedPatientId) {
          setMessages((prev) => [...prev, newMsg]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedPatientId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchContacts() {
    setIsLoading(true);
    try {
      // In a real app, this would be a specialized RPC call or view.
      // For now, we fetch all patients and check if they have messages, or just fetch all messages and group.
      const { data: allMessages } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, created_at')
        .order('created_at', { ascending: false });

      if (!allMessages) return;

      const patientIds = new Set<string>();
      const lastMessageMap = new Map<string, string>();

      allMessages.forEach(msg => {
        // Admin ID is user.id, so the other ID is the patient
        const patientId = msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;
        if (patientId && patientId !== user?.id) {
          if (!patientIds.has(patientId)) {
            patientIds.add(patientId);
            lastMessageMap.set(patientId, msg.created_at);
          }
        }
      });

      if (patientIds.size === 0) {
        setIsLoading(false);
        return;
      }

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', Array.from(patientIds));

      if (profiles) {
        const formattedContacts = profiles.map(p => ({
          id: p.id,
          full_name: p.full_name,
          email: p.email,
          last_message_at: lastMessageMap.get(p.id) || '',
          unread: false // Could be enhanced to track unread status
        })).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());

        setContacts(formattedContacts);
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }

  async function fetchMessages(patientId: string) {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${patientId},receiver_id.eq.${user?.id}),and(sender_id.eq.${user?.id},receiver_id.eq.${patientId}),sender_id.eq.${patientId},receiver_id.eq.${patientId}`)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    } catch (e) { console.error(e); }
  }

  const send = async () => {
    if (!input.trim() || !user || !selectedPatientId) return;
    setSending(true);
    try {
      await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: selectedPatientId,
        content: input.trim(),
        is_urgent: false, // Admins typically don't send 'urgent' flags, but could
      });
      setInput('');
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  const filteredContacts = contacts.filter(c => 
    c.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedContact = contacts.find(c => c.id === selectedPatientId);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-dark">Concierge Chat</h1>
          <p className="text-slate-500 mt-1">Real-time conversations with patients.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Sidebar - Contacts */}
        <div className="w-1/3 flex flex-col premium-card !p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search patients..." 
                className="input pl-10 w-full !py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No active conversations.</div>
            ) : (
              filteredContacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedPatientId(contact.id)}
                  className={`w-full p-4 flex items-start gap-3 border-b border-slate-50 transition-colors text-left ${
                    selectedPatientId === contact.id ? 'bg-primary-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-center flex-shrink-0 text-primary-700 font-black text-sm">
                    {contact.full_name?.[0] ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${selectedPatientId === contact.id ? 'font-black text-primary-700' : 'font-bold text-dark'}`}>
                      {contact.full_name || 'Unknown Patient'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{contact.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Area - Chat */}
        <div className="flex-1 premium-card !p-0 flex flex-col overflow-hidden">
          {!selectedPatientId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
              <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-3xl flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-slate-300" />
              </div>
              <p className="font-bold text-dark mb-1">Select a conversation</p>
              <p className="text-slate-500 text-sm">Choose a patient from the list to view your chat history and reply.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-4 p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-center text-primary-700 font-black">
                  {selectedContact?.full_name?.[0] ?? '?'}
                </div>
                <div>
                  <p className="font-bold text-dark">{selectedContact?.full_name}</p>
                  <p className="text-xs text-slate-500">{selectedContact?.email}</p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-white">
                {messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                    No messages yet.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} className={`flex items-end gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isMine && (
                          <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 text-slate-600 font-black text-xs">
                            P
                          </div>
                        )}
                        <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                          {msg.is_urgent && (
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Urgent
                            </span>
                          )}
                          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            isMine
                              ? 'bg-primary-600 text-white rounded-br-none'
                              : 'bg-slate-100 text-dark rounded-bl-none'
                          } ${msg.is_urgent && !isMine ? 'ring-2 ring-red-400' : ''}`}>
                            {msg.content}
                          </div>
                          <p className="text-[10px] text-slate-400 px-1">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-100 p-4 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                    placeholder={`Reply to ${selectedContact?.full_name?.split(' ')[0]}...`}
                    className="flex-1 input !py-3 text-sm"
                  />
                  <button
                    onClick={send}
                    disabled={!input.trim() || sending}
                    className="btn-primary !p-3 rounded-xl disabled:opacity-50 flex-shrink-0"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
