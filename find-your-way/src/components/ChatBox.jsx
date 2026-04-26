import { useState, useEffect, useRef } from 'react';
import { fetchMessages, sendMessage, createWebSocket } from '../api';

export default function ChatBox({ team }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const wsRef = useRef(null);
  const sentMessageIdsRef = useRef(new Set());

  useEffect(() => {
    fetchMessages(team.id).then(setMessages).catch(() => {});

    wsRef.current = createWebSocket(({ type, payload }) => {
      if (type === 'NEW_MESSAGE' && payload.team_id === team.id) {
        // Only add if we haven't already added it optimistically
        if (!sentMessageIdsRef.current.has(payload.id)) {
          setMessages(prev => [...prev, payload]);
        }
        sentMessageIdsRef.current.delete(payload.id);
      }
      if (type === 'CHAT_CLEARED') {
        setMessages([]);
        sentMessageIdsRef.current.clear();
      }
    });
    return () => wsRef.current?.close();
  }, [team.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    const msgText = text.trim();
    setText(''); // Clear immediately for better UX
    setSending(true);
    try {
      const newMsg = await sendMessage(team.id, msgText);
      // Add message immediately to UI (optimistic update)
      setMessages(prev => [...prev, newMsg]);
      // Mark this message ID so WebSocket handler doesn't add it again
      sentMessageIdsRef.current.add(newMsg.id);
    } catch (err) {
      console.error('Senden fehlgeschlagen', err);
      setText(msgText); // Restore on error
    } finally {
      setSending(false);
    }
  }

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {messages.length === 0 && (
          <p className="text-center text-blue-300 text-sm mt-8">Noch keine Nachrichten. Schreibt dem Admin!</p>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from_admin ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
              msg.from_admin
                ? 'bg-blue-100 text-blue-900 rounded-tl-sm'
                : 'bg-blue-600 text-white rounded-tr-sm'
            }`}>
              {msg.from_admin && (
                <p className="text-xs font-bold text-blue-500 mb-0.5">🛠️ Admin</p>
              )}
              <p className="text-sm leading-snug">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.from_admin ? 'text-blue-400' : 'text-blue-200'}`}>
                {formatTime(msg.sent_at)}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 pb-4 pt-2 border-t border-blue-100 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Nachricht schreiben..."
          maxLength={200}
          className="flex-1 border-2 border-blue-200 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="bg-blue-600 disabled:bg-blue-200 text-white font-bold px-4 py-2 rounded-2xl active:scale-95 transition-transform"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
