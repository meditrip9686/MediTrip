import { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  content: string;
  is_urgent: boolean;
  created_at: string;
  sender?: { full_name: string | null };
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [sending, setSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch messages on mount
  useEffect(() => {
    if (!user) return;
    fetchMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('messages-patient')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        const newMsg = payload.new as Message;
        if (newMsg.sender_id === user.id || newMsg.receiver_id === user.id) {
          setMessages((prev) => {
            // Avoid duplicate messages if the fetch and subscription overlap
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchMessages() {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(full_name)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase error fetching messages:', error);
        return;
      }
      
      setMessages(data || []);
    } catch (e) { 
      console.error('Unexpected error fetching messages:', e); 
    } finally { 
      setIsLoading(false); 
    }
  }

  const send = async () => {
    if (!input.trim() || !user) return;
    setSending(true);
    try {
      await supabase.from('messages').insert({
        sender_id: user.id,
        content: input.trim(),
        is_urgent: isUrgent,
      });
      setInput('');
      setIsUrgent(false);
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black text-dark">Concierge Chat</h1>
          <p className="text-slate-500 text-sm mt-0.5">Direct line to your MediTrip care team</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-emerald-600">Concierge Online</span>
        </div>
      </div>

      <div className="premium-card flex-1 flex flex-col overflow-hidden !p-0">
        {/* Chat Header */}
        <div className="flex items-center gap-4 p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="font-bold text-dark">MediTrip Concierge</p>
            <p className="text-xs text-slate-500">Typically replies within 2 hours · Available 24/7</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center py-16">
              <div>
                <div className="w-16 h-16 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-primary-400" />
                </div>
                <p className="font-bold text-dark mb-1">Start a conversation</p>
                <p className="text-slate-500 text-sm max-w-xs">
                  Ask us anything about your treatment, travel, visa, or booking process.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={`flex items-end gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMine && (
                    <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 text-primary-600 font-black text-xs">
                      M
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
                    } ${msg.is_urgent && isMine ? 'ring-2 ring-red-400' : ''}`}>
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
          {isUrgent && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-700 font-medium">This message will be flagged as urgent and immediately alert the admin.</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUrgent(!isUrgent)}
              title="Mark as urgent"
              className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
                isUrgent ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-5 h-5" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask your concierge anything…"
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
      </div>
    </div>
  );
}
