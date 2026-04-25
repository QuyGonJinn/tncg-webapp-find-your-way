import { useAdmin } from '../hooks/useAdmin';
import AdminTimer from '../components/admin/AdminTimer';
import TeamCard from '../components/admin/TeamCard';
import { STATIONS } from '../data/stations';

const MAX_XP = STATIONS.reduce((s, st) => s + st.points, 0);

export default function AdminPage() {
  const { teams, gameState, handleTimerStart, handleTimerPause, handleTimerReset, handleUncomplete, handleDeleteTeam } = useAdmin();

  const sorted = [...teams].sort((a, b) => b.totalXP - a.totalXP);

  return (
    <div className="min-h-screen bg-slate-100 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-cyan-600 text-white px-4 pt-6 pb-4 shadow-lg">
        <h1 className="text-2xl font-black">🛠 Admin – Find Your Way</h1>
        <p className="text-cyan-100 text-sm mt-1">{teams.length} Teams registriert</p>
      </div>

      <div className="px-4 mt-4">
        <AdminTimer
          gameState={gameState}
          onStart={handleTimerStart}
          onPause={handleTimerPause}
          onReset={handleTimerReset}
        />

        {/* Leaderboard summary */}
        {teams.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-4 mb-4">
            <h2 className="text-teal-700 font-black text-lg mb-3">🏆 Rangliste</h2>
            {sorted.map((team, i) => (
              <div key={team.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <span className="text-xl font-black text-gray-400 w-6">{i + 1}</span>
                <span className="text-2xl">{team.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">{team.name}</p>
                  <div className="bg-cyan-100 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${Math.round((team.totalXP / MAX_XP) * 100)}%` }} />
                  </div>
                </div>
                <span className="font-black text-teal-600 text-sm">{team.totalXP} XP</span>
              </div>
            ))}
          </div>
        )}

        {/* Team details */}
        <h2 className="text-slate-600 font-black text-lg mb-3">Teams</h2>
        {teams.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-4xl mb-2">🌊</p>
            <p>Noch keine Teams registriert.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sorted.map(team => (
              <TeamCard
                key={team.id}
                team={team}
                onUncomplete={handleUncomplete}
                onDelete={handleDeleteTeam}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
