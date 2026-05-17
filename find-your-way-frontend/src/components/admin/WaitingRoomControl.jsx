import { useState, useEffect } from 'react';

export default function WaitingRoomControl({ onToggle }) {
  const [waitingRoomEnabled, setWaitingRoomEnabled] = useState(true);
  const [teamCount, setTeamCount] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Fetch current state
    const fetchState = async () => {
      try {
        const response = await fetch('/api/game/state');
        const state = await response.json();
        setWaitingRoomEnabled(state.waiting_room_enabled === 'true');
      } catch (error) {
        console.error('Error fetching state:', error);
      }
    };

    // Fetch team count
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        const teams = await response.json();
        setTeamCount(teams.length);
        
        // Add to logs if new teams joined
        if (teams.length > 0) {
          const newLog = {
            id: Date.now(),
            message: `${teams.length} Team(s) warten`,
            timestamp: new Date().toLocaleTimeString('de-DE'),
            type: 'info'
          };
          setLogs(prev => [newLog, ...prev].slice(0, 10)); // Keep last 10 logs
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchState();
    fetchTeams();
    const interval = setInterval(() => {
      fetchState();
      fetchTeams();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = async () => {
    try {
      const newState = !waitingRoomEnabled;
      const response = await fetch('/api/game/waiting-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newState })
      });

      if (response.ok) {
        setWaitingRoomEnabled(newState);
        const logMessage = newState ? '✅ Wartezimmer aktiviert' : '🎮 Spiel gestartet - Wartezimmer deaktiviert';
        setLogs(prev => [{
          id: Date.now(),
          message: logMessage,
          timestamp: new Date().toLocaleTimeString('de-DE'),
          type: newState ? 'success' : 'warning'
        }, ...prev].slice(0, 10));
        onToggle?.(newState);
      }
    } catch (error) {
      console.error('Error toggling waiting room:', error);
      setLogs(prev => [{
        id: Date.now(),
        message: '❌ Fehler beim Umschalten',
        timestamp: new Date().toLocaleTimeString('de-DE'),
        type: 'error'
      }, ...prev].slice(0, 10));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-stone-900">⏳ Wartezimmer</h3>
          <p className="text-sm text-stone-600">Kontrolliere den Spielstart</p>
        </div>
        <button
          onClick={handleToggle}
          className={`px-6 py-3 rounded-xl font-bold text-white transition-all ${
            waitingRoomEnabled
              ? 'bg-yellow-500 hover:bg-yellow-600 active:scale-95'
              : 'bg-green-500 hover:bg-green-600 active:scale-95'
          }`}
        >
          {waitingRoomEnabled ? '⏸ Wartezimmer aktiv' : '▶ Spiel starten'}
        </button>
      </div>

      {/* Status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1">Wartende Teams</p>
          <p className="text-3xl font-black text-blue-900">{teamCount}</p>
        </div>
        <div className={`rounded-xl p-4 ${waitingRoomEnabled ? 'bg-yellow-50' : 'bg-green-50'}`}>
          <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${waitingRoomEnabled ? 'text-yellow-600' : 'text-green-600'}`}>
            Status
          </p>
          <p className={`text-lg font-black ${waitingRoomEnabled ? 'text-yellow-900' : 'text-green-900'}`}>
            {waitingRoomEnabled ? '⏳ Wartend' : '🎮 Läuft'}
          </p>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-stone-50 rounded-xl p-4">
        <p className="text-xs text-stone-600 font-bold uppercase tracking-wide mb-3">📋 Aktivitäts-Log</p>
        <div className="space-y-2">
          {logs.length === 0 ? (
            <p className="text-sm text-stone-500 italic">Keine Aktivitäten</p>
          ) : (
            logs.slice(0, 3).map(log => (
              <div key={log.id} className="flex items-start gap-2 text-sm">
                <span className="text-xs text-stone-500 font-mono whitespace-nowrap">{log.timestamp}</span>
                <span className={`flex-1 ${
                  log.type === 'success' ? 'text-green-700' :
                  log.type === 'warning' ? 'text-yellow-700' :
                  log.type === 'error' ? 'text-red-700' :
                  'text-stone-700'
                }`}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-900 font-bold">💡 Wie funktioniert's?</p>
        <ul className="text-sm text-blue-800 mt-2 space-y-1">
          <li>✓ <strong>Wartezimmer aktiv:</strong> Teams sehen einen Wartebildschirm</li>
          <li>✓ <strong>Spiel starten:</strong> Klick den Button → Alle Teams können spielen</li>
          <li>✓ <strong>Logs:</strong> Alle Aktionen werden hier angezeigt</li>
        </ul>
      </div>
    </div>
  );
}
