import { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import AdminTimer from '../components/admin/AdminTimer';
import TeamCard from '../components/admin/TeamCard';
import AdminChat from '../components/admin/AdminChat';
import { STATIONS } from '../data/stations';

const MAX_XP = STATIONS.reduce((s, st) => s + st.points, 0);

export default function AdminPage() {
  const { teams, gameState, handleTimerStart, handleTimerPause, handleTimerReset, handleUncomplete, handleDeleteTeam, handleApprove, handleReject } = useAdmin();
  const [adminTab, setAdminTab] = useState('overview');
  const sorted = [...teams].sort((a, b) => b.totalXP - a.totalXP);

  return (
    <div className="min-h-screen bg-blue-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-4 pt-6 pb-4 shadow-lg">
        <h1 className="text-2xl font-black">🛠 Admin – Find Your Way</h1>
        <p className="text-blue-200 text-sm mt-1">{teams.length} Teams registriert</p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setAdminTab('overview')}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${adminTab === 'overview' ? 'bg-white text-blue-700' : 'bg-blue-700/50 text-blue-200'}`}
          >
            📊 Übersicht
          </button>
          <button
            onClick={() => setAdminTab('chat')}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${adminTab === 'chat' ? 'bg-white text-blue-700' : 'bg-blue-700/50 text-blue-200'}`}
          >
            💬 Chat
          </button>
        </div>
      </div>

      <div className="px-4 mt-4">
        {adminTab === 'overview' && (
          <>
            <AdminTimer
              gameState={gameState}
              onStart={handleTimerStart}
              onPause={handleTimerPause}
              onReset={handleTimerReset}
            />

            {teams.length > 0 && (
              <div className="bg-white rounded-2xl shadow p-4 mb-4">
                <h2 className="text-blue-700 font-black text-lg mb-3">🏆 Rangliste</h2>
                {sorted.map((team, i) => (
                  <div key={team.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-xl font-black text-gray-400 w-6">{i + 1}</span>
                    <span className="text-2xl">{team.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 text-sm">{team.name}</p>
                      <div className="bg-blue-100 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.round((team.totalXP / MAX_XP) * 100)}%` }} />
                      </div>
                    </div>
                    <span className="font-black text-blue-600 text-sm">{team.totalXP} XP</span>
                  </div>
                ))}
              </div>
            )}

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
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {adminTab === 'chat' && <AdminChat teams={teams} />}
      </div>
    </div>
  );
}
