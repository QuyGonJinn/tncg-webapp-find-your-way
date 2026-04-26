import { useState, useEffect, useRef } from 'react';
import { fetchAllMessages, sendAdminReply, createWebSocket, clearAllMessages } from '../../api';

export default function AdminChat({ teams }) {
  const [messages, setMessages] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    fetchAllMessages().then(setMessages).catch(() => {});

    wsRef.current = createWebSocket(({ type, payload }) => {
      if (type === 'NEW_MESSAGE') {
        setMessages(prev => [...prev, payload]);
      }
      if (type === 'CHAT_CLEARED') {
        setMessages([]);
      }
      if (type === 'TEAM_JOINED') {
        // new team available, no action needed
      }
    });
    return () => wsRef.current?.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedTeamId]);

  const filtered = selectedTeamId === 'all'
    ? messages
    : messages.filter(m => m.team_id === selectedTeamId);

  // Unread count per team (messages from teams, not admin)
  const unreadByTeam = {};
  messages.forEach(m => {
    if (!m.from_admin) unreadByTeam[m.team_id] = (unreadByTeam[m.team_id] || 0) + 1;
  });

  async function handleReply(e) {
    e.preventDefault();
    if (!replyText.trim() || sending || selectedTeamId === 'all') return;
    setSending(true);
    await sendAdminReply(selectedTeamId, replyText.trim());
    setReplyText('');
    setSending(false);
  }

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-3 flex items-center justify-between">
        <h2 className="text-white font-black text-lg">💬 Team-Chat</h2>
        <button
          onClick={async () => {
            if (confirm('Alle Nachrichten wirklich löschen?')) {
              await clearAllMessages();
              setMessages([]);
            }
          }}
          className="text-xs text-red-200 border border-red-300 px-3 py-1.5 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition-colors"
        >
          🗑 Alle löschen
        </button>
      </div>

      <div className="flex" style={{ height: '480px' }}>
        {/* Sidebar – Team list */}
        <div className="w-1/3 border-r border-blue-100 flex flex-col overflow-y-auto">
          <button
            onClick={() => setSelectedTeamId('all')}
            className={`px-3 py-3 text-left text-sm font-semibold border-b border-blue-50 ${
              selectedTeamId === 'all' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-gray-50'
            }`}
          >
            🌊 Alle Nachrichten
            {messages.filter(m => !m.from_admin).length > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1.5">
                {messages.filter(m => !m.from_admin).length}
              </span>
            )}
          </button>
          {teams.map(team => (
            <button
              key={team.id}
              onClick={() => setSelectedTeamId(team.id)}
              className={`px-3 py-3 text-left border-b border-blue-50 ${
                selectedTeamId === team.id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{team.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${selectedTeamId === team.id ? 'text-blue-700' : 'text-slate-700'}`}>
                    {team.name}
                  </p>
                </div>
                {unreadByTeam[team.id] && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 shrink-0">
                    {unreadByTeam[team.id]}
                  </span>
                )}
              </div>
            </button>
          ))}
          {teams.length === 0 && (
            <p className="text-xs text-gray-400 text-center p-4">Keine Teams</p>
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-8">Keine Nachrichten.</p>
            )}
            {filtered.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.from_admin ? 'items-end' : 'items-start'}`}>
                {selectedTeamId === 'all' && !msg.from_admin && (
                  <p className="text-xs text-blue-500 font-bold mb-0.5 px-1">
                    {msg.team_icon} {msg.team_name}
                  </p>
                )}
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 shadow-sm text-sm ${
                  msg.from_admin
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-blue-100 text-blue-900 rounded-tl-sm'
                }`}>
                  <p className="leading-snug">{msg.text}</p>
                  <p className={`text-xs mt-0.5 ${msg.from_admin ? 'text-blue-200' : 'text-blue-400'}`}>
                    {formatTime(msg.sent_at)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Reply input */}
          {selectedTeamId !== 'all' ? (
            <form onSubmit={handleReply} className="px-3 pb-3 pt-2 border-t border-blue-100 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={`Antwort an ${selectedTeam?.name ?? ''}...`}
                maxLength={200}
                className="flex-1 border-2 border-blue-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!replyText.trim() || sending}
                className="bg-blue-600 disabled:bg-blue-200 text-white font-bold px-4 py-2 rounded-2xl active:scale-95 transition-transform text-sm"
              >
                ➤
              </button>
            </form>
          ) : (
            <p className="text-center text-xs text-gray-400 py-3 border-t border-blue-100">
              Team auswählen um zu antworten
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
