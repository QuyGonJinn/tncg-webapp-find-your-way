import { useState, useEffect, useRef } from 'react';
import { fetchMessages, sendMessage, createWebSocket, markMessagesAsRead } from '../api';

export default function ChatBox({ team }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const wsRef = useRef(null);
  const sentMessageIdsRef = useRef(new Set());
  const pollIntervalRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const markedAsReadRef = useRef(new Set());

  useEffect(() => {
    loadMessages();
  }, [team.id]);

  useEffect(() => {
    wsRef.current = createWebSocket(({ type, payload }) => {
      if (type === 'NEW_MESSAGE' && payload.team_id === team.id) {
        if (!sentMessageIdsRef.current.has(payload.id)) {
          setMessages(prev => [...prev, payload]);
          lastMessageIdRef.current = payload.id;
        }
        sentMessageIdsRef.current.delete(payload.id);
      }
      if (type === 'CHAT_CLEARED') {
        setMessages([]);
        sentMessageIdsRef.current.clear();
        markedAsReadRef.current.clear();
        lastMessageIdRef.current = null;
      }
    });

    pollIntervalRef.current = setInterval(() => {
      loadMessages();
    }, 2000);

    return () => {
      wsRef.current?.close();
      clearInterval(pollIntervalRef.current);
    };
  }, [team.id]);

  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }, [messages]);

  useEffect(() => {
    const unreadIds = messages
      .filter(m => !m.read_at && !markedAsReadRef.current.has(m.id))
      .map(m => m.id);

    if (unreadIds.length > 0) {
      markMessagesAsRead(team.id, unreadIds).catch(() => {});
      unreadIds.forEach(id => markedAsReadRef.current.add(id));
    }
  }, [messages, team.id]);

  async function loadMessages() {
    try {
      const msgs = await fetchMessages(team.id);
      setMessages(msgs);
      if (msgs.length > 0) lastMessageIdRef.current = msgs[msgs.length - 1].id;
    } catch {}
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    const msgText = text.trim();
    setText('');
    setSending(true);
    try {
      const newMsg = await sendMessage(team.id, msgText);
      setMessages(prev => [...prev, newMsg]);
      sentMessageIdsRef.current.add(newMsg.id);
      lastMessageIdRef.current = newMsg.id;
    } catch {
      setText(msgText);
    } finally {
      setSending(false);
    }
  }

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="flex flex-col h-full bg-amber-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {messages.length === 0 && (
          <p className="text-center text-amber-400 text-sm mt-8">Noch keine Nachrichten. Schreibt dem Admin!</p>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from_admin ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
              msg.from_admin
                ? `${msg.read_at ? 'bg-amber-100 text-stone-700' : 'bg-amber-200 text-stone-900'} rounded-tl-sm border border-amber-300`
                : 'bg-amber-700 text-amber-50 rounded-tr-sm'
            }`}>
              {msg.from_admin && (
                <p className="text-xs font-bold text-amber-700 mb-0.5">🛠️ Admin</p>
              )}
              <p className="text-sm leading-snug break-words">{msg.text}</p>
              <div className={`text-xs mt-1 flex items-center gap-1 ${msg.from_admin ? 'text-amber-500' : 'text-amber-300'}`}>
                <span>{formatTime(msg.sent_at)}</span>
                {!msg.from_admin && (
                  <span className="ml-1 font-bold">
                    {msg.read_at ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 pb-4 pt-2 border-t border-amber-200 flex gap-2 bg-amber-50">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Nachricht schreiben..."
          maxLength={200}
          className="flex-1 border-2 border-amber-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:border-amber-600 bg-white"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="bg-amber-700 disabled:bg-amber-200 text-white font-bold px-4 py-2 rounded-2xl active:scale-95 transition-transform"
        >
          {sending ? '⏳' : '➤'}
        </button>
      </form>
    </div>
  );
}
