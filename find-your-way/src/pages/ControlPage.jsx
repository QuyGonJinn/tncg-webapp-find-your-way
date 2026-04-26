import { useState, useEffect, useRef } from 'react';
import { fetchStats } from '../api';
import ParticipantManager from '../components/ParticipantManager';

export default function ControlPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [authenticated, setAuthenticated] = useState(() => {
    // Restore control board session from localStorage on mount
    return localStorage.getItem('fyw_control_authenticated') === 'true';
  });
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    if (!authenticated) return;
    
    loadStats();
    
    // Poll every 2 seconds
    pollIntervalRef.current = setInterval(() => {
      loadStats();
    }, 2000);

    return () => clearInterval(pollIntervalRef.current);
  }, [authenticated]);

  async function loadStats() {
    try {
      const data = await fetchStats();
      setStats(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    if (pin === '1234') {
      setAuthenticated(true);
      localStorage.setItem('fyw_control_authenticated', 'true');
      setLoginError('');
      setPin('');
    } else {
      setLoginError('Falscher PIN');
      setPin('');
    }
  }

  function handleLogout() {
    setAuthenticated(false);
    localStorage.removeItem('fyw_control_authenticated');
    setPin('');
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">📊</div>
          <h1 className="text-4xl font-black text-white tracking-tight">Control Board</h1>
          <p className="text-blue-100 mt-2 text-lg">Admin-Zugang erforderlich</p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleLogin}>
              <label className="block text-blue-900 font-bold mb-2 text-lg">PIN eingeben</label>
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="z.B. 1234"
                maxLength={4}
                className="w-full border-2 border-blue-200 rounded-2xl px-4 py-4 text-3xl font-black text-center tracking-widest focus:outline-none focus:border-blue-500 mb-6"
              />
              <button
                type="submit"
                disabled={pin.trim().length < 4}
                className="w-full bg-blue-600 disabled:bg-gray-300 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
              >
                Einloggen 🔑
              </button>
            </form>

            {loginError && <p className="text-red-500 text-sm text-center mt-3 font-semibold">{loginError}</p>}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-blue-600 font-bold text-lg">Lade Statistiken...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-red-600 font-bold text-lg">Fehler beim Laden der Statistiken</p>
      </div>
    );
  }

  const { overall, teams, gameState } = stats;
  const maxXP = overall.maxXP;
  const timeLeft = gameState?.timeLeft || 0;
  const timerRunning = gameState?.timerRunning || false;
  const isLowTime = timeLeft < 300; // < 5 minutes

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  return (
    <div className="min-h-screen bg-blue-50 pb-10">
      {/* Header */}
      <div className={`${isLowTime ? 'bg-gradient-to-r from-red-700 to-red-600' : 'bg-gradient-to-r from-blue-800 to-blue-600'} text-white px-4 pt-6 pb-4 shadow-lg sticky top-0 z-10 transition-colors`}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-3xl font-black">📊 Control Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-4xl font-black tracking-wider ${isLowTime ? 'animate-pulse' : ''}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm mt-1">
                {timerRunning ? '▶️ Läuft' : '⏸️ Pausiert'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </div>
        <p className="text-blue-100 text-sm">Live-Statistiken & Fortschritt</p>
        <p className="text-blue-200 text-xs mt-2">Aktualisiert: {new Date(stats.timestamp).toLocaleTimeString('de-DE')}</p>
      </div>

      <div className="px-4 mt-6 space-y-6">
        {/* Overall Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-blue-600 text-xs font-bold uppercase">Teams</p>
            <p className="text-3xl font-black text-blue-800 mt-1">{overall.totalTeams}</p>
            <p className="text-xs text-gray-500 mt-1">Gruppen registriert</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-purple-600 text-xs font-bold uppercase">Teilnehmer</p>
            <p className="text-3xl font-black text-purple-600 mt-1">{overall.totalParticipants}</p>
            <p className="text-xs text-gray-500 mt-1">Personen insgesamt</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-green-600 text-xs font-bold uppercase">Fertig</p>
            <p className="text-3xl font-black text-green-600 mt-1">{overall.teamsFinished}</p>
            <p className="text-xs text-gray-500 mt-1">Gruppen abgeschlossen</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-orange-600 text-xs font-bold uppercase">Ø Fortschritt</p>
            <p className="text-3xl font-black text-orange-600 mt-1">{overall.avgProgress}%</p>
            <p className="text-xs text-gray-500 mt-1">Durchschnitt</p>
          </div>
        </div>

        {/* Chat Stats */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-blue-700 font-black text-lg mb-3">💬 Chat-Aktivität</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Nachrichten gesamt</p>
              <p className="text-2xl font-black text-blue-600">{overall.totalMessages}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Ungelesen</p>
              <p className="text-2xl font-black text-red-600">{overall.unreadMessages}</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-blue-700 font-black text-lg mb-4">🏆 Rangliste</h2>
          <div className="space-y-3">
            {teams
              .sort((a, b) => b.totalXP - a.totalXP)
              .map((team, idx) => (
                <div key={team.id} className="border border-blue-100 rounded-xl overflow-hidden">
                  {/* Team Header */}
                  <button
                    onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                    className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    {/* Rank */}
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                      {idx + 1}
                    </div>

                    {/* Team Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{team.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 truncate">{team.name}</p>
                          <p className="text-xs text-gray-500">
                            {team.participantCount} Teilnehmer • {team.completed}/{12} Stationen • ⚡ {team.activeStations} aktiv
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="bg-blue-200 rounded-full h-2 mt-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${team.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* XP */}
                    <div className="text-right">
                      <p className="font-black text-blue-600 text-lg">{team.totalXP}</p>
                      <p className="text-xs text-gray-500">XP</p>
                    </div>

                    {/* Status Badge */}
                    <div className="ml-2">
                      {team.completed === 12 ? (
                        <span className="text-2xl">✅</span>
                      ) : team.pending > 0 ? (
                        <span className="text-2xl">⏳</span>
                      ) : (
                        <span className="text-2xl">🎮</span>
                      )}
                    </div>

                    {/* Expand Arrow */}
                    <span className={`text-xl transition-transform ${expandedTeam === team.id ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {/* Expanded Content */}
                  {expandedTeam === team.id && (
                    <div className="p-4 bg-white border-t border-blue-100 space-y-4">
                      {/* PIN and Active Stations */}
                      <div className="grid grid-cols-2 gap-3 bg-blue-50 p-3 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-600 font-bold">Zugangscode</p>
                          <p className="text-lg font-black text-blue-600 tracking-wider">{team.pin}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-bold">Aktive Stationen</p>
                          <p className="text-lg font-black text-orange-600">⚡ {team.activeStations}</p>
                        </div>
                      </div>

                      {/* Registered Participants - Editable */}
                      <div>
                        <h3 className="font-bold text-slate-800 mb-2">✅ Angemeldete Teilnehmer</h3>
                        <ParticipantManager
                          teamId={team.id}
                          participants={team.participants || []}
                          onUpdate={loadStats}
                        />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Erledigt</p>
                          <p className="text-lg font-black text-green-600">{team.completed}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Ausstehend</p>
                          <p className="text-lg font-black text-yellow-600">{team.pending}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">XP</p>
                          <p className="text-lg font-black text-blue-600">{team.totalXP}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow p-6">
          <h2 className="font-black text-lg mb-4">📈 Zusammenfassung</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-blue-200 text-sm">Gruppen gesamt</p>
              <p className="text-3xl font-black mt-1">{overall.totalTeams}</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">Teilnehmer gesamt</p>
              <p className="text-3xl font-black mt-1">{overall.totalParticipants}</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">Abschlussquote</p>
              <p className="text-3xl font-black mt-1">
                {overall.totalTeams > 0
                  ? Math.round((overall.teamsFinished / overall.totalTeams) * 100)
                  : 0}%
              </p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">Durchschn. XP</p>
              <p className="text-3xl font-black mt-1">{overall.avgXP}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
