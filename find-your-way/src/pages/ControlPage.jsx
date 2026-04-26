import { useState, useEffect, useRef } from 'react';
import { fetchStats } from '../api';

export default function ControlPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    loadStats();
    
    // Poll every 2 seconds
    pollIntervalRef.current = setInterval(() => {
      loadStats();
    }, 2000);

    return () => clearInterval(pollIntervalRef.current);
  }, []);

  async function loadStats() {
    try {
      const data = await fetchStats();
      setStats(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
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

  const { overall, teams } = stats;
  const maxXP = overall.maxXP;

  return (
    <div className="min-h-screen bg-blue-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-4 pt-6 pb-4 shadow-lg sticky top-0 z-10">
        <h1 className="text-3xl font-black">📊 Control Dashboard</h1>
        <p className="text-blue-200 text-sm mt-1">Live-Statistiken & Fortschritt</p>
        <p className="text-blue-300 text-xs mt-2">Aktualisiert: {new Date(stats.timestamp).toLocaleTimeString('de-DE')}</p>
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
            <p className="text-green-600 text-xs font-bold uppercase">Fertig</p>
            <p className="text-3xl font-black text-green-600 mt-1">{overall.teamsFinished}</p>
            <p className="text-xs text-gray-500 mt-1">Gruppen abgeschlossen</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-orange-600 text-xs font-bold uppercase">Ø Fortschritt</p>
            <p className="text-3xl font-black text-orange-600 mt-1">{overall.avgProgress}%</p>
            <p className="text-xs text-gray-500 mt-1">Durchschnitt</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-purple-600 text-xs font-bold uppercase">Ø XP</p>
            <p className="text-3xl font-black text-purple-600 mt-1">{overall.avgXP}</p>
            <p className="text-xs text-gray-500 mt-1">von {overall.maxXP}</p>
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
                <div key={team.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  {/* Rank */}
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                    {idx + 1}
                  </div>

                  {/* Team Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{team.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 truncate">{team.name}</p>
                        <p className="text-xs text-gray-500">
                          {team.completed}/{12} Stationen • {team.pending} ausstehend
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
                </div>
              ))}
          </div>
        </div>

        {/* Detailed Team Stats */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-blue-700 font-black text-lg mb-4">📋 Team-Details</h2>
          <div className="space-y-3">
            {teams.map(team => (
              <div key={team.id} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{team.icon}</span>
                    <div>
                      <p className="font-bold text-slate-800">{team.name}</p>
                      <p className="text-xs text-gray-500">
                        Erstellt: {new Date(team.created_at).toLocaleString('de-DE')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-blue-600">{team.progress}%</p>
                    <p className="text-xs text-gray-500">{team.completed}/12</p>
                  </div>
                </div>

                {/* Mini Progress Bar */}
                <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${team.progress}%` }}
                  />
                </div>

                {/* Stats Row */}
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-green-600 font-bold">✅ {team.completed} erledigt</span>
                  {team.pending > 0 && (
                    <span className="text-yellow-600 font-bold">⏳ {team.pending} ausstehend</span>
                  )}
                  <span className="text-blue-600 font-bold">⭐ {team.totalXP} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow p-6">
          <h2 className="font-black text-lg mb-4">📈 Zusammenfassung</h2>
          <div className="grid grid-cols-2 gap-4">
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
              <p className="text-blue-200 text-sm">Durchschn. Fortschritt</p>
              <p className="text-3xl font-black mt-1">{overall.avgProgress}%</p>
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
